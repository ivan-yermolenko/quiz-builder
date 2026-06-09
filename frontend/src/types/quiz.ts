export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export interface Option {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  text: string;
  order: number;
  options: Option[];
}

export interface Quiz {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

export interface QuizListItem {
  id: string;
  title: string;
  questionsCount: number;
  createdAt: string;
}

export interface CreateOptionInput {
  text: string;
  isCorrect: boolean;
}

export interface CreateQuestionInput {
  text: string;
  type: QuestionType;
  order: number;
  options: CreateOptionInput[];
}

export interface CreateQuizInput {
  title: string;
  questions: CreateQuestionInput[];
}
