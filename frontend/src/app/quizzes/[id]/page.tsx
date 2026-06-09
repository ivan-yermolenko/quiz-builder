import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeftIcon, CalendarIcon, HelpCircleIcon } from '@/components/icons';
import { api } from '@/services/api';
import { QuestionType } from '@/types/quiz';
import styles from './detail.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

const QUESTION_TYPE_CONFIG = {
  [QuestionType.INPUT]: {
    badgeClass: styles.badgeInput,
    displayType: 'Text Input',
  },
  [QuestionType.CHECKBOX]: {
    badgeClass: styles.badgeCheckbox,
    displayType: 'Multiple Choice',
  },
  [QuestionType.BOOLEAN]: {
    badgeClass: styles.badgeBoolean,
    displayType: 'True/False',
  },
} as const;

// Generate dynamic metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const quiz = await api.getQuiz(id);
    return {
      title: `${quiz.title} | Quiz Builder`,
      description: `Detailed structure of the quiz "${quiz.title}".`,
    };
  } catch {
    return {
      title: 'Quiz Details | Quiz Builder',
    };
  }
}

export default async function QuizDetailPage({ params }: PageProps) {
  const { id } = await params;
  let quiz = null;
  let errorMessage: string | null = null;

  try {
    quiz = await api.getQuiz(id);
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Failed to load quiz details';
  }

  if (errorMessage || !quiz) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className={styles.errorTitle}>Quiz Not Found</div>
          <p className={styles.errorText}>
            {errorMessage || 'The quiz you are looking for does not exist or has been deleted.'}
          </p>
          <Link href="/quizzes" className={styles.backBtn}>
            <ArrowLeftIcon />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(quiz.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/quizzes" className={styles.backBtn}>
          <ArrowLeftIcon />
          Back to Dashboard
        </Link>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{quiz.title}</h1>
        </div>
        <div className={styles.metaInfo}>
          <span className={styles.metaItem}>
            <CalendarIcon />
            Created on {formattedDate}
          </span>
          <span className={styles.metaItem}>
            <HelpCircleIcon />
            {quiz.questions.length} {quiz.questions.length === 1 ? 'Question' : 'Questions'}
          </span>
        </div>
      </header>

      <section className={styles.questionList}>
        {quiz.questions.map((question, index) => {
          const badgeClass = QUESTION_TYPE_CONFIG[question.type].badgeClass;
          const displayType = QUESTION_TYPE_CONFIG[question.type].displayType;

          return (
            <div key={question.id} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <h3 className={styles.questionText}>
                  {index + 1}. {question.text}
                </h3>
                <span className={`${styles.badge} ${badgeClass}`}>{displayType}</span>
              </div>

              {question.type === QuestionType.INPUT ? (
                <div className={styles.inputWrapper}>
                  <span className={styles.inputLabel}>Correct Answer:</span>
                  <input
                    type="text"
                    readOnly
                    value={question.options[0]?.text ?? ''}
                    className={styles.inputField}
                  />
                </div>
              ) : (
                <div className={styles.optionsContainer}>
                  {question.options.map((option) => {
                    const isCorrect = option.isCorrect;
                    return (
                      <div
                        key={option.id}
                        className={`${styles.optionItem} ${isCorrect ? styles.correctOption : ''}`}
                      >
                        <input
                          type={question.type === QuestionType.BOOLEAN ? 'radio' : 'checkbox'}
                          readOnly
                          checked={isCorrect}
                          className={styles.optionControl}
                        />
                        <span>{option.text}</span>
                        {isCorrect && <span className={styles.correctLabel}>Correct</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
