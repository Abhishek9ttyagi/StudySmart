export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  date: string;
  guideContent: string;
  topics: string[];
}

export interface QuizQuestion {
  type: "multiple-choice" | "fill-in-the-blank";
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  documentId: string;
  date: string;
  topic: string;
  difficulty: string;
  score: number;
  total: number;
  questions: {
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
}
