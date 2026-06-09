import { PlusIcon } from '@/components/icons';
import styles from './quizzes.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>All Quizzes</h1>
          <p className={styles.subtitle}>Loading quizzes...</p>
        </div>
        <button
          disabled
          className={styles.createBtn}
          style={{ opacity: 0.7, cursor: 'not-allowed' }}
        >
          <PlusIcon />
          Create Quiz
        </button>
      </div>

      <div className={styles.filterSection}>
        <div
          className={styles.searchInput}
          style={{ height: '2.5rem', background: 'var(--border)', opacity: 0.3 }}
        />
      </div>

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
    </div>
  );
}
