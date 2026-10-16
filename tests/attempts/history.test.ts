import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { loadAttempts } from '../../src/lib/exercises/history.ts';

const owner = '00000000-0000-4000-8000-000000000001';
const row = (index: number) => ({
  id: String(index),
  user_id: owner,
  submission_id: String(index),
  exercise_id: 'L05-E01',
  exercise_version: 1,
  response: { optionId: '10' },
  correct: true,
  hint_used: false,
  independent_evidence: index === 1001,
  locale: 'en',
  created_at: '2026-10-15T10:00:00.000Z',
});

test('history uses one database snapshot beyond the Data API row cap', async () => {
  const requests: URL[] = [];
  const rows = Array.from({ length: 1002 }, (_, index) => row(index));
  const client = createClient('http://localhost:1234', 'test-only-key', {
    auth: { persistSession: false },
    global: {
      fetch: async (input) => {
        requests.push(new URL(String(input)));
        return new Response(JSON.stringify(rows), {
          headers: { 'Content-Type': 'application/json' },
        });
      },
    },
  });
  const all = await loadAttempts(client, owner);
  assert.equal(all.length, 1002);
  assert.equal(all[1001]!.independentEvidence, true);
  assert.equal(requests.length, 1);
  assert.equal(requests[0]!.pathname, '/rest/v1/rpc/read_attempt_history');
  assert.equal(requests[0]!.search, '');
});

for (const data of [null, {}, [{ ...row(0), user_id: 'another-owner' }]]) {
  test(`invalid or foreign snapshot fails closed: ${JSON.stringify(data)}`, async () => {
    const client = createClient('http://localhost:1234', 'test-only-key', {
      auth: { persistSession: false },
      global: {
        fetch: async () =>
          new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
          }),
      },
    });
    await assert.rejects(
      loadAttempts(client, owner),
      /Attempt history unavailable/,
    );
  });
}
