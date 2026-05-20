export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizData {
  summary: string;
  quiz: QuizQuestion[];
}

export interface UserQuiz {
  id?: string;
  userId: string;
  material: string;
  summary: string;
  quiz: QuizQuestion[];
  score?: number;
  createdAt: any;
}
