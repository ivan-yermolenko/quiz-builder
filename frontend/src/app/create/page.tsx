'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '@/services/api';
import { CreateQuizInput, QuestionType } from '@/types/quiz';
import styles from './create.module.css';
import QuestionBlock from './QuestionBlock';

const optionSchema = z.object({
  text: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
});

const questionSchema = z
  .object({
    text: z.string().min(1, 'Question text is required'),
    type: z.nativeEnum(QuestionType),
    order: z.number().int().min(0),
    options: z.array(optionSchema),
  })
  .superRefine((data, ctx) => {
    const { type, options } = data;

    if (type === QuestionType.BOOLEAN) {
      if (options.length !== 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Boolean question must have exactly 2 options.',
          path: ['options'],
        });
        return;
      }
      const correctCount = options.filter((o) => o.isCorrect).length;
      if (correctCount !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Boolean question must have exactly 1 correct answer.',
          path: ['options'],
        });
      }
    }

    if (type === QuestionType.INPUT) {
      if (options.length !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Input question must have exactly 1 answer option.',
          path: ['options'],
        });
        return;
      }
      if (!options[0].isCorrect) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'The answer option must be marked as correct.',
          path: ['options', 0, 'isCorrect'],
        });
      }
    }

    if (type === QuestionType.CHECKBOX) {
      if (options.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Checkbox question must have at least 1 option.',
          path: ['options'],
        });
        return;
      }
      const correctCount = options.filter((o) => o.isCorrect).length;
      if (correctCount < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least 1 option must be marked as correct.',
          path: ['options'],
        });
      }
    }
  });

const quizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
  questions: z.array(questionSchema).min(1, 'At least 1 question is required'),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export default function CreateQuizPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      questions: [
        {
          text: '',
          type: QuestionType.BOOLEAN,
          order: 0,
          options: [
            { text: 'True', isCorrect: true },
            { text: 'False', isCorrect: false },
          ],
        },
      ],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (values: QuizFormValues) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      // Map dynamic form values to direct API input structure
      const apiInput: CreateQuizInput = {
        title: values.title,
        questions: values.questions.map((q, qIndex) => ({
          text: q.text,
          type: q.type,
          order: qIndex,
          options: q.options.map((o) => ({
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        })),
      };

      await api.createQuiz(apiInput);
      router.push('/quizzes');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create quiz');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Create Quiz</h1>
        <p className={styles.subtitle}>Build your custom quiz by adding various question types.</p>
      </header>

      {submitError && <div className={styles.globalError}>⚠️ {submitError}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.card}>
          <div>
            <label htmlFor="title" className={styles.label}>
              Quiz Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter quiz title e.g. Javascript Basics"
              className={styles.input}
              {...register('title')}
            />
            {errors.title && <p className={styles.errorText}>{errors.title.message}</p>}
          </div>
        </div>

        <div className={styles.questionListHeader}>
          <h2 className={styles.sectionTitle}>Questions</h2>
          {errors.questions?.message && (
            <p className={styles.errorText}>{errors.questions.message}</p>
          )}
        </div>

        {questionFields.map((field, index) => (
          <QuestionBlock
            key={field.id}
            index={index}
            field={field}
            control={control}
            register={register}
            errors={errors}
            setValue={setValue}
            removeQuestion={removeQuestion}
            showDelete={questionFields.length > 1}
          />
        ))}

        <button
          type="button"
          onClick={() =>
            appendQuestion({
              text: '',
              type: QuestionType.BOOLEAN,
              order: questionFields.length,
              options: [
                { text: 'True', isCorrect: true },
                { text: 'False', isCorrect: false },
              ],
            })
          }
          className={styles.addQuestionBtn}
        >
          + Add Question
        </button>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => router.push('/quizzes')}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
          <button type="submit" disabled={submitting} className={styles.submitBtn}>
            {submitting ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}
