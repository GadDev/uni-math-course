import type { Formula } from '../support/logic.ts';
import type { Environment } from '../support/logic.ts';
import { choiceOf, tableOf } from '../support/logic.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBank } from '../support/logic.ts';

const bits = [0, 1];
const lesson1 = await loadBank('L01');

test('L01-E01: questions and commands are excluded, leaving the declarative options', () => {
  const options = choiceOf(lesson1, 'L01-E01').options;
  const questionsOrCommands = options.filter((o) =>
    /\?$|^(Ferme|Close)/.test(o.label.en),
  );
  assert.deepEqual(
    questionsOrCommands.map((o) => o.id),
    ['c', 'd'],
  );
  assert.ok(
    !questionsOrCommands.some(
      (o) => o.id === choiceOf(lesson1, 'L01-E01').answer,
    ),
  );
});

test('L01-E02: the liar sentence admits no consistent truth value', () => {
  // "This sentence is false" is true exactly when its value v equals not v.
  assert.deepEqual(
    bits.filter((v) => v === 1 - v),
    [],
  );
  assert.equal(choiceOf(lesson1, 'L01-E02').answer, 'c');
});

test('L01-E03: a fixed context gives one value, known or not', () => {
  const claimsOneValue = choiceOf(lesson1, 'L01-E03').options.filter((o) =>
    /true or false/.test(o.label.en),
  );
  assert.deepEqual(
    claimsOneValue.map((o) => o.id),
    ['b'],
  );
  assert.equal(choiceOf(lesson1, 'L01-E03').answer, 'b');
});

test('L01-E04: only the version with a fixed numeric threshold is checkable', () => {
  const withThreshold = choiceOf(lesson1, 'L01-E04').options.filter((o) =>
    /\d/.test(o.label.en),
  );
  assert.deepEqual(
    withThreshold.map((o) => o.id),
    ['b'],
  );
  assert.equal(choiceOf(lesson1, 'L01-E04').answer, 'b');
});

test('L01-E05: the value of the even-number assertion is 1', () => {
  const isEven = (n: number) => n % 2 === 0;
  const value = isEven(2) ? 1 : 0;
  const correct = choiceOf(lesson1, 'L01-E05').options.find(
    (o) => o.id === choiceOf(lesson1, 'L01-E05').answer,
  );
  assert.equal(value, 1);
  assert.equal(correct!.label.en, '$1$');
});

test('L01-E06: the only false assertion offered is “Ten is a prime number.”', () => {
  const isPrime = (n: number) =>
    n > 1 && [...Array(n).keys()].slice(2).every((d) => n % d !== 0);
  assert.equal(isPrime(10), false);
  assert.equal(isPrime(2), true);
  assert.equal(choiceOf(lesson1, 'L01-E06').answer, 'b');
});

const and = (a: unknown, b: unknown) => Boolean(a && b);
const or = (a: unknown, b: unknown) => Boolean(a || b);
const not = (a: unknown) => !a;
const xor = (a: unknown, b: unknown) => a !== b;
const assignments = bits.flatMap((a: number) =>
  bits.map((b) => [a === 1, b === 1]),
);

const lesson2 = await loadBank('L02');

test('L02-E01: the only assignment making A and B true is 1, 1', () => {
  const truthy = [
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ].filter(([a, b]) => and(a, b));
  assert.deepEqual(truthy, [[true, true]]);
  assert.equal(choiceOf(lesson2, 'L02-E01').answer, 'd');
});

test('L02-E02: A + B is the only offered notation for inclusive or', () => {
  const meanings: Record<
    string,
    (a: unknown, b: unknown) => boolean | undefined
  > = {
    '$A \\cdot B$': and,
    '$A + B$': or,
    '$\\neg A$': (a: unknown) => not(a),
    "$A'$": (a: unknown) => not(a),
  };
  const sameAsOr = choiceOf(lesson2, 'L02-E02').options.filter((o) =>
    assignments.every(([a, b]) => meanings[o.label.en]!(a, b) === or(a, b)),
  );
  assert.deepEqual(
    sameAsOr.map((o) => o.id),
    ['b'],
  );
  assert.equal(choiceOf(lesson2, 'L02-E02').answer, 'b');
});

