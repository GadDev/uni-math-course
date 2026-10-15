import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { loadAttempts } from '../../src/lib/exercises/history.ts';

test('history reads all pages with stable ordering, a snapshot and owner scoping', async () => {
  const requests: URL[] = [];
  const owner = '00000000-0000-4000-8000-000000000001';
  const rows = Array.from({ length: 502 }, (_, index) => ({
    id: String(index),
    user_id: owner,
    submission_id: String(index),
    exercise_id: 'L05-E01',
    exercise_version: 1,
    response: { optionId: '10' },
    correct: true,
    hint_used: false,
    independent_evidence: index === 501,
    locale: 'en',
    created_at: '2026-10-15T10:00:00.000Z',
  }));
  const client = createClient('http://localhost:1234', 'test-only-key', {
    auth: { persistSession: false },
    global: {
      fetch: async (input) => {
        const url = new URL(String(input));
        requests.push(url);
        const start = Number(url.searchParams.get('offset'));
        const limit = Number(url.searchParams.get('limit'));
        return new Response(JSON.stringify(rows.slice(start, start + limit)), {
          headers: { 'Content-Type': 'application/json' },
        });
      },
    },
  });
  const all = await loadAttempts(client, owner);
  assert.equal(all.length, 502);
  assert.equal(all[501]!.independentEvidence, true);
  assert.deepEqual(
    requests.map((url) => url.searchParams.get('offset')),
    ['0', '500'],
  );
  assert.ok(
    requests.every((url) => url.searchParams.get('user_id') === `eq.${owner}`),
  );
  assert.equal(
    requests[0]!.searchParams.get('created_at'),
    requests[1]!.searchParams.get('created_at'),
  );
  assert.equal(
    requests[0]!.searchParams.get('order'),
    'created_at.desc,id.asc',
  );
});
