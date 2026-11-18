import type { Locale } from '../i18n.ts';

export const topics = ['truth', 'implication', 'equivalence', 'laws'] as const;
export const levels = ['discovery', 'exam', 'challenge'] as const;
export type Topic = (typeof topics)[number];
export type Level = (typeof levels)[number];
export type Bilingual = Record<Locale, string>;
export const say = (fr: string, en: string): Bilingual => ({ fr, en });

type Table = { columns: string[]; rows: (string | number)[][] };
type PublicBase = { id: string; topic: Topic; prompt: string; detail?: string };
export type PublicQuestion = PublicBase &
  (
    | { kind: 'choice'; options: string[] }
    | { kind: 'table'; table: Table }
    | { kind: 'formula' }
    | { kind: 'rewrite'; options: string[] }
  );
export type Grade =
  | { state: 'incorrect'; message: string; hint: string; cells?: boolean[] }
  | { state: 'continue'; message: string; question: PublicQuestion }
  | {
      state: 'correct' | 'revealed';
      message: string;
      solution: string;
      table?: Table;
    };

export const referencePath =
  '/pdfs/revision/fiche-logique-propositionnelle-fr.pdf';
export const lessonForTopic: Record<Topic, string> = {
  truth: 'L03',
  implication: 'L06',
  equivalence: 'L07',
  laws: 'L04',
};