test('L02-E03: with A = B = 1, inclusive or is true and XOR is false', () => {
  assert.equal(or(true, true), true);
  assert.equal(xor(true, true), false);
  assert.equal(not(true), false);
  assert.equal(and(true, not(true)), false);
  assert.equal(choiceOf(lesson2, 'L02-E03').answer, 'a');
});

test('L02-E04: the truth table of ¬A ∧ B reads as (¬A) ∧ B', () => {
  const exercise = tableOf(lesson2, 'L02-E04');
  for (const row of exercise.rows) {
    assert.equal(exercise.answer[row.id], and(not(row.A), row.B), row.id);
  }
  // The other reading ¬(A ∧ B) differs in row 00, so precedence is tested.
  assert.notEqual(not(and(false, false)), and(not(false), false));
});

test('L02-E05: A ∨ ⊤ is always true, while A ∧ ⊤ is only A', () => {
  const top = true;
  for (const [a, b] of assignments) {
    assert.equal(or(a, top), true);
    assert.equal(and(a, top), a);
    assert.equal(and(b, not(b)), false);
  }
  assert.equal(choiceOf(lesson2, 'L02-E05').answer, 'b');
});

test('L02-E06: (A ∧ B) ∨ C and A ∧ (B ∨ C) differ at A=0, B=0, C=1', () => {
  assert.notEqual(or(and(false, false), true), and(false, or(false, true)));
  assert.equal(choiceOf(lesson2, 'L02-E06').answer, 'b');
});

const lesson3 = await loadBank('L03');

test('L03-E01: three assertions give 2^3 = 8 rows', () => {
  assert.equal(2 ** 3, 8);
  assert.equal(choiceOf(lesson3, 'L03-E01').answer, 'b');
});

test('L03-E02: the only option without a connective is the bare letter C', () => {
  const bare = choiceOf(lesson3, 'L03-E02').options.filter(
    (o) => !/[∧∨¬]|\\land|\\lor|\\neg/.test(o.label.en),
  );
  assert.deepEqual(
    bare.map((o) => o.id),
    ['d'],
  );
  assert.equal(choiceOf(lesson3, 'L03-E02').answer, 'd');
});

test('L03-E03: (A ∨ B) ∧ ¬C is computed correctly on all eight rows', () => {
  const exercise = tableOf(lesson3, 'L03-E03');
  assert.equal(exercise.rows.length, 8);
  for (const row of exercise.rows) {
    assert.equal(exercise.answer[row.id], (row.A || row.B) && !row.C, row.id);
  }
});

test('L03-E04: ¬A ∧ (B ∨ C) equals 1 at A=0, B=0, C=1; reading ¬A as A gives 0', () => {
  assert.equal(!false && (false || true), true);
  assert.equal(false && (false || true), false);
  assert.equal(choiceOf(lesson3, 'L03-E04').answer, 'a');
});

test('L03-E05: the student’s column for A ∨ ¬B has exactly one wrong row, 11', () => {
  // Values written by the student, as shown in the prompt.
  const written: Record<string, boolean> = {
    '00': true,
    '01': false,
    10: true,
    11: false,
  };
  const wrong = [];
  for (const [a, b] of [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ]) {
    const id = `${a}${b}`;
    if ((a === 1 || !b) !== written[id]) wrong.push(id);
  }
  assert.deepEqual(wrong, ['11']);
  assert.equal(choiceOf(lesson3, 'L03-E05').answer, 'd');
});

test('L03-E06: (¬A ∨ B) ∧ A is true only at 11, the same column as A ∧ B', () => {
  const exercise = tableOf(lesson3, 'L03-E06');
  for (const row of exercise.rows) {
    assert.equal(
      exercise.answer[row.id],
      ((!row.A || row.B) && row.A) === true,
      row.id,
    );
    assert.equal(exercise.answer[row.id], row.A && row.B, row.id);
  }
});

