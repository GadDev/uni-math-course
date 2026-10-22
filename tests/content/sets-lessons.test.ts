import { choiceOf, tableOf } from '../support/logic.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBank, itemOf } from '../support/logic.ts';

const subsetsOf = <T>(items: T[]): T[][] =>
  items.reduce<T[][]>(
    (acc, item) => [...acc, ...acc.map((s) => [...s, item])],
    [[]],
  );
const key = (set: (number | string)[]) =>
  JSON.stringify([...set].sort((a, b) => Number(a) - Number(b)));
const sameSet = (a: number[], b: number[]) => key(a) === key(b);
const isSubset = <T>(b: T[], a: T[]) => b.every((x) => a.includes(x));
const union = <T>(a: T[], b: T[]) => [...new Set([...a, ...b])];
const inter = <T>(a: T[], b: T[]) => a.filter((x) => b.includes(x));
const comp = <T>(a: T[], c: T[]) => c.filter((x) => !a.includes(x));
const isPrime = (n: number) =>
  n > 1 && [...Array(n).keys()].slice(2).every((d) => n % d !== 0);

// ---------- L09 ----------
const l09 = await loadBank('L09');

test('L09-E01/E02: the informal definition is a collection; “any collection” admits Russell’s E', () => {
  assert.equal(choiceOf(l09, 'L09-E01').answer, 'a');
  assert.equal(choiceOf(l09, 'L09-E02').answer, 'a');
});

test('L09-E03/E04: in any finite universe, Russell’s collection is none of its members', () => {
  // R[x][y] means “y is an element of x”; D collects the x with x ∉ x.
  const n = 3;
  for (let mask = 0; mask < 2 ** (n * n); mask++) {
    const R = Array.from({ length: n }, (_, x) =>
      Array.from({ length: n }, (_, y) => Boolean((mask >> (x * n + y)) & 1)),
    );
    const D = Array.from({ length: n }, (_, x) => !R[x]![x]);
    for (let e = 0; e < n; e++)
      assert.notDeepEqual(
        R[e],
        D,
        `element ${e} cannot be Russell’s collection`,
      );
  }
  // With v the value of “E ∈ E”, the definition forces v = ¬v: impossible.
  assert.deepEqual(
    [false, true].filter((v) => v === !v),
    [],
  );
  assert.equal(choiceOf(l09, 'L09-E03').answer, 'a');
  assert.equal(choiceOf(l09, 'L09-E04').answer, 'a');
});

test('L09-E05: only Russell’s collection fails every accepted shape', () => {
  const accepted = [/^\$\\mathbb\{N\}\$$/, /^\$\\\{[\d, ]+\\\}\$$/, /\\mid/];
  const rejected = choiceOf(l09, 'L09-E05').options.filter(
    (o) => !accepted.some((pattern) => pattern.test(o.label.en)),
  );
  assert.deepEqual(
    rejected.map((o) => o.id),
    ['d'],
  );
  assert.equal(choiceOf(l09, 'L09-E05').answer, 'd');
});

test('L09-E06: a comprehension over a given X always stays inside X', () => {
  const X = [1, 2, 3];
  for (const extension of subsetsOf(X))
    assert.ok(
      isSubset(
        X.filter((a) => extension.includes(a)),
        X,
      ),
    );
  assert.equal(choiceOf(l09, 'L09-E06').answer, 'a');
});

// ---------- L10 ----------
const l10 = await loadBank('L10');

test('L10-E01: only N ⊆ Z ⊆ Q ⊆ R holds on witnesses', () => {
  const samples: Record<string, boolean>[] = [
    { N: true, Z: true, Q: true, R: true }, // 0
    { N: false, Z: true, Q: true, R: true }, // -1
    { N: false, Z: false, Q: true, R: true }, // 1/2
    { N: false, Z: false, Q: false, R: true }, // sqrt(2)
  ];
  const valid = choiceOf(l10, 'L10-E01').options.filter((o) => {
    const chain = o.label.en
      .replaceAll('$', '')
      .split('\\subseteq')
      .map((part) => part.trim().replace('\\mathbb{', '').replace('}', ''));
    return chain
      .slice(0, -1)
      .every((from, i) => samples.every((s) => !s[from] || s[chain[i + 1]!]));
  });
  assert.deepEqual(
    valid.map((o) => o.id),
    ['a'],
  );
});

test('L10-E02: only {4,1,2} has the same elements as {1,2,4}', () => {
  const candidates = { a: [4, 1, 2], b: [1, 2], c: [1, 2, 3, 4], d: [1, 4] };
  const equal = (Object.keys(candidates) as (keyof typeof candidates)[]).filter(
    (id) => sameSet(candidates[id], [1, 2, 4]),
  );
  assert.deepEqual(equal, ['a']);
});

