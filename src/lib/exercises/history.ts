import type { SupabaseClient } from '@supabase/supabase-js';
import { ATTEMPT_COLUMNS, toAttemptRow, type AttemptDbRow } from './store.ts';
import type { AttemptRow } from './submit.ts';

/** Full evidence is needed for lifetime totals; only the displayed history is capped. */
export async function loadAttempts(client: SupabaseClient, userId: string) {
  const rows: AttemptRow[] = [];
  const pageSize = 500;
  // Attempts are append-only. Exclude later inserts so offset paging stays stable.
  const snapshot = new Date().toISOString();
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await client
      .from('attempts')
      .select(ATTEMPT_COLUMNS)
      .eq('user_id', userId)
      .lte('created_at', snapshot)
      .order('created_at', { ascending: false })
      .order('id', { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error || !data) throw new Error('Attempt history unavailable');
    rows.push(...(data as AttemptDbRow[]).map(toAttemptRow));
    if (data.length < pageSize) return rows;
  }
}
