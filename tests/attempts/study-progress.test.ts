import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import {
  loadReadingCompletions,
  studyResume,
} from '../../src/lib/study-progress.ts';
import type { AttemptRow } from '../../src/lib/exercises/submit.ts';

const bank = new Map([['L05-E01', { lessonId: 'L05', version: 2 }]]);
const attempt: AttemptRow = {
  id: 'a',
  userId: 'owner',
  submissionId: 'submission',
  exerciseId: 'L05-E01',
  exerciseVersion: 2,
  response: { optionId: 'a' },
  correct: false,
  hintUsed: true,
  independentEvidence: false,
  locale: 'fr',
  createdAt: '2026-11-19T12:00:00Z',
};

test('resume uses saved actions, without interpreting correctness as mastery', () => {
  assert.equal(studyResume([], [], bank), null);
  const reading = [{ lessonId: 'L43', at: '2026-11-19T11:00:00Z' }];
  assert.equal(studyResume(reading, [], bank)?.kind, 'reading');
  const resume = studyResume(reading, [attempt], bank);
  assert.deepEqual(resume, {
    kind: 'practice',
    lessonId: 'L05',
    exerciseId: 'L05-E01',
    version: 2,
    at: attempt.createdAt,
  });
  assert.deepEqual(
    studyResume(reading, [{ ...attempt, correct: true }], bank),
    resume,
  );
  assert.equal(
    studyResume(
      [{ lessonId: 'L43', at: '2026-11-20T00:00:00Z' }],
      [attempt],
      bank,
    )?.kind,
    'reading',
  );
});

test('resume ignores retired versions, withdrawn lessons and invalid dates', () => {
  assert.equal(
    studyResume(
      [{ lessonId: 'L99', at: attempt.createdAt }],
      [{ ...attempt, exerciseVersion: 1 }],
      bank,
    ),
    null,
  );
  assert.equal(
    studyResume([], [{ ...attempt, createdAt: 'invalid' }], bank),
    null,
  );
  // Undo removes the completion row; the surviving saved attempt becomes latest.
  assert.equal(studyResume([], [attempt], bank)?.kind, 'practice');
});

test('resume sorts timestamps chronologically across offsets with deterministic ties', () => {
  const reading = [{ lessonId: 'L43', at: '2026-11-19T13:30:00+02:00' }];
  assert.equal(studyResume(reading, [attempt], bank)?.kind, 'practice');
  const tie = [{ lessonId: 'L43', at: attempt.createdAt }];
  assert.deepEqual(
    studyResume(tie, [attempt, { ...attempt, id: 'b' }], bank),
    studyResume(tie, [{ ...attempt, id: 'b' }, attempt], bank),
  );
});

for (const invalid of [
  null,
  {},
  [{ user_id: 'another', lesson_id: 'L01', completed_at: attempt.createdAt }],
  [{ user_id: 'owner', lesson_id: 'L99', completed_at: attempt.createdAt }],
  [{ user_id: 'owner', lesson_id: 'L01', completed_at: 'invalid' }],
]) {
  test(`completion history fails closed for invalid/foreign data: ${JSON.stringify(invalid)}`, async () => {
    const client = createClient('http://localhost:1234', 'test-only-key', {
      auth: { persistSession: false },
      global: {
        fetch: async () =>
          new Response(JSON.stringify(invalid), {
            headers: { 'Content-Type': 'application/json' },
          }),
      },
    });
    await assert.rejects(
      loadReadingCompletions(client, 'owner'),
      /Reading history unavailable/,
    );
  });
}

test('completion history reads the existing table with the verified owner and timestamps', async () => {
  let query: URL | undefined;
  const client = createClient('http://localhost:1234', 'test-only-key', {
    auth: { persistSession: false },
    global: {
      fetch: async (input) => {
        query = new URL(String(input));
        return new Response(
          JSON.stringify([
            {
              user_id: 'owner',
              lesson_id: 'L43',
              completed_at: attempt.createdAt,
            },
          ]),
          { headers: { 'Content-Type': 'application/json' } },
        );
      },
    },
  });
  assert.deepEqual(await loadReadingCompletions(client, 'owner'), [
    { lessonId: 'L43', at: attempt.createdAt },
  ]);
  assert.equal(query!.pathname, '/rest/v1/lesson_completions');
  assert.equal(query!.searchParams.get('user_id'), 'eq.owner');
  assert.equal(
    query!.searchParams.get('select'),
    'user_id,lesson_id,completed_at',
  );
});