test('L10-E03/E04: empty set and element-versus-part statements', () => {
  const A = [1, 2];
  assert.ok(isSubset([], A)); // ∅ ⊆ {1,2}
  assert.equal((A as unknown[]).includes('∅'), false); // ∅ ∈ {1,2} is false
  assert.equal(isSubset(A, []), false);
  assert.equal(A.includes(1), true);
  assert.equal(isSubset([1], A), true);
  assert.equal(
    A.some((x: number) => Array.isArray(x)),
    false,
  ); // {1} ∈ {1,2} is false
  assert.equal(choiceOf(l10, 'L10-E03').answer, 'a');
  assert.equal(choiceOf(l10, 'L10-E04').answer, 'c');
});

test('L10-E05: ∀b (b ∈ B ⇒ b ∈ A) is exactly inclusion; the distractors are not', () => {
  const universe = subsetsOf([1, 2, 3]);
  let existsDiffers = false;
  let reversedDiffers = false;
  for (const A of universe)
    for (const B of universe) {
      const forall = B.every((b) => A.includes(b));
      assert.equal(forall, isSubset(B, A));
      if (B.some((b) => A.includes(b)) !== forall) existsDiffers = true;
      if (A.every((a) => B.includes(a)) !== forall) reversedDiffers = true;
    }
  assert.ok(existsDiffers && reversedDiffers);
  assert.equal(choiceOf(l10, 'L10-E05').answer, 'a');
});

test('L10-E06: only {2,4} is not a part of {1,2,3}', () => {
  const A = [1, 2, 3];
  const candidates = { a: [1], b: [2, 3], c: [2, 4], d: [] };
  const notParts = (
    Object.keys(candidates) as (keyof typeof candidates)[]
  ).filter((id) => !isSubset(candidates[id], A));
  assert.deepEqual(notParts, ['c']);
  assert.equal(choiceOf(l10, 'L10-E06').answer, 'c');
});

// ---------- L11 ----------
const l11 = await loadBank('L11');

const reals = [-3, 0, 1, 2, 2.5, 3, 10, 100];

test('L11-E01: only x > 2 changes value with x', () => {
  const candidates = {
    a: (x: number) => x > 2,
    b: () => 3 > 2,
    c: () => 2 > 3,
    d: () => reals.every((x: number) => x > 2),
  };
  const varying = (
    Object.keys(candidates) as (keyof typeof candidates)[]
  ).filter(
    (id) => new Set(reals.map((x: number) => candidates[id](x))).size > 1,
  );
  assert.deepEqual(varying, ['a']);
  assert.equal(choiceOf(l11, 'L11-E01').answer, 'a');
});

test('L11-E02: P(1) is false', () => {
  assert.equal(1 > 2, false);
  assert.equal(choiceOf(l11, 'L11-E02').answer, 'b');
});

test('L11-E03/E04: universal needs every case, existential one witness', () => {
  const domain3 = [1, 2, 3];
  assert.equal(
    domain3.every((x: number) => x < 3),
    false,
  );
  assert.equal(
    domain3.some((x: number) => x < 3),
    true,
  );
  const domain4 = [1, 2, 3, 4];
  assert.deepEqual(
    domain4.filter((x: number) => x * x === 4),
    [2],
  );
  assert.equal(choiceOf(l11, 'L11-E03').answer, 'b');
  assert.equal(choiceOf(l11, 'L11-E04').answer, 'b');
});

test('L11-E05: the domain changes the value of the universal statement', () => {
  const onReals = reals.every((x: number) => x > 2);
  const onTail = reals
    .filter((x: number) => x >= 10)
    .every((x: number) => x > 2);
  assert.equal(onReals, false);
  assert.equal(onTail, true);
  assert.equal(choiceOf(l11, 'L11-E05').answer, 'b');
});

test('L11-E06: Arlon is a counterexample and Wiltz a witness', () => {
  const inLuxembourg = { Wiltz: true, 'Esch-sur-Alzette': true, Arlon: false };
  const values = Object.values(inLuxembourg);
  assert.equal(values.every(Boolean), false);
  assert.equal(values.some(Boolean), true);
  assert.equal(choiceOf(l11, 'L11-E06').answer, 'b');
});

// ---------- L12 ----------
const l12 = await loadBank('L12');

const extensions = subsetsOf([0, 1, 2]).map(
  (s) => (x: number) => s.includes(x),
);
const dom = [0, 1, 2];

