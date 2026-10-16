import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import type { Exercise } from '../../src/lib/exercises/grading.ts';
import { summarise } from '../../src/lib/exercises/progress.ts';
import type { AttemptRow } from '../../src/lib/exercises/submit.ts';

const { exercises } = JSON.parse(
  readFileSync('exercises/L05/v1.json', 'utf8'),
) as { exercises: Exercise[] };
const bank = new Map(exercises.map((exercise) => [exercise.id, exercise]));

let clock = 0;
const attempt = (overrides: Partial<AttemptRow>): AttemptRow => ({
  id: randomUUID(),
  userId: 'u',
  submissionId: randomUUID(),
  exerciseId: 'L05-E01',
  exerciseVersion: 1,
  response: { optionId: '10' },
  correct: true,
  hintUsed: false,
  independentEvidence: false,
  locale: 'en',
  createdAt: new Date(Date.UTC(2026, 9, 14, 12, 0, clock++)).toISOString(),
  ...overrides,
});

test('no attempts: every released lesson is listed with zero progress', () => {
  const progress = summarise([], bank);
  assert.equal(progress.totalAttempts, 0);
  assert.deepEqual(
    progress.lessons.map(({ lessonId, total, attempted, mastered }) => ({
      lessonId,
      total,
      attempted,
      mastered,
    })),
    [{ lessonId: 'L05', total: 6, attempted: 0, mastered: 0 }],
  );
  assert.deepEqual(progress.mistakes, []);
});

test('attempts, mastery evidence and history stay separate', () => {
  const progress = summarise(
    [
      attempt({ response: { optionId: '00' }, correct: false }),
      attempt({ independentEvidence: false }),
      attempt({
        exerciseId: 'L05-E03',
        response: { optionId: 'x' },
        correct: true,
        independentEvidence: true,
      }),
    ],
    bank,
  );
  const lesson = progress.lessons[0]!;
  assert.equal(progress.totalAttempts, 3);
  assert.equal(lesson.attempted, 2);
  assert.equal(lesson.mastered, 1, 'only the unaided first-correct counts');
  const first = lesson.exercises.find((e) => e.exerciseId === 'L05-E01')!;
  assert.deepEqual(
    [first.attempts, first.correctAttempts, first.masteryEvidence],
    [2, 1, false],
  );
  assert.equal(progress.history.length, 3);
  assert.equal(progress.history[0]!.exerciseId, 'L05-E03', 'newest first');
});

test('a mistake stays open until the latest attempt is correct', () => {
  const wrong = attempt({ response: { optionId: '00' }, correct: false });
  const open = summarise([wrong], bank);
  assert.equal(open.mistakes.length, 1);
  assert.equal(open.mistakes[0]!.exerciseId, 'L05-E01');
  assert.match(open.mistakes[0]!.chosen!.en, /A = 0, B = 0/);
  assert.match(open.mistakes[0]!.feedback.en, /condition is false/);

  const fixed = summarise([wrong, attempt({ correct: true })], bank);
  assert.deepEqual(fixed.mistakes, []);
});

test('truth-table mistakes name the wrong rows', () => {
  const progress = summarise(
    [
      attempt({
        exerciseId: 'L05-E02',
        response: {
          cells: { '00': true, '01': true, '10': true, '11': true },
        },
        correct: false,
      }),
    ],
    bank,
  );
  assert.deepEqual(progress.mistakes[0]!.wrongRows, ['A = 1, B = 0']);
});

test('attempts on unreleased or unparsable data never break the summary', () => {
  const progress = summarise(
    [
      attempt({ exerciseId: 'L01-E01' }),
      attempt({ response: { optionId: 'removed-option' }, correct: false }),
    ],
    bank,
  );
  assert.equal(progress.totalAttempts, 2);
  assert.equal(progress.mistakes.length, 1);
  assert.equal(progress.mistakes[0]!.chosen, undefined);
});

test('history is capped', () => {
  const many = Array.from({ length: 30 }, () => attempt({}));
  assert.equal(summarise(many, bank).history.length, 20);
  assert.equal(summarise(many, bank, 5).history.length, 5);
});

