'use client';

import Link from 'next/link';
import { TrashIcon, HelpCircleIcon, CalendarIcon } from '@/components/icons';
import { QuizListItem } from '@/types/quiz';
import styles from './QuizCard.module.css';

interface QuizCardProps {
  quiz: QuizListItem;
  onDelete: (id: string) => Promise<void>;
}

export default function QuizCard({ quiz, onDelete }: QuizCardProps) {
  const formattedDate = new Date(quiz.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page
    e.stopPropagation(); // Stop click bubbling to the card link wrapper
    if (confirm(`Are you sure you want to delete the quiz "${quiz.title}"?`)) {
      await onDelete(quiz.id);
    }
  };

  return (
    <Link href={`/quizzes/${quiz.id}`} className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{quiz.title}</h3>

        <button
          onClick={handleDelete}
          className={styles.deleteBtn}
          title="Delete Quiz"
          aria-label={`Delete ${quiz.title}`}
        >
          <TrashIcon />
        </button>

        <div className={styles.footer}>
          <span className={styles.badge}>
            <HelpCircleIcon style={{ marginRight: '2px' }} />
            {quiz.questionsCount} {quiz.questionsCount === 1 ? 'Question' : 'Questions'}
          </span>
          <span className={styles.date}>
            <CalendarIcon style={{ marginRight: '2px' }} />
            {formattedDate}
          </span>
        </div>
      </div>
    </Link>
  );
}