test('L12-E01/E02: the two negation laws hold on every predicate over three elements', () => {
  for (const P of extensions) {
    assert.equal(
      !dom.every(P),
      dom.some((x: number) => !P(x)),
    );
    assert.equal(
      !dom.some(P),
      dom.every((x: number) => !P(x)),
    );
  }
  // Distractors differ for some predicate.
  assert.ok(
    extensions.some((P) => !dom.every(P) !== dom.every((x: number) => !P(x))),
  );
  assert.ok(
    extensions.some((P) => !dom.some(P) !== dom.some((x: number) => !P(x))),
  );
  assert.equal(choiceOf(l12, 'L12-E01').answer, 'a');
  assert.equal(choiceOf(l12, 'L12-E02').answer, 'a');
});

test('L12-E03/E05: everyday negations on small models', () => {
  const vectors = subsetsOf([0, 1, 2]);
  for (const available of vectors) {
    const all = [0, 1, 2].every((b) => available.includes(b));
    assert.equal(
      !all,
      [0, 1, 2].some((b) => !available.includes(b)),
    );
  }
  const noneAvailable = (available: number[]) => available.length === 0;
  assert.ok(
    vectors.some(
      (v) => noneAvailable(v) !== ![0, 1, 2].every((b) => v.includes(b)),
    ),
  );
  const ages = [10, 17, 18, 30];
  for (const members of subsetsOf(ages)) {
    const someUnder18 = members.some((age) => age < 18);
    assert.equal(
      !someUnder18,
      members.every((age) => age >= 18),
    );
  }
  assert.equal(choiceOf(l12, 'L12-E03').answer, 'a');
  assert.equal(choiceOf(l12, 'L12-E05').answer, 'a');
});

test('L12-E04: 4 is the only element that refutes “every x < 4”', () => {
  assert.deepEqual(
    [1, 2, 3, 4].filter((x: number) => !(x < 4)),
    [4],
  );
  assert.equal(choiceOf(l12, 'L12-E04').answer, 'd');
});

test('L12-E06: ¬∀(n > 2) ≡ ∃(n ≤ 2) on every finite part of ℕ; the distractors differ', () => {
  const parts = subsetsOf([0, 1, 2, 3, 4, 5]).filter((s) => s.length);
  for (const S of parts)
    assert.equal(
      !S.every((n: number) => n > 2),
      S.some((n: number) => n <= 2),
    );
  assert.ok(
    parts.some(
      (S) => !S.every((n: number) => n > 2) !== S.every((n: number) => n <= 2),
    ),
  );
  assert.ok(
    parts.some(
      (S) => !S.every((n: number) => n > 2) !== S.some((n: number) => n > 2),
    ),
  );
  assert.ok(
    parts.some(
      (S) => !S.every((n: number) => n > 2) !== S.every((n: number) => n < 2),
    ),
  );
  assert.equal(choiceOf(l12, 'L12-E06').answer, 'a');
});

// ---------- L13 ----------
const l13 = await loadBank('L13');

test('L13-E01/E02: finite comprehensions', () => {
  assert.deepEqual(
    [1, 2, 3, 4, 5, 6].filter((n: number) => n % 2 === 0),
    [2, 4, 6],
  );
  assert.deepEqual([...Array(11).keys()].filter(isPrime), [2, 3, 5, 7]);
  assert.equal(choiceOf(l13, 'L13-E01').answer, 'a');
  assert.equal(choiceOf(l13, 'L13-E02').answer, 'a');
});

test('L13-E03: only ]2,+∞[ matches x > 2 on test reals', () => {
  const samples = [1, 2, 2.0001, 3, 10, 100];
  const candidates = {
    a: (x: number) => x > 2,
    b: (x: number) => x >= 2,
    c: (x: number) => x < 2,
    d: (x: number) => x >= 10,
  };
  const matching = (
    Object.keys(candidates) as (keyof typeof candidates)[]
  ).filter((id) => samples.every((x: number) => candidates[id](x) === x > 2));
  assert.deepEqual(matching, ['a']);
  assert.equal(choiceOf(l13, 'L13-E03').answer, 'a');
});

test('L13-E04: 0 is the only offered element of the even naturals', () => {
  const isEvenNatural = (n: number) =>
    Number.isInteger(n) && n >= 0 && n % 2 === 0;
  const members = { a: 0, b: 7, c: -2, d: 3 };
  const inSet = (Object.keys(members) as (keyof typeof members)[]).filter(
    (id) => isEvenNatural(members[id]),
  );
  assert.deepEqual(inSet, ['a']);
  assert.equal(choiceOf(l13, 'L13-E04').answer, 'a');
});

