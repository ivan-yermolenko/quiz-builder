'use client';

import { Control, UseFormRegister, UseFormSetValue, FieldErrors, useWatch } from 'react-hook-form';
import { TrashIcon } from '@/components/icons';
import { QuestionType } from '@/types/quiz';
import styles from './create.module.css';

interface OptionDto {
  text: string;
  isCorrect: boolean;
}

interface QuestionDto {
  text: string;
  type: QuestionType;
  order: number;
  options: OptionDto[];
}

interface QuizFormValues {
  title: string;
  questions: QuestionDto[];
}

interface QuestionBlockProps {
  index: number;
  field: { id: string };
  control: Control<QuizFormValues>;
  register: UseFormRegister<QuizFormValues>;
  errors: FieldErrors<QuizFormValues>;
  setValue: UseFormSetValue<QuizFormValues>;
  removeQuestion: (index: number) => void;
  showDelete: boolean;
}

export default function QuestionBlock({
  index,
  field,
  control,
  register,
  errors,
  setValue,
  removeQuestion,
  showDelete,
}: QuestionBlockProps) {
  // Watch ONLY this specific question at this index
  const currentQuestionWatch =
    useWatch({
      control,
      name: `questions.${index}`,
    }) || field;

  const questionType = currentQuestionWatch.type;

  const handleTypeChange = (newType: QuestionType) => {
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

  const handleBooleanCorrectChange = (correctOptionIndex: number) => {
    setValue(`questions.${index}.options.0.isCorrect`, correctOptionIndex === 0);
    setValue(`questions.${index}.options.1.isCorrect`, correctOptionIndex === 1);
  };

  return (
    <div className={styles.questionBlock}>
      <div className={styles.questionHeader}>
        <span className={styles.questionNum}>Question #{index + 1}</span>
        {showDelete && (
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

      <div>
        <label className={styles.label}>Question Type</label>
        <select
          value={questionType}
          onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
          className={styles.select}
        >
          <option value="BOOLEAN">True / False</option>
          <option value="INPUT">Short Text Answer</option>
          <option value="CHECKBOX">Multiple Choice (Checkbox)</option>
        </select>
      </div>

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
                  onChange={() => handleBooleanCorrectChange(0)}
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

            <div className={styles.optionRow}>
              <div className={styles.optionCheckWrapper}>
                <input
                  type="radio"
                  id={`q-${index}-opt-false`}
                  name={`questions.${index}.booleanCorrect`}
                  checked={currentQuestionWatch.options?.[1]?.isCorrect || false}
                  onChange={() => handleBooleanCorrectChange(1)}
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
                    {...register(`questions.${index}.options.${optIndex}.isCorrect` as const)}
                  />
                </div>
                <input
                  type="text"
                  placeholder={`Option #${optIndex + 1}`}
                  className={styles.input}
                  {...register(`questions.${index}.options.${optIndex}.text` as const)}
                />
                {(currentQuestionWatch.options?.length ?? 0) > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const opts = [...(currentQuestionWatch.options || [])];
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
}
