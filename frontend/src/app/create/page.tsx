'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { TrashIcon } from '@/components/icons';
import { api } from '@/services/api';
import { CreateQuizInput, QuestionType } from '@/types/quiz';
import styles from './create.module.css';

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

  const questionsWatch = useWatch({
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

  const handleTypeChange = (index: number, newType: QuestionType) => {
    // Dynamically adjust options state when changing question types
    if (newType === QuestionType.BOOLEAN) {
      setValue(`questions.${index}.options`, [
        { text: 'True', isCorrect: true },
        { text: 'False', isCorrect: false },
      ]);
    } else if (newType === QuestionType.INPUT) {
      setValue(`questions.${index}.options`, [{ text: '', isCorrect: true }]);
    } else if (newType === QuestionType.CHECKBOX) {
      setValue(`questions.${index}.options`, [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
      ]);
    }
    setValue(`questions.${index}.type`, newType);
  };

  const handleBooleanCorrectChange = (questionIndex: number, correctOptionIndex: number) => {
    setValue(`questions.${questionIndex}.options.0.isCorrect`, correctOptionIndex === 0);
    setValue(`questions.${questionIndex}.options.1.isCorrect`, correctOptionIndex === 1);
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

        {questionFields.map((field, index) => {
          const currentQuestionWatch = questionsWatch?.[index] || field;
          const questionType = currentQuestionWatch.type;

          return (
            <div key={field.id} className={styles.questionBlock}>
              <div className={styles.questionHeader}>
                <span className={styles.questionNum}>Question #{index + 1}</span>
                {questionFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className={styles.deleteQuestionBtn}
                  >
                    <TrashIcon size={14} />
                    Delete Question
                  </button>
                )}
              </div>

              <div>
                <label className={styles.label}>Question Text</label>
                <input
                  type="text"
                  placeholder="Enter the question text"
                  className={styles.input}
                  {...register(`questions.${index}.text` as const)}
                />
                {errors.questions?.[index]?.text && (
                  <p className={styles.errorText}>{errors.questions[index]?.text?.message}</p>
                )}
              </div>

              {/* Question Type Selection */}
              <div>
                <label className={styles.label}>Question Type</label>
                <select
                  value={questionType}
                  onChange={(e) => handleTypeChange(index, e.target.value as QuestionType)}
                  className={styles.select}
                >
                  <option value="BOOLEAN">True / False</option>
                  <option value="INPUT">Short Text Answer</option>
                  <option value="CHECKBOX">Multiple Choice (Checkbox)</option>
                </select>
              </div>

              {/* Question Answer Options Sections */}
              <div className={styles.optionsSection}>
                <div className={styles.optionsHeader}>
                  <span className={styles.optionsTitle}>
                    {questionType === QuestionType.INPUT ? 'Correct Answer' : 'Answer Options'}
                  </span>
                  {questionType === QuestionType.CHECKBOX && (
                    <button
                      type="button"
                      onClick={() => {
                        const currentOptions = currentQuestionWatch.options || [];
                        setValue(`questions.${index}.options`, [
                          ...currentOptions,
                          { text: '', isCorrect: false },
                        ]);
                      }}
                      className={styles.addOptionBtn}
                    >
                      + Add Option
                    </button>
                  )}
                </div>

                {errors.questions?.[index]?.options && (
                  <p className={styles.errorText}>{errors.questions[index]?.options?.message}</p>
                )}

                {/* Conditional options rendering by question type */}
                {questionType === QuestionType.BOOLEAN && (
                  <div className={styles.optionsList}>
                    {/* True Option */}
                    <div className={styles.optionRow}>
                      <div className={styles.optionCheckWrapper}>
                        <input
                          type="radio"
                          id={`q-${index}-opt-true`}
                          name={`questions.${index}.booleanCorrect`}
                          checked={currentQuestionWatch.options?.[0]?.isCorrect || false}
                          onChange={() => handleBooleanCorrectChange(index, 0)}
                          className={styles.radio}
                        />
                      </div>
                      <input
                        type="text"
                        readOnly
                        value="True"
                        className={styles.input}
                        style={{ background: 'rgba(0,0,0,0.02)', cursor: 'default' }}
                      />
                    </div>

                    {/* False Option */}
                    <div className={styles.optionRow}>
                      <div className={styles.optionCheckWrapper}>
                        <input
                          type="radio"
                          id={`q-${index}-opt-false`}
                          name={`questions.${index}.booleanCorrect`}
                          checked={currentQuestionWatch.options?.[1]?.isCorrect || false}
                          onChange={() => handleBooleanCorrectChange(index, 1)}
                          className={styles.radio}
                        />
                      </div>
                      <input
                        type="text"
                        readOnly
                        value="False"
                        className={styles.input}
                        style={{ background: 'rgba(0,0,0,0.02)', cursor: 'default' }}
                      />
                    </div>
                  </div>
                )}

                {questionType === QuestionType.INPUT && (
                  <div className={styles.optionsList}>
                    <div className={styles.optionRow}>
                      <input
                        type="text"
                        placeholder="Enter the correct text answer"
                        className={styles.input}
                        {...register(`questions.${index}.options.0.text` as const)}
                      />
                    </div>
                    {errors.questions?.[index]?.options?.[0]?.text && (
                      <p className={styles.errorText}>
                        {errors.questions[index]?.options?.[0]?.text?.message}
                      </p>
                    )}
                  </div>
                )}

                {questionType === QuestionType.CHECKBOX && (
                  <div className={styles.optionsList}>
                    {currentQuestionWatch.options?.map((option, optIndex) => (
                      <div key={optIndex} className={styles.optionRow}>
                        <div className={styles.optionCheckWrapper}>
                          <input
                            type="checkbox"
                            className={styles.checkbox}
                            {...register(
                              `questions.${index}.options.${optIndex}.isCorrect` as const,
                            )}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder={`Option #${optIndex + 1}`}
                          className={styles.input}
                          {...register(`questions.${index}.options.${optIndex}.text` as const)}
                        />
                        {currentQuestionWatch.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const opts = [...currentQuestionWatch.options];
                              opts.splice(optIndex, 1);
                              setValue(`questions.${index}.options`, opts);
                            }}
                            className={styles.deleteOptionBtn}
                            title="Delete Option"
                          >
                            <TrashIcon size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Question Button */}
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

        {/* Action Buttons */}
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
