import type { Formula } from '../support/logic.ts';
import type { Environment } from '../support/logic.ts';
import { choiceOf, tableOf } from '../support/logic.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  loadBank,
  itemOf,
  envsOf,
  rowId,
  equivalent,
  implies,
  iff,
} from '../support/logic.ts';

const AB = ['A', 'B'];

// ---------- L06 ----------
const l06 = await loadBank('L06');

const sides = (label: string) => {
  const match = label.match(/^\$(.+) \\Rightarrow (.+)\$$/);
  return match ? [match[1], match[2]] : null;
};

test('L06-E01: the converse of A ⇒ B swaps the sides', () => {
  const converse = choiceOf(l06, 'L06-E01').options.filter((o) => {
    const parts = sides(o.label.en);
    return parts && parts[0] === 'B' && parts[1] === 'A';
  });
  assert.deepEqual(
    converse.map((o) => o.id),
    ['a'],
  );
  assert.equal(choiceOf(l06, 'L06-E01').answer, 'a');
});

test('L06-E02: the contrapositive swaps the sides and negates both', () => {
  const contrapositive = choiceOf(l06, 'L06-E02').options.filter((o) => {
    const parts = sides(o.label.en);
    return parts && parts[0] === '\\neg B' && parts[1] === '\\neg A';
  });
  assert.deepEqual(
    contrapositive.map((o) => o.id),
    ['b'],
  );
  assert.equal(choiceOf(l06, 'L06-E02').answer, 'b');
});

test('L06-E03: only the contrapositive is equivalent to A ⇒ B', () => {
  const original = ({ A, B }: Environment) => implies(A, B);
  const candidates = {
    a: ({ A, B }: Environment) => implies(B, A),
    b: ({ A, B }: Environment) => implies(!B, !A),
    c: ({ A, B }: Environment) => implies(!A, !B),
    d: ({ A, B }: Environment) => !implies(B, A),
  };
  const matching = (
    Object.keys(candidates) as (keyof typeof candidates)[]
  ).filter((id) => equivalent(original, candidates[id], AB));
  assert.deepEqual(matching, ['b']);
  assert.equal(choiceOf(l06, 'L06-E03').answer, 'b');
});

test('L06-E04: the column of B ⇒ A, which differs from A ⇒ B in rows 01 and 10', () => {
  const exercise = tableOf(l06, 'L06-E04');
  for (const row of exercise.rows)
    assert.equal(exercise.answer[row.id], implies(row.B, row.A), row.id);
  const differing = exercise.rows
    .filter((row) => implies(row.A, row.B) !== implies(row.B, row.A))
    .map((row) => row.id);
  assert.deepEqual(differing, ['01', '10']);
});

test('L06-E05: rule true and no day off forces the report to be unfinished', () => {
  const finished = 'A';
  const dayOff = 'B';
  const rows = envsOf(AB).filter(
    (env: Environment) => implies(env[finished], env[dayOff]) && !env[dayOff],
  );
  assert.ok(rows.length > 0);
  assert.ok(rows.every((env: Environment) => env[finished] === false));
  assert.equal(choiceOf(l06, 'L06-E05').answer, 'a');
});

test('L06-E06: only B ⇒ A is false exactly on “day off without finishing”', () => {
  const candidates = {
    a: ({ A, B }: Environment) => implies(A, B),
    b: ({ A, B }: Environment) => implies(B, A),
    c: ({ A, B }: Environment) => implies(!A, B),
    d: ({ A, B }: Environment) => A && B,
  };
  const falsifying = (f: Formula) =>
    envsOf(AB)
      .filter((env: Environment) => !f(env))
      .map((env: Environment) => rowId(env, AB));
  // The forbidden situation: day off (B) although the report is unfinished (¬A).
  const matching = (
    Object.keys(candidates) as (keyof typeof candidates)[]
  ).filter((id) => JSON.stringify(falsifying(candidates[id])) === '["01"]');
  assert.deepEqual(matching, ['b']);
  assert.equal(choiceOf(l06, 'L06-E06').answer, 'b');
});

// ---------- L07 ----------
const l07 = await loadBank('L07');

