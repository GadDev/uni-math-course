import {
  grade,
  parseResponse,
  type Exercise,
  type ExerciseResponse,
  type GradeResult,
} from './grading.ts';

export type AttemptRow = {
  id: string;
  userId: string;
  submissionId: string;
  exerciseId: string;
  exerciseVersion: number;
  response: ExerciseResponse;
  correct: boolean;
  hintUsed: boolean;
  independentEvidence: boolean;
  locale: 'fr' | 'en';
  createdAt: string;
};
export type NewAttempt = Omit<
  AttemptRow,
  'id' | 'createdAt' | 'independentEvidence'
> & {
  lessonId: string;
};

/** Persistence seam: the Supabase store in production, an in-memory one in tests. */
export interface AttemptStore {
  findBySubmission(
    userId: string,
    submissionId: string,
  ): Promise<AttemptRow | null>;
  /** Atomically determines first-attempt evidence and inserts; duplicates return 'duplicate'. */
  insert(attempt: NewAttempt): Promise<AttemptRow | 'duplicate'>;
}

export type SubmitResult = { status: number; body: unknown };

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const result = (
  attempt: AttemptRow,
  graded: GradeResult,
  duplicate: boolean,
) => ({
  status: duplicate ? 200 : 201,
  body: {
    attemptId: attempt.id,
    duplicate,
    exerciseId: attempt.exerciseId,
    exerciseVersion: attempt.exerciseVersion,
    response: attempt.response,
    hintUsed: attempt.hintUsed,
    correct: attempt.correct,
    independentEvidence: attempt.independentEvidence,
    feedback: graded.feedback,
    explanation: graded.explanation,
    correctAnswer: graded.correctAnswer,
    ...(graded.rowResults && { rowResults: graded.rowResults }),
  },
});

/**
 * Validate, grade and record one submission for an already verified user.
 * Grades are derived here from the server-held bank; any grade-like field in
 * the body is ignored. Resubmitting the same submissionId returns the stored
 * attempt and never creates a second row.
 */
export async function submitAttempt(input: {
  userId: string;
  body: unknown;
  exercises: ReadonlyMap<string, Exercise>;
  store: AttemptStore;
}): Promise<SubmitResult> {
  const { userId, body, exercises, store } = input;
  const bad = (error: string, status = 400): SubmitResult => ({
    status,
    body: { error },
  });
  if (typeof body !== 'object' || body === null || Array.isArray(body))
    return bad('invalid_body');
  const { submissionId, exerciseId, version, locale, hintUsed, response } =
    body as Record<string, unknown>;
  if (typeof submissionId !== 'string' || !UUID.test(submissionId))
    return bad('invalid_submission_id');
  if (typeof exerciseId !== 'string') return bad('invalid_exercise');
  if (locale !== 'fr' && locale !== 'en') return bad('invalid_locale');
  if (hintUsed !== undefined && typeof hintUsed !== 'boolean')
    return bad('invalid_hint_flag');
  const exercise = exercises.get(exerciseId);
  if (!exercise) return bad('unknown_exercise', 404);
  if (version !== exercise.version) return bad('version_mismatch', 409);

  const existing = await store.findBySubmission(userId, submissionId);
  if (existing) {
    if (
      existing.exerciseId !== exercise.id ||
      existing.exerciseVersion !== exercise.version
    )
      return bad('submission_id_reused', 409);
    return result(existing, grade(exercise, existing.response), true);
  }

  const parsed = parseResponse(exercise, response);
  if (!parsed) return bad('invalid_response');
  const graded = grade(exercise, parsed);
  const unaided = hintUsed !== true;
  const saved = await store.insert({
    userId,
    submissionId,
    lessonId: exercise.lessonId,
    exerciseId: exercise.id,
    exerciseVersion: exercise.version,
    response: parsed,
    correct: graded.correct,
    hintUsed: !unaided,
    locale,
  });
  if (saved === 'duplicate') {
    // A concurrent identical submission won the race: return its stored row.
    const winner = await store.findBySubmission(userId, submissionId);
    if (
      winner &&
      (winner.exerciseId !== exercise.id ||
        winner.exerciseVersion !== exercise.version)
    )
      return bad('submission_id_reused', 409);
    return winner
      ? result(winner, grade(exercise, winner.response), true)
      : bad('storage_conflict', 409);
  }
  return result(saved, graded, false);
}
