import type { SupabaseClient } from '@supabase/supabase-js';
import type { Exercise } from './exercises/grading.ts';
import type { AttemptRow } from './exercises/submit.ts';
import { lessonReleases } from './released-lessons.ts';

export type ReadingCompletion = { lessonId: string; at: string };
export type StudyResume = {
  kind: 'reading' | 'practice';
  lessonId: string;
  at: string;
  exerciseId?: string;
  version?: number;
};

/** Existing owner-only completion rows; no visit tracking or new storage. */
export async function loadReadingCompletions(
  client: SupabaseClient,
  learnerId: string,
): Promise<ReadingCompletion[]> {
  const { data, error } = await client
    .from('lesson_completions')
    .select('user_id,lesson_id,completed_at')
    .eq('user_id', learnerId)
    .in('lesson_id', Object.keys(lessonReleases));
  if (
    error ||
    !Array.isArray(data) ||
    data.some(
      (row) =>
        !row ||
        row.user_id !== learnerId ||
        typeof row.lesson_id !== 'string' ||
        !Object.hasOwn(lessonReleases, row.lesson_id) ||
        typeof row.completed_at !== 'string' ||
        !Number.isFinite(Date.parse(row.completed_at)),
    )
  )
    throw new Error('Reading history unavailable');
  return data
    .map((row) => ({ lessonId: row.lesson_id, at: row.completed_at }))
    .sort(
      (a, b) =>
        Date.parse(b.at) - Date.parse(a.at) ||
        b.lessonId.localeCompare(a.lessonId),
    );
}

/** Latest saved action, independent of correctness, hints or mastery. */
export function studyResume(
  reading: readonly ReadingCompletion[],
  attempts: readonly AttemptRow[],
  bank: ReadonlyMap<string, Pick<Exercise, 'lessonId' | 'version'>>,
): StudyResume | null {
  const candidates: StudyResume[] = reading
    .filter((row) => Object.hasOwn(lessonReleases, row.lessonId))
    .map((row) => ({ ...row, kind: 'reading' }));
  for (const attempt of attempts) {
    const current = bank.get(attempt.exerciseId);
    // Retired versions remain in history, but never lead back to stale practice.
    if (!current || current.version !== attempt.exerciseVersion) continue;
    candidates.push({
      kind: 'practice',
      lessonId: current.lessonId,
      exerciseId: attempt.exerciseId,
      version: attempt.exerciseVersion,
      at: attempt.createdAt,
    });
  }
  return (
    candidates
      .filter((row) => Number.isFinite(Date.parse(row.at)))
      .sort(
        (a, b) =>
          Date.parse(b.at) - Date.parse(a.at) ||
          `${b.kind}:${b.exerciseId ?? b.lessonId}`.localeCompare(
            `${a.kind}:${a.exerciseId ?? a.lessonId}`,
          ),
      )[0] ?? null
  );
}
