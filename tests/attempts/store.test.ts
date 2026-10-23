import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { startAuthFixture } from '../support/auth-fixture.ts';
import { createAttemptStore } from '../../src/lib/exercises/store.ts';
import { submitAttempt } from '../../src/lib/exercises/submit.ts';
import type { Exercise } from '../../src/lib/exercises/grading.ts';

const { exercises } = JSON.parse(
  readFileSync('exercises/L05/v1.json', 'utf8'),
) as { exercises: Exercise[] };
const bank = new Map(exercises.map((exercise) => [exercise.id, exercise]));

test('the real SDK uses one record RPC for a new attempt and for duplicate replay', async (t) => {
  const calls: string[] = [];
  const fixture = await startAuthFixture(0, async (path) => {
    calls.push(path);
  });
  t.after(() => {
    fixture.closeAllConnections();
    fixture.close();
  });
  const address = fixture.address();
  assert.ok(address && typeof address !== 'string');
  const store = createAttemptStore({
    SUPABASE_URL: `http://127.0.0.1:${address.port}`,
    SUPABASE_SECRET_KEY: 'sb_secret_protocol_fixture',
  })!;
  const payload = {
    submissionId: randomUUID(),
    exerciseId: 'L05-E01',
    version: 1,
    locale: 'en',
    response: { optionId: '10' },
  };
  const run = (body: unknown) =>
    submitAttempt({ userId: randomOwner, body, exercises: bank, store });
  const randomOwner = randomUUID();
  const first = await run(payload);
  assert.equal(first.status, 201);
  assert.deepEqual(calls.splice(0), ['/rest/v1/rpc/record_attempt']);
  const replay = await run({
    ...payload,
    hintUsed: true,
    response: { optionId: '00' },
  });
  assert.equal(replay.status, 200);
  assert.deepEqual(calls.splice(0), ['/rest/v1/rpc/record_attempt']);
  assert.deepEqual(
    (replay.body as { response: unknown }).response,
    payload.response,
  );
  assert.equal((replay.body as { hintUsed: boolean }).hintUsed, false);
  assert.equal(
    (first.body as { attemptId: string }).attemptId,
    (replay.body as { attemptId: string }).attemptId,
  );
  // Even malformed retries recover the original row without overwriting it.
  assert.equal((await run({ ...payload, response: null })).status, 200);
  assert.deepEqual(calls.splice(0), ['/rest/v1/attempts']);
  assert.equal(
    (
      await run({
        ...payload,
        exerciseId: 'L05-E03',
        response: {
          optionId: (exercises[2] as { options: { id: string }[] }).options[0]!
            .id,
        },
      })
    ).status,
    409,
  );
  assert.deepEqual(calls.splice(0), ['/rest/v1/rpc/record_attempt']);
});