test('L07-E01: only (A ⇒ B) ∧ (B ⇒ A) agrees with “same value”', () => {
  const candidates = {
    a: ({ A, B }: Environment) => implies(A, B) && implies(B, A),
    b: ({ A, B }: Environment) => implies(A, B) || implies(B, A),
    c: ({ A, B }: Environment) => implies(A, B),
    d: ({ A, B }: Environment) => A && B,
  };
  const matching = (
    Object.keys(candidates) as (keyof typeof candidates)[]
  ).filter((id) =>
    equivalent(candidates[id], ({ A, B }: Environment) => iff(A, B), AB),
  );
  assert.deepEqual(matching, ['a']);
  assert.equal(choiceOf(l07, 'L07-E01').answer, 'a');
});

test('L07-E02: the column of A ⇔ B', () => {
  const exercise = tableOf(l07, 'L07-E02');
  for (const row of exercise.rows)
    assert.equal(exercise.answer[row.id], iff(row.A, row.B), row.id);
});

test('L07-E03: ⇔ has a value on each row while ≡ compares whole tables', () => {
  // A biconditional is computed per row; equivalence is checked over all rows.
  assert.equal(iff(true, false), false);
  assert.equal(
    equivalent(
      ({ A, B }: Environment) => A && B,
      ({ A, B }: Environment) => B && A,
      AB,
    ),
    true,
  );
  assert.equal(choiceOf(l07, 'L07-E03').answer, 'a');
});

test('L07-E04: A ≡ B iff A ⇔ B is a tautology, over all 16 × 16 pairs of tables', () => {
  const tables = Array.from({ length: 16 }, (_, k) =>
    Array.from({ length: 4 }, (_, i) => Boolean((k >> i) & 1)),
  );
  const failures = { a: 0, b: 0, c: 0, d: 0 };
  for (const f of tables)
    for (const g of tables) {
      const sameTable = f.every((value, i) => value === g[i]);
      const biconditionalTautology = f.every((value, i) => iff(value, g[i]));
      assert.equal(sameTable, biconditionalTautology);
      const conditions = {
        a: biconditionalTautology,
        b: f.some((value, i) => iff(value, g[i])),
        c: f.every((value, i) => !iff(value, g[i])),
        d: f.every(Boolean) && g.every(Boolean),
      };
      for (const id of Object.keys(conditions) as (keyof typeof conditions)[])
        if (conditions[id] !== sameTable) failures[id]++;
    }
  assert.deepEqual(
    (Object.keys(failures) as (keyof typeof failures)[]).filter(
      (id) => failures[id] === 0,
    ),
    [choiceOf(l07, 'L07-E04').answer],
    'only the key is both necessary and sufficient over the finite domain',
  );
  assert.ok(l07.version >= 2);
  assert.match(choiceOf(l07, 'L07-E04').prompt.fr, /nécessaire et suffisante/);
  assert.match(choiceOf(l07, 'L07-E04').prompt.en, /necessary and sufficient/);
  // Distractor b: A∧B and A∨B agree on some rows without being equivalent.
  const f = ({ A, B }: Environment) => A && B;
  const g = ({ A, B }: Environment) => A || B;
  assert.ok(envsOf(AB).some((env: Environment) => iff(f(env), g(env))));
  assert.equal(equivalent(f, g, AB), false);
  // Distractor d: equivalent formulas need not be tautologies.
  assert.equal(
    equivalent(
      ({ A, B }: Environment) => A && B,
      ({ A, B }: Environment) => B && A,
      AB,
    ),
    true,
  );
  assert.equal(choiceOf(l07, 'L07-E04').answer, 'a');
});

test('L07-E05: ¬(A ∧ B) ⇔ (¬A ∨ ¬B) is true on every row (De Morgan)', () => {
  const exercise = tableOf(l07, 'L07-E05');
  for (const row of exercise.rows)
    assert.equal(
      exercise.answer[row.id],
      iff(!(row.A && row.B), !row.A || !row.B),
      row.id,
    );
  assert.ok(Object.values(exercise.answer).every(Boolean));
});

test('L07-E06: the biconditional is 0 on the row A = 1, B = 0', () => {
  assert.equal(iff(true, false), false);
  assert.equal(choiceOf(l07, 'L07-E06').answer, 'a');
});

// ---------- L08 ----------
const l08 = await loadBank('L08');

const XY = ['x', 'y'];
const XYZ = ['x', 'y', 'z'];
const xor = ({ x, y }: Environment) => x !== y;

test('L08-E01: the XOR table is 1 exactly on rows 01 and 10', () => {
  const rows = envsOf(XY)
    .filter(xor)
    .map((env: Environment) => rowId(env, XY));
  assert.deepEqual(rows, ['01', '10']);
  assert.equal(choiceOf(l08, 'L08-E01').answer, 'a');
});

