export type Localized = { fr: string; en: string };
export type ExamResponse = string[] | Record<string, string>;
export type ExamResponses = Record<string, ExamResponse>;

type QuestionBase = {
  id: string;
  lessonId: string;
  objective: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prerequisites: string[];
  prompt: Localized;
  graph?: 'values' | 'tangent' | 'line';
};
export type PublicQuestion = QuestionBase &
  (
    | {
        type: 'single' | 'multi';
        options: { id: string; label: Localized }[];
      }
    | {
        type: 'numeric';
        fields: { id: string; label: Localized }[];
      }
  );
export type ExamQuestion = QuestionBase & {
  explanation: Localized;
  pitfall: Localized;
} & (
    | {
        type: 'single' | 'multi';
        options: { id: string; label: Localized; feedback: Localized }[];
        answer: string[];
      }
    | {
        type: 'numeric';
        fields: { id: string; label: Localized; answer: string }[];
      }
  );
export type PublicExam = {
  id: string;
  version: number;
  chapterId: string;
  title: Localized;
  suggestedMinutes: number;
  questions: PublicQuestion[];
};
export type TrainingExam = Omit<PublicExam, 'questions'> & {
  questions: ExamQuestion[];
  review: {
    mathematics: string;
    translation: string;
    evidence: string;
  };
  provenance: { origin: string; styleReference: string };
  grading: {
    pointsPerQuestion: number;
    partialCredit: boolean;
    negativeMarking: boolean;
    numeric: string;
  };
};
export type QuestionResult = {
  id: string;
  correct: boolean;
  skipped: boolean;
  explanation: Localized;
  pitfall: Localized;
  answer: string[] | Record<string, string>;
  feedback?: { id: string; correct: boolean; text: Localized }[];
  fields?: Record<string, boolean>;
};
export type ExamResult = {
  examId: string;
  version: number;
  score: number;
  total: number;
  questions: QuestionResult[];
};
