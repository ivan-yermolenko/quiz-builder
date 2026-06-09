'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { EmptyIcon, ArrowLeftIcon } from '@/components/icons';
import styles from './error.module.css';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapperError}>
          <EmptyIcon size={40} style={{ transform: 'rotate(45deg)' }} />
        </div>
        <h2 className={styles.title}>Something went wrong!</h2>
        <p className={styles.description}>
          An unexpected error occurred while rendering this page. We apologize for the
          inconvenience.
        </p>
        <div className={styles.actions}>
          <button onClick={() => reset()} className={styles.button}>
            Try again
          </button>
          <Link href="/quizzes" className={styles.buttonSecondary}>
            <ArrowLeftIcon /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
