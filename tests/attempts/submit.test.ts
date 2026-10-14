import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import {
  grade,
  parseResponse,
  publicExercise,
  type Exercise,
} from '../../src/lib/exercises/grading.ts';
import {
  submitAttempt,
  type AttemptRow,
  type AttemptStore,
  type NewAttempt,
} from '../../src/lib/exercises/submit.ts';

const { exercises } = JSON.parse(
  readFileSync('exercises/L05/v1.json', 'utf8'),
) as { exercises: Exercise[] };
const bank = new Map(exercises.map((exercise) => [exercise.id, exercise]));
const choice = bank.get('L05-E01')!;
const table = bank.get('L05-E02')!;

function memoryStore() {
  const rows: AttemptRow[] = [];
  const store: AttemptStore = {
    async findBySubmission(userId, submissionId) {
      return (
        rows.find(
          (row) => row.userId === userId && row.submissionId === submissionId,
        ) ?? null
      );
    },
    async hasAttempt(userId, exerciseId) {
      return rows.some(
        (row) => row.userId === userId && row.exerciseId === exerciseId,
      );
    },
    async insert(attempt: NewAttempt) {
      if (
        rows.some(
          (row) =>
            row.userId === attempt.userId &&
            row.submissionId === attempt.submissionId,
        )
      )
        return 'duplicate';
      const row = {
        ...attempt,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      };
      rows.push(row);
      return row;
    },
  };
  return { store, rows };
}
const body = (overrides: Record<string, unknown> = {}) => ({
  submissionId: randomUUID(),
  exerciseId: 'L05-E01',
  version: 1,
  locale: 'en',
  response: { optionId: '10' },
  ...overrides,
});
const run = (store: AttemptStore, userId: string, payload: unknown) =>
  submitAttempt({ userId, body: payload, exercises: bank, store });

test('public exercises carry no answer, feedback or explanation', () => {
  for (const exercise of exercises) {
    const text = JSON.stringify(publicExercise(exercise));
    assert.doesNotMatch(text, /"answer"|"explanation"|"feedback"|"provenance"/);
  }
  const shown = publicExercise(choice);
  assert.ok(shown.type === 'single-choice' && shown.options.length === 4);
});

test('single-choice grading uses the server answer and option feedback', () => {
  assert.equal(grade(choice, { optionId: '10' }).correct, true);
  const wrong = grade(choice, { optionId: '00' });
  assert.equal(wrong.correct, false);
  assert.match(wrong.feedback.en, /condition is false/);
});

test('truth-table grading reports each row', () => {
  const good = { cells: { '00': true, '01': true, '10': false, '11': true } };
  assert.equal(grade(table, good).correct, true);
  const bad = grade(table, { cells: { ...good.cells, '10': true } });
  assert.equal(bad.correct, false);
  assert.deepEqual(bad.rowResults, {
    '10': false,
    '11': true,
    '00': true,
    '01': true,
  });
});

test('responses with unknown fields, options or rows are rejected', () => {
  for (const raw of [
    null,
    [],
    {},
    { optionId: 'zz' },
    { optionId: '10', correct: true },
    { optionId: 10 },
  ])
    assert.equal(parseResponse(choice, raw), null);
  for (const raw of [
    { cells: {} },
    { cells: { '00': true, '01': true, '10': false } },
    { cells: { '00': true, '01': true, '10': false, '11': 'true' } },
    { cells: { '00': true, '01': true, '10': false, '11': true, x: true } },
    {
      cells: { '00': true, '01': true, '10': false, '11': true },
      correct: true,
    },
  ])
    assert.equal(parseResponse(table, raw), null);
});

test('a caller cannot forge the grade or evidence', async () => {
  const { store, rows } = memoryStore();
  const result = await run(
    store,
    'user-a',
    body({
      response: { optionId: '00' },
      correct: true,
      independentEvidence: true,
      userId: 'user-b',
    }),
  );
  assert.equal(result.status, 201);
  assert.equal((result.body as { correct: boolean }).correct, false);
  assert.equal(rows[0]!.correct, false);
  assert.equal(rows[0]!.independentEvidence, false);
  assert.equal(rows[0]!.userId, 'user-a');
});

test('resubmitting a submission id is idempotent', async () => {
  const { store, rows } = memoryStore();
  const payload = body();
  const first = await run(store, 'user-a', payload);
  const again = await run(store, 'user-a', payload);
  // Even a changed response cannot overwrite or duplicate the stored attempt.
  const altered = await run(store, 'user-a', {
    ...payload,
    response: { optionId: '00' },
  });
  assert.equal(first.status, 201);
  assert.equal(again.status, 200);
  assert.equal(altered.status, 200);
  assert.equal((altered.body as { correct: boolean }).correct, true);
  assert.equal(rows.length, 1);
  assert.equal(
    (first.body as { attemptId: string }).attemptId,
    (again.body as { attemptId: string }).attemptId,
  );
});

test('a submission id cannot be reused for another exercise', async () => {
  const { store } = memoryStore();
  const payload = body();
  await run(store, 'user-a', payload);
  const reused = await run(store, 'user-a', {
    ...payload,
    exerciseId: 'L05-E03',
    response: { optionId: '00' },
  });
  assert.equal(reused.status, 409);
});

test('learners are separated: the same submission id is a separate attempt', async () => {
  const { store, rows } = memoryStore();
  const payload = body();
  await run(store, 'user-a', payload);
  const other = await run(store, 'user-b', payload);
  assert.equal(other.status, 201);
  assert.deepEqual(rows.map((row) => row.userId).sort(), ['user-a', 'user-b']);
});

test('only a first, unaided, correct response is independent evidence', async () => {
  const { store, rows } = memoryStore();
  await run(store, 'u', body({ response: { optionId: '00' } }));
  await run(store, 'u', body());
  assert.equal(rows[1]!.correct, true);
  assert.equal(rows[1]!.independentEvidence, false, 'retries do not count');
  await run(
    store,
    'u',
    body({
      exerciseId: 'L05-E03',
      response: {
        optionId:
          bank.get('L05-E03')!.type === 'single-choice'
            ? (bank.get('L05-E03') as { answer: string }).answer
            : '',
      },
      hintUsed: true,
    }),
  );
  assert.equal(rows[2]!.independentEvidence, false, 'hints do not count');
  assert.equal(rows[2]!.hintUsed, true);
  const fresh = bank.get('L05-E04') as { answer: string };
  await run(
    store,
    'u',
    body({ exerciseId: 'L05-E04', response: { optionId: fresh.answer } }),
  );
  assert.equal(rows[3]!.independentEvidence, true);
});

test('invalid requests are rejected before anything is stored', async () => {
  const { store, rows } = memoryStore();
  const cases: [unknown, number][] = [
    [null, 400],
    [body({ submissionId: 'not-a-uuid' }), 400],
    [body({ locale: 'de' }), 400],
    [body({ hintUsed: 'yes' }), 400],
    [body({ exerciseId: 'L05-E99' }), 404],
    [body({ exerciseId: 'L01-E01' }), 404],
    [body({ version: 2 }), 409],
    [body({ response: { optionId: 'zz' } }), 400],
  ];
  for (const [payload, status] of cases)
    assert.equal((await run(store, 'u', payload)).status, status);
  assert.equal(rows.length, 0);
});