const lesson4 = await loadBank('L04');

function envsOf(vars: string[]) {
  return Array.from({ length: 2 ** vars.length }, (_, n) =>
    Object.fromEntries(
      vars.map((v, i) => [v, Boolean((n >> (vars.length - 1 - i)) & 1)]),
    ),
  );
}
const equivalent = (f: Formula, g: Formula, vars: string[]) =>
  envsOf(vars).every((env) => f(env) === g(env));

test('L04-E01: equivalence means identical truth tables, not agreement on some rows', () => {
  const f = ({ A, B }: Environment) => A && B;
  const g = ({ A, B }: Environment) => A || B;
  assert.equal(equivalent(f, g, ['A', 'B']), false);
  assert.equal(
    equivalent(f, ({ A, B }: Environment) => B && A, ['A', 'B']),
    true,
  );
  assert.equal(choiceOf(lesson4, 'L04-E01').answer, 'b');
});

test('L04-E02: only ¬A ∨ ¬B is equivalent to ¬(A ∧ B)', () => {
  const target = ({ A, B }: Environment) => !(A && B);
  const candidates = {
    a: ({ A, B }: Environment) => !A && !B,
    b: ({ A, B }: Environment) => !A || !B,
    c: ({ A, B }: Environment) => !A || B,
    d: ({ A, B }: Environment) => A || !B,
  };
  const matching = (
    Object.keys(candidates) as (keyof typeof candidates)[]
  ).filter((id) => equivalent(target, candidates[id], ['A', 'B']));
  assert.deepEqual(matching, ['b']);
  assert.equal(choiceOf(lesson4, 'L04-E02').answer, 'b');
});

test('L04-E03: nested negation matches its De Morgan rewrite on every row', () => {
  const exercise = tableOf(lesson4, 'L04-E03');
  for (const { id, A, B, C } of exercise.rows) {
    assert.equal(exercise.answer[id], !(A || (B && C)), id);
    assert.equal(exercise.answer[id], !A && (!B || !C), id);
  }
});

test('L04-E04: exactly one option is a tautology', () => {
  const candidates = {
    a: ({ A, B }: Environment) => (A && B) || !(A && B),
    b: ({ A }: Environment) => A && !A,
    c: ({ A, B }: Environment) => A || B,
    d: () => false,
  };
  const tautologies = (
    Object.keys(candidates) as (keyof typeof candidates)[]
  ).filter((id) => envsOf(['A', 'B']).every((env) => candidates[id](env)));
  assert.deepEqual(tautologies, ['a']);
  assert.equal(choiceOf(lesson4, 'L04-E04').answer, 'a');
});

test('L04-E05: A ∧ ¬A ≡ ⊤ is the only false law among the options', () => {
  const laws = {
    a: [({ A }: Environment) => A || !A, () => true],
    b: [({ A }: Environment) => A && !A, () => false],
    c: [({ A }: Environment) => A && !A, () => true],
    d: [({ A }: Environment) => !!A, ({ A }: Environment) => A],
  };
  const falseLaws = (Object.keys(laws) as (keyof typeof laws)[]).filter(
    (id) => !equivalent(laws[id][0]!, laws[id][1]!, ['A']),
  );
  assert.deepEqual(falseLaws, ['c']);
  assert.equal(choiceOf(lesson4, 'L04-E05').answer, 'c');
});

test('L04-E06: the only offered row where A ∧ (B ∨ C) and A ∧ B differ is 101', () => {
  const left = ({ A, B, C }: Environment) => A && (B || C);
  const right = ({ A, B }: Environment) => A && B;
  const rows = {
    a: { A: true, B: false, C: false },
    b: { A: false, B: true, C: true },
    c: { A: true, B: false, C: true },
    d: { A: true, B: true, C: true },
  };
  const refuting = (Object.keys(rows) as (keyof typeof rows)[]).filter(
    (id) => left(rows[id]) !== right(rows[id]),
  );
  assert.deepEqual(refuting, ['c']);
  assert.equal(choiceOf(lesson4, 'L04-E06').answer, 'c');
});
