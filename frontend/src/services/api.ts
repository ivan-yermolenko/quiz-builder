import { CreateQuizInput, Quiz, QuizListItem } from '@/types/quiz';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3500/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'An error occurred while communicating with the API';
    try {
      const errorData = (await response.json()) as { message?: string | string[] };
      if (errorData.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  async getQuizzes(): Promise<QuizListItem[]> {
    const res = await fetch(`${API_BASE_URL}/quizzes`, {
      cache: 'no-store',
    });
    return handleResponse<QuizListItem[]>(res);
  },

  async getQuiz(id: string): Promise<Quiz> {
    const res = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
      cache: 'no-store',
    });
    return handleResponse<Quiz>(res);
  },

  async createQuiz(input: CreateQuizInput): Promise<Quiz> {
    const res = await fetch(`${API_BASE_URL}/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    return handleResponse<Quiz>(res);
  },

  async deleteQuiz(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ success: boolean }>(res);
  },
};
