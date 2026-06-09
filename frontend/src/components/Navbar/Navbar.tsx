'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  const isQuizzesActive = pathname.startsWith('/quizzes');
  const isCreateActive = pathname === '/create';

  return (
    <header className={styles.header}>
      <nav className={styles.navContainer}>
        <Link href="/quizzes" className={styles.logo}>
          ⚡ QuizBuilder
        </Link>
        <div className={styles.navLinks}>
          <Link
            href="/quizzes"
            className={`${styles.link} ${isQuizzesActive ? styles.activeLink : ''}`}
          >
            All Quizzes
          </Link>
          <Link
            href="/create"
            className={`${styles.link} ${isCreateActive ? styles.activeLink : ''}`}
          >
            Create Quiz
          </Link>
        </div>
      </nav>
    </header>
  );
}
