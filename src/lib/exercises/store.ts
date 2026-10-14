import { createClient } from '@supabase/supabase-js';
import type { AttemptRow, AttemptStore, NewAttempt } from './submit.ts';

export const ATTEMPT_COLUMNS =
  'id,user_id,submission_id,exercise_id,exercise_version,response,correct,hint_used,independent_evidence,locale,created_at';

export type AttemptDbRow = {
  id: string;
  user_id: string;
  submission_id: string;
  exercise_id: string;
  exercise_version: number;
  response: AttemptRow['response'];
  correct: boolean;
  hint_used: boolean;
  independent_evidence: boolean;
  locale: 'fr' | 'en';
  created_at: string;
};

export const toAttemptRow = (row: AttemptDbRow): AttemptRow => ({
  id: row.id,
  userId: row.user_id,
  submissionId: row.submission_id,
  exerciseId: row.exercise_id,
  exerciseVersion: row.exercise_version,
  response: row.response,
  correct: row.correct,
  hintUsed: row.hint_used,
  independentEvidence: row.independent_evidence,
  locale: row.locale,
  createdAt: row.created_at,
});

/**
 * Attempts are written with a server-only secret key (it bypasses row-level
 * security). Every query is scoped by the verified user id; browser-facing
 * roles have no write access to the table.
 */
export function createAttemptStore(
  env: Record<string, string | undefined>,
): AttemptStore | null {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SECRET_KEY;
  if (!url || !key?.startsWith('sb_secret_') || /\s/.test(key)) return null;
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return {
    async findBySubmission(userId, submissionId) {
      const { data, error } = await client
        .from('attempts')
        .select(ATTEMPT_COLUMNS)
        .eq('user_id', userId)
        .eq('submission_id', submissionId)
        .maybeSingle<AttemptDbRow>();
      if (error) throw new Error('Attempt lookup failed');
      return data ? toAttemptRow(data) : null;
    },
    async hasAttempt(userId, exerciseId) {
      const { count, error } = await client
        .from('attempts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('exercise_id', exerciseId);
      if (error) throw new Error('Attempt lookup failed');
      return (count ?? 0) > 0;
    },
    async insert(attempt: NewAttempt) {
      const { data, error } = await client
        .from('attempts')
        .insert({
          user_id: attempt.userId,
          submission_id: attempt.submissionId,
          lesson_id: attempt.lessonId,
          exercise_id: attempt.exerciseId,
          exercise_version: attempt.exerciseVersion,
          response: attempt.response,
          correct: attempt.correct,
          hint_used: attempt.hintUsed,
          independent_evidence: attempt.independentEvidence,
          locale: attempt.locale,
        })
        .select(ATTEMPT_COLUMNS)
        .single<AttemptDbRow>();
      if (error?.code === '23505') return 'duplicate';
      if (error || !data) throw new Error('Attempt insert failed');
      return toAttemptRow(data);
    },
  };
}