test('old feedback uses its archived version and does not count as current evidence', () => {
  const original = bank.get('L05-E01')!;
  const corrected = {
    ...original,
    version: 2,
    explanation: { en: 'Version two explanation', fr: 'Explication deux' },
  };
  const old = attempt({ correct: false, response: { optionId: '00' } });
  const current = new Map([[corrected.id, corrected]]);
  const archive = new Map([
    [`${original.id}@1`, original],
    [`${corrected.id}@2`, corrected],
  ]);
  const progress = summarise(
    [old, attempt({ independentEvidence: true })],
    current,
    20,
    archive,
  );
  assert.equal(progress.lessons[0]!.mastered, 0);
  assert.equal(progress.lessons[0]!.attempted, 0);
  assert.equal(progress.totalAttempts, 2);
  assert.equal(progress.history[0]!.exerciseVersion, 1);
  assert.equal(progress.history[0]!.archived, true);
  const mistakes = summarise([old], current, 20, archive).mistakes;
  assert.equal(mistakes[0]!.explanation.en, original.explanation.en);
  assert.equal(mistakes[0]!.exerciseVersion, 1);
  assert.deepEqual(
    summarise([old], current).mistakes,
    [],
    'never borrow current feedback when the archive is missing',
  );
});

test('withdrawn lessons retain lifetime totals, original feedback and saved verdicts', () => {
  const original = bank.get('L05-E01')!;
  const saved = attempt({
    correct: false,
    response: { optionId: '00' },
    independentEvidence: false,
  });
  const summary = summarise(
    [saved],
    new Map(),
    20,
    new Map([[`${original.id}@1`, original]]),
  );
  assert.equal(summary.totalAttempts, 1);
  assert.deepEqual(summary.lessons, []);
  assert.equal(summary.history[0]!.correct, false);
  assert.equal(summary.history[0]!.archived, true);
  assert.equal(summary.history[0]!.explanation!.en, original.explanation.en);
  assert.equal(summary.mistakes[0]!.archived, true);
  const missing = summarise([saved], new Map());
  assert.equal(missing.totalAttempts, 1);
  assert.equal(missing.history[0]!.correct, false);
  assert.equal(missing.history[0]!.explanation, undefined);
});

test('equal timestamps have deterministic history order without changing saved grades', () => {
  const first = attempt({
    id: 'a',
    createdAt: '2026-10-16T05:00:00Z',
    correct: false,
  });
  const second = attempt({
    id: 'b',
    createdAt: first.createdAt,
    correct: true,
  });
  const a = summarise([first, second], bank);
  const b = summarise([second, first], bank);
  assert.deepEqual(
    a.history.map((item) => [item.attemptId, item.correct]),
    [
      ['b', true],
      ['a', false],
    ],
  );
  assert.deepEqual(a.history, b.history);
});

test('a late old-version answer cannot close a current-version mistake', () => {
  const original = bank.get('L05-E01')!;
  const current = { ...original, version: 2 };
  const currentWrong = attempt({
    exerciseVersion: 2,
    correct: false,
    response: { optionId: '00' },
  });
  const lateOldCorrect = attempt({ exerciseVersion: 1, correct: true });
  const summary = summarise(
    [currentWrong, lateOldCorrect],
    new Map([[current.id, current]]),
    20,
    new Map([
      [`${original.id}@1`, original],
      [`${current.id}@2`, current],
    ]),
  );
  assert.equal(summary.mistakes[0]!.exerciseVersion, 2);
  assert.equal(summary.mistakes[0]!.archived, false);
  assert.equal(summary.lessons[0]!.exercises[0]!.latestCorrect, false);
  assert.equal(summary.history[0]!.exerciseVersion, 1);
  assert.equal(summary.history[0]!.correct, true);
});

test('lifetime evidence survives more than 500 later attempts', () => {
  const old = attempt({ exerciseId: 'L05-E03', independentEvidence: true });
  const many = Array.from({ length: 501 }, () => attempt({}));
  const progress = summarise([old, ...many], bank);
  assert.equal(progress.totalAttempts, 502);
  assert.equal(progress.lessons[0]!.mastered, 1);
  assert.equal(progress.history.length, 20);
});
