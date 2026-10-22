import type { Exercise, Localized } from '../src/lib/exercises/grading.ts';

/** Authoring/review metadata retained alongside the server grading model. */
export type BankExercise = Exercise & {
  objectiveId: string;
  prerequisites: string[];
  misconceptions: string[];
  provenance: {
    origin: string;
    coveragePages: number[];
    sourceTitle?: string;
    referenceBasis?: string;
  };
  grading: { kind: string; rejectUnknownFields: boolean };
  evidence: {
    eligibleOnFirstIndependentResponse: boolean;
    hintsOrRevealedSolutionsEligible: boolean;
    retriesEligible: boolean;
  };
  variables?: string[];
};
export type ExerciseBank = {
  lessonId: string;
  version: number;
  status?: string;
  exerciseCount: number;
  exercises: BankExercise[];
};
export type ReleaseRecord = {
  version: number;
  practice?: boolean;
  review: string;
  evidence: string;
  translation: {
    source: string;
    target: string;
    review: string;
    evidence: string;
    sourceFingerprint: string;
  };
  fingerprints: Record<string, string>;
};
export type Releases = { lessons: Record<string, ReleaseRecord> };
export type { Localized };
