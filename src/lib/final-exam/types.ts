export const BANK_VERSION = 1;
export const DURATION_MS = 120 * 60 * 1000;
export const topics = {
  logique: 'Logique et quantificateurs',
  nombres: 'Nombres et algèbre',
  droites: 'Droites et régression',
  fonctions: 'Fonctions et dérivées',
  croissance: 'Exponentielles, logarithmes et complexité',
  information: 'Information et codage',
} as const;
export type Topic = keyof typeof topics;
export type Field = {
  id: string;
  label: string;
  answer: string;
  tolerance?: number;
};
export type Question = {
  id: string;
  family: string;
  slot: string;
  topic: Topic;
  objective: string;
  lessonId: string;
  prerequisites: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  minutes: number;
  prompt: string;
  explanation: string;
  pitfall: string;
  verification: string;
  graph?: { points: [number, number][]; description: string };
} & (
  | {
      type: 'single' | 'multi';
      options: { id: string; label: string; feedback: string }[];
      answer: string[];
    }
  | { type: 'numeric'; fields: Field[] }
  | { type: 'written'; rubric: { label: string; points: number }[] }
);
export type PublicQuestion = Omit<
  Question,
  | 'explanation'
  | 'pitfall'
  | 'verification'
  | 'answer'
  | 'fields'
  | 'options'
  | 'rubric'
> & {
  fields?: Omit<Field, 'answer'>[];
  options?: { id: string; label: string }[];
};
export type Paper = {
  version: number;
  seed: number;
  startedAt: number;
  deadline: number;
  ids: string[];
  questions: PublicQuestion[];
};
export type Response = string[] | Record<string, string> | string;
export type Responses = Record<string, Response>;
export type Mark = {
  id: string;
  topic: Topic;
  earned: number | null;
  maximum: number;
  explanation: string;
  pitfall: string;
  answer?: string[] | Record<string, string>;
  feedback?: { id: string; text: string; correct: boolean }[];
  fields?: Record<string, boolean>;
  rubric?: { label: string; points: number }[];
};
export type Result = {
  version: number;
  marks: Mark[];
  automatic: number;
  automaticMaximum: number;
  manualMaximum: number;
};
export type History = { id: string; seen: number }[];

export const blueprint = Object.keys(topics).flatMap((topic) =>
  (
    [
      ['easy', 2, 4],
      ['medium', 3, 6],
      ['hard', 5, 8],
    ] as const
  ).map(([difficulty, marks, minutes], i) => ({
    slot: `${topic}-${i + 1}`,
    topic: topic as Topic,
    difficulty,
    marks,
    minutes,
  })),
);