test('L08-E02: (¬x ∧ y) ∨ (x ∧ ¬y) is the XOR column', () => {
  const exercise = tableOf(l08, 'L08-E02');
  for (const row of exercise.rows)
    assert.equal(
      exercise.answer[row.id],
      (!row.x && row.y) || (row.x && !row.y),
      row.id,
    );
});

test('L08-E03: exactly one conjunction of literals is true only on row 011', () => {
  const candidates = {
    a: ({ x, y, z }: Environment) => !x && y && z,
    b: ({ x, y, z }: Environment) => x && !y && !z,
    c: ({ x, y, z }: Environment) => !x && !y && z,
    d: ({ x, y, z }: Environment) => !x || y || z,
  };
  const trueRows = (f: Formula) =>
    envsOf(XYZ)
      .filter(f)
      .map((env: Environment) => rowId(env, XYZ));
  const onlyRow011 = (
    Object.keys(candidates) as (keyof typeof candidates)[]
  ).filter((id) => JSON.stringify(trueRows(candidates[id])) === '["011"]');
  assert.deepEqual(onlyRow011, ['a']);
  assert.equal(choiceOf(l08, 'L08-E03').answer, 'a');
});

test('L08-E04: only ¬(¬C ∨ ¬D) is equivalent to C ∧ D', () => {
  const target = ({ C, D }: Environment) => C && D;
  const candidates = {
    a: ({ C, D }: Environment) => !(!C || !D),
    b: ({ C, D }: Environment) => !C || !D,
    c: ({ C, D }: Environment) => !(C || D),
    d: ({ C, D }: Environment) => C || D,
  };
  const matching = (
    Object.keys(candidates) as (keyof typeof candidates)[]
  ).filter((id) => equivalent(target, candidates[id], ['C', 'D']));
  assert.deepEqual(matching, ['a']);
  assert.equal(choiceOf(l08, 'L08-E04').answer, 'a');
});

test('L08-E05: the construction reaches every function on 2 and 3 variables using only ∨ and ¬', () => {
  const or = (p: Formula, q: Formula) => (env: Environment) => p(env) || q(env);
  const not = (p: Formula) => (env: Environment) => !p(env);
  // C ∧ D is rewritten as ¬(¬C ∨ ¬D), so the result uses only ∨ and ¬.
  const and = (p: Formula, q: Formula) => not(or(not(p), not(q)));
  const build = (vars: string[], truth: boolean[]) => {
    const rows = envsOf(vars).filter((_, i) => truth[i]);
    if (rows.length === 0) {
      const x = (env: Environment) => env[vars[0]!];
      return not(or(x, not(x)));
    }
    const conjunctions = rows.map((row) =>
      vars
        .map((v: string) =>
          row[v]
            ? (env: Environment) => env[v]
            : not((env: Environment) => env[v]),
        )
        .reduce(and),
    );
    return conjunctions.reduce(or);
  };
  for (const vars of [XY, XYZ]) {
    const size = 2 ** vars.length;
    for (let k = 0; k < 2 ** size; k++) {
      const truth = Array.from({ length: size }, (_, i) =>
        Boolean((k >> (size - 1 - i)) & 1),
      );
      const formula = build(vars, truth);
      envsOf(vars).forEach((env, i) => assert.equal(formula(env), truth[i]));
    }
  }
  // ∨ alone only ever yields x from x, so it cannot express ¬x.
  const x = [false, true]; // x over rows x = 0, 1
  const closure = new Set([x.join()]);
  for (let step = 0; step < 3; step++)
    for (const a of [...closure])
      for (const b of [...closure])
        closure.add(
          a
            .split(',')
            .map((value, i) => value === 'true' || b.split(',')[i] === 'true')
            .join(),
        );
  assert.deepEqual([...closure], [x.join()]);
  assert.equal(choiceOf(l08, 'L08-E05').answer, 'a');
});

test('L08-E06: the three-variable column is 1 only on rows 011 and 100', () => {
  const exercise = tableOf(l08, 'L08-E06');
  for (const row of exercise.rows)
    assert.equal(
      exercise.answer[row.id],
      (!row.x && row.y && row.z) || (row.x && !row.y && !row.z),
      row.id,
    );
  assert.deepEqual(
    Object.keys(exercise.answer)
      .filter((id) => exercise.answer[id])
      .sort(),
    ['011', '100'],
  );
});
