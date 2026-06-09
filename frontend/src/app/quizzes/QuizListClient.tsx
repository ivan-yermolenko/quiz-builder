'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import QuizCard from '@/components/QuizCard/QuizCard';
import { PlusIcon, SearchIcon, EmptyIcon } from '@/components/icons';
import { api } from '@/services/api';
import { QuizListItem } from '@/types/quiz';
import styles from './quizzes.module.css';

interface QuizListClientProps {
  initialQuizzes: QuizListItem[];
  initialError?: string | null;
}

export default function QuizListClient({
  initialQuizzes,
  initialError = null,
}: QuizListClientProps) {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>(initialQuizzes);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(initialError);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete quiz');
    }
  };

  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>All Quizzes</h1>
          <p className={styles.subtitle}>
            {loading
              ? 'Loading quizzes...'
              : `Showing ${filteredQuizzes.length} of ${quizzes.length} available quizzes`}
          </p>
        </div>
        <Link href="/create" className={styles.createBtn}>
          <PlusIcon />
          Create Quiz
        </Link>
      </div>

      {/* Filter / Search Bar */}
      {!error && (quizzes.length > 0 || searchTerm) && (
        <div className={styles.filterSection}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search quizzes by title..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={styles.errorState}>
          <p>⚠️ {error}</p>
          <button onClick={() => void fetchQuizzes()} className={styles.retryBtn}>
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonMeta}>
                <div className={styles.skeletonBadge} />
                <div className={styles.skeletonDate} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loaded Content */}
      {!loading && !error && (
        <>
          {filteredQuizzes.length > 0 ? (
            <div className={styles.grid}>
              {filteredQuizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <EmptyIcon />
              </div>
              <h2 className={styles.emptyTitle}>
                {searchTerm ? 'No quizzes match your search' : 'No quizzes found'}
              </h2>
              <p className={styles.emptyText}>
                {searchTerm
                  ? 'Try checking for typos or searching for another keyword.'
                  : 'Start by creating your very first quiz and test the builder!'}
              </p>
              {!searchTerm && (
                <Link href="/create" className={styles.createBtn}>
                  Get Started
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
