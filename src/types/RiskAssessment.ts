export interface Question {
  id: number;
  question: string;
  options: Array<{
    text: string;
    points: number;
  }>;
}

export interface Answer {
  questionId: number;
  answer: string;
  points: number;
}
