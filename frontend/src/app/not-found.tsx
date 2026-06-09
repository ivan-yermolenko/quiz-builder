import Link from 'next/link';
import { EmptyIcon, ArrowLeftIcon } from '@/components/icons';
import styles from './error.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <EmptyIcon size={40} />
        </div>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.description}>
          Sorry, we couldn&apos;t find the quiz or page you were looking for. It might have been
          deleted or the URL is incorrect.
        </p>
        <div className={styles.actions}>
          <Link href="/quizzes" className={styles.button}>
            <ArrowLeftIcon /> Back to Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
}
