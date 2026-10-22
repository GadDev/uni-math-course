import type { BankExercise } from '../../scripts/content-types.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateBank } from '../../scripts/check-content.ts';

const bank = JSON.parse(
  await readFile(
    new URL('../../exercises/L05/v1.json', import.meta.url),
    'utf8',
  ),
);
const byId = (id: string) =>
  bank.exercises.find((e: BankExercise) => e.id === id);
const implies = (a: unknown, b: unknown) => !a || b;
const assignments = [
  [false, false],
  [false, true],
  [true, false],
  [true, true],
];

test('L05-E01: derive the only falsifying assignment', () => {
  const failing = assignments
    .filter(([a, b]) => !implies(a, b))
    .map(([a, b]) => String(Number(a)) + String(Number(b)));
  assert.deepEqual(failing, [byId('L05-E01').answer]);
});
test('L05-E02: calculate labelled rows independently of their order', () => {
  const exercise = byId('L05-E02');
  for (const { id, A, B } of [...exercise.rows].reverse()) {
    assert.equal(exercise.answer[id], implies(A, B));
  }
});
test('L05-E03: necessary and sufficient describe the same implication, not its converse', () => {
  for (const [a, b] of assignments) assert.equal(implies(a, b), !(a && !b));
  assert.equal(implies(false, true), true);
  assert.equal(implies(true, false), false);
  assert.equal(byId('L05-E03').answer, 'a-sufficient-b-necessary');
});
test('L05-E04: negation equals A AND NOT B under every assignment', () => {
  for (const [a, b] of assignments) assert.equal(!implies(a, b), a && !b);
  assert.equal(implies(!true, !true), true);
  assert.equal(!implies(true, true), false);
  assert.equal(byId('L05-E04').answer, 'a-and-not-b');
});
test('L05-E05: a blue unstamped card is not a counterexample', () => {
  assert.equal(implies(false, false), true);
  assert.equal(byId('L05-E05').answer, 'no');
});
test('L05-E06: find the numerical witness by testing the predicate', () => {
  const exercise = byId('L05-E06');
  const failures = exercise.options.filter(
    ({ value }: { value: number }) => !implies(value > 5, value > 10),
  );
  assert.deepEqual(
    failures.map(({ id }: { id: string }) => id),
    [exercise.answer],
  );
  assert.deepEqual(
    Array.from({ length: 13 }, (_, n) => n).filter(
      (n) => !implies(n > 5, n > 10),
    ),
    [6, 7, 8, 9, 10],
  );
});
test('contract rejects missing translation, dangling answer and duplicate IDs', () => {
  for (const mutate of [
    (data: typeof bank) => delete data.exercises[0].hint.fr,
    (data: typeof bank) => {
      data.exercises[0].answer = 'missing';
    },
    (data: typeof bank) => {
      data.exercises[1].id = data.exercises[0].id;
    },
  ]) {
    const copy = structuredClone(bank);
    mutate(copy);
    assert.throws(() => validateBank(copy));
  }
  assert.doesNotThrow(() => validateBank(bank));
});
