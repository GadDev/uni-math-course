// Server only. Client components import types, never this answer-bearing module.
import logic from '../../../exercises/exams/C01/v1.json';
import lines from '../../../exercises/exams/C02/v1.json';
import functions from '../../../exercises/exams/C03/v1.json';
import type { TrainingExam } from './types.ts';

export const examBank: ReadonlyMap<string, TrainingExam> = new Map(
  [logic, lines, functions].map((exam) => [
    exam.chapterId,
    exam as TrainingExam,
  ]),
);