test('L13-E05/E06: empty result and domain-versus-filter', () => {
  assert.deepEqual(
    [1, 2, 3].filter((n: number) => n > 5),
    [],
  );
  const inNatural = (x: number) => Number.isInteger(x) && x >= 0 && x > 2;
  const inReal = (x: number) => x > 2;
  assert.equal(inReal(5 / 2), true);
  assert.equal(inNatural(5 / 2), false);
  assert.equal(choiceOf(l13, 'L13-E05').answer, 'a');
  assert.equal(choiceOf(l13, 'L13-E06').answer, 'a');
});

// ---------- L14 ----------
const l14 = await loadBank('L14');

test('L14-E01/E04: counting parts', () => {
  assert.equal(subsetsOf([1, 2]).length, 4);
  assert.equal(subsetsOf([1, 2, 3, 4]).length, 16);
  assert.equal(choiceOf(l14, 'L14-E01').answer, 'a');
  assert.equal(choiceOf(l14, 'L14-E04').answer, 'b');
});

test('L14-E02/E03/E05: membership in a power set', () => {
  const P = subsetsOf([1, 2, 3]);
  const has = (set: number[]) => P.some((p: number[]) => sameSet(p, set));
  assert.equal(has([1, 3]), true);
  assert.equal(has([1, 4]), false);
  assert.equal(
    P.some((p: number[]) => sameSet(p, [1])),
    true,
  );
  for (const A of subsetsOf([1, 2, 3])) {
    const parts = subsetsOf(A);
    assert.ok(parts.some((p: number[]) => p.length === 0));
    assert.ok(parts.some((p: number[]) => sameSet(p, A)));
  }
  // The number 1 is an element of {1,2} but is not one of its parts.
  assert.equal(
    subsetsOf([1, 2]).some((p: unknown) => p === 1),
    false,
  );
  assert.equal(choiceOf(l14, 'L14-E02').answer, 'a');
  assert.equal(choiceOf(l14, 'L14-E03').answer, 'a');
  assert.equal(choiceOf(l14, 'L14-E05').answer, 'a');
});

test('L14-E06: the power set of ∅ has exactly one element, ∅', () => {
  const P = subsetsOf([]);
  assert.equal(P.length, 1);
  assert.deepEqual(P[0], []);
  assert.equal(choiceOf(l14, 'L14-E06').answer, 'a');
});

// ---------- L15 ----------
const l15 = await loadBank('L15');

test('L15-E01/E02/E03: computing with the concrete sets', () => {
  const A = [1, 3, 5, 7];
  const B = [3, 4, 5, 6];
  assert.ok(sameSet(inter(A, B), [3, 5]));
  assert.ok(sameSet(union(A, B), [1, 3, 4, 5, 6, 7]));
  const C = [1, 2, 3, 4, 5, 6, 7, 8];
  assert.ok(sameSet(comp([1, 2, 3, 4], C), [5, 6, 7, 8]));
  assert.equal(choiceOf(l15, 'L15-E01').answer, 'a');
  assert.equal(choiceOf(l15, 'L15-E02').answer, 'a');
  assert.equal(choiceOf(l15, 'L15-E03').answer, 'a');
});

test('L15-E04: De Morgan for sets holds for all A, B inside C; the distractors fail', () => {
  const C = [1, 2, 3];
  let secondLawDiffers = false;
  let firstLawOnIntersectionDiffers = false;
  for (const A of subsetsOf(C))
    for (const B of subsetsOf(C)) {
      const left = comp(union(A, B), C);
      assert.ok(sameSet(left, inter(comp(A, C), comp(B, C))));
      if (!sameSet(left, union(comp(A, C), comp(B, C))))
        secondLawDiffers = true;
      if (!sameSet(left, comp(inter(A, B), C)))
        firstLawOnIntersectionDiffers = true;
    }
  assert.ok(secondLawDiffers && firstLawOnIntersectionDiffers);
  assert.equal(choiceOf(l15, 'L15-E04').answer, 'a');
});

test('L15-E05: the complement of {1,2} depends on the ambient set', () => {
  assert.ok(sameSet(comp([1, 2], [1, 2, 3]), [3]));
  assert.ok(sameSet(comp([1, 2], [1, 2, 3, 4]), [3, 4]));
  assert.equal(choiceOf(l15, 'L15-E05').answer, 'a');
});

test('L15-E06: x ∈ A ∪ B means x ∈ A or x ∈ B, not and', () => {
  const U = [1, 2, 3];
  let andDiffers = false;
  for (const A of subsetsOf(U))
    for (const B of subsetsOf(U))
      for (const x of U) {
        assert.equal(union(A, B).includes(x), A.includes(x) || B.includes(x));
        if (union(A, B).includes(x) !== (A.includes(x) && B.includes(x)))
          andDiffers = true;
      }
  assert.ok(andDiffers);
  assert.equal(choiceOf(l15, 'L15-E06').answer, 'a');
});
