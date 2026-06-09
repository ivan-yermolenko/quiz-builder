import { Metadata } from 'next';
import { api } from '@/services/api';
import { QuizListItem } from '@/types/quiz';
import QuizListClient from './QuizListClient';

export const metadata: Metadata = {
  title: 'All Quizzes | Quiz Builder',
  description: 'Browse, search, and manage all your quizzes in one place.',
};

export default async function QuizzesPage() {
  let quizzes: QuizListItem[] = [];
  let errorMessage: string | null = null;

  try {
    quizzes = await api.getQuizzes();
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Failed to load quizzes';
  }

  return <QuizListClient initialQuizzes={quizzes} initialError={errorMessage} />;
}
