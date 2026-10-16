import type { SupabaseClient } from '@supabase/supabase-js';
import { toAttemptRow, type AttemptDbRow } from './store.ts';

/** Full evidence is needed for lifetime totals; only the displayed history is capped. */
export async function loadAttempts(client: SupabaseClient, userId: string) {
  // The session client invokes a single RLS-protected database snapshot. No
  // caller-supplied owner or application-clock cutoff enters the query.
  const { data, error } = await client.rpc('read_attempt_history');
  if (
    error ||
    !Array.isArray(data) ||
    data.some((row) => row?.user_id !== userId)
  )
    throw new Error('Attempt history unavailable');
  return (data as AttemptDbRow[]).map(toAttemptRow);
}
