import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBank, itemOf } from '../support/logic.mjs';

const subsetsOf = (items) =>
  items.reduce((acc, item) => [...acc, ...acc.map((s) => [...s, item])], [[]]);
const implies = (a, b) => !a || b;

// ---------- L16 ----------
const l16 = await loadBank('L16');
const e16 = (id) => itemOf(l16, id);
const U = [1, 2, 3, 4, 5];
const X = [1, 2, 3];
const P = (x) => x > 10;
const inX = (x) => X.includes(x);

test('L16-E01/E02/E03: bounded quantifiers expand with ⇒ and ∧ respectively', () => {
  // Over every subset X of a small universe and every predicate extension,
  // the shorthand agrees with its expansion; the swapped pairings do not.
  const universe = [1, 2, 3];
  let existsImplicationDiffers = false;
  let forallConjunctionDiffers = false;
  for (const Xset of subsetsOf(universe))
    for (const ext of subsetsOf(universe)) {
      const inSet = (x) => Xset.includes(x);
      const pred = (x) => ext.includes(x);
      const forallBounded = Xset.every(pred);
      const existsBounded = Xset.some(pred);
      assert.equal(
        forallBounded,
        universe.every((x) => implies(inSet(x), pred(x))),
      );
      assert.equal(
        existsBounded,
        universe.some((x) => inSet(x) && pred(x)),
      );
      if (existsBounded !== universe.some((x) => implies(inSet(x), pred(x))))
        existsImplicationDiffers = true;
      if (forallBounded !== universe.every((x) => inSet(x) && pred(x)))
        forallConjunctionDiffers = true;
    }
  assert.ok(existsImplicationDiffers && forallConjunctionDiffers);
  assert.equal(e16('L16-E01').answer, 'a');
  assert.equal(e16('L16-E02').answer, 'a');
  assert.equal(e16('L16-E03').answer, 'a');
});

test('L16-E04: ∃x (x ∈ X ⇒ P(x)) is the only true statement', () => {
  const candidates = {
    a: U.some((x) => inX(x) && P(x)),
    b: U.some((x) => implies(inX(x), P(x))),
    c: U.every((x) => implies(inX(x), P(x))),
    d: U.every((x) => inX(x) && P(x)),
  };
  assert.deepEqual(
    Object.keys(candidates).filter((id) => candidates[id]),
    ['b'],
  );
  assert.equal(e16('L16-E04').answer, 'b');
});

test('L16-E05: ¬∀x∈X P ≡ ∃x∈X ¬P on every part and predicate', () => {
  const universe = [1, 2, 3];
  for (const Xset of subsetsOf(universe))
    for (const ext of subsetsOf(universe)) {
      const pred = (x) => ext.includes(x);
      assert.equal(
        !Xset.every(pred),
        Xset.some((x) => !pred(x)),
      );
    }
  assert.equal(e16('L16-E05').answer, 'a');
});

test('L16-E06: ∀x∈∅ P(x) holds for every predicate', () => {
  for (const ext of subsetsOf([1, 2, 3])) {
    const pred = (x) => ext.includes(x);
    assert.equal([].every(pred), true);
    assert.equal(
      [1, 2, 3].every((x) => implies([].includes(x), pred(x))),
      true,
    );
  }
  assert.equal(e16('L16-E06').answer, 'a');
});

// ---------- L17 ----------
const l17 = await loadBank('L17');
const e17 = (id) => itemOf(l17, id);
const students = ['lia', 'max', 'noa'];
const courses = ['art', 'bio'];
const enrol = [
  ['lia', 'art'],
  ['max', 'bio'],
  ['noa', 'bio'],
];
const I = (x, c) => enrol.some(([s, k]) => s === x && k === c);
const formulas = {
  forallExists: () => students.every((x) => courses.some((c) => I(x, c))),
  existsForall: () => courses.some((c) => students.every((x) => I(x, c))),
  existsForallStudent: () =>
    students.some((x) => courses.every((c) => I(x, c))),
  forallExistsCourse: () => courses.every((c) => students.some((x) => I(x, c))),
  existsExists: () => students.some((x) => courses.some((c) => I(x, c))),
};

test('L17-E01: E × C has 6 pairs', () => {
  const product = students.flatMap((x) => courses.map((c) => [x, c]));
  assert.equal(product.length, 6);
  assert.equal(e17('L17-E01').answer, 'a');
});

test('L17-E02: only I(max, bio) is true', () => {
  const claims = {
    a: I('lia', 'bio'),
    b: I('max', 'bio'),
    c: I('noa', 'art'),
    d: I('max', 'art'),
  };
  assert.deepEqual(
    Object.keys(claims).filter((id) => claims[id]),
    ['b'],
  );
  assert.equal(e17('L17-E02').answer, 'b');
});

test('L17-E03/E04/E05/E06: the nested statements evaluate as described, and order matters', () => {
  assert.equal(formulas.forallExists(), true);
  assert.equal(formulas.existsForall(), false);
  assert.equal(formulas.existsForallStudent(), false);
  assert.equal(formulas.forallExistsCourse(), true);
  assert.equal(formulas.existsExists(), true);
  assert.notEqual(formulas.forallExists(), formulas.existsForall());
  assert.equal(e17('L17-E03').answer, 'a');
  assert.equal(e17('L17-E04').answer, 'a');
  assert.equal(e17('L17-E05').answer, 'b');
  assert.equal(e17('L17-E06').answer, 'a');
});

// ---------- L18 ----------
const l18 = await loadBank('L18');
const e18 = (id) => itemOf(l18, id);

test('L18-E01/E05: query results computed from the table', () => {
  const select = (predicate) => students.filter((x) => predicate(x)).sort();
  assert.deepEqual(
    select((x) => I(x, 'bio')),
    ['max', 'noa'],
  );
  // NOT EXISTS (an enrolment of s in art) keeps the students without one.
  assert.deepEqual(
    select(
      (s) =>
        !enrol.some(([student, course]) => student === s && course === 'art'),
    ),
    ['max', 'noa'],
  );
  assert.equal(e18('L18-E01').answer, 'a');
  assert.equal(e18('L18-E05').answer, 'b');
});

test('L18-E02/E03/E04: roles of the query parts and the logic correspondence', () => {
  assert.equal(e18('L18-E02').answer, 'a');
  assert.equal(e18('L18-E03').answer, 'a');
  assert.equal(e18('L18-E04').answer, 'a');
});

test('L18-E06: ∀x P ≡ ¬∃x ¬P over every predicate on three elements', () => {
  const universe = [0, 1, 2];
  let existsNegDiffers = false;
  for (const ext of subsetsOf(universe)) {
    const pred = (x) => ext.includes(x);
    assert.equal(universe.every(pred), !universe.some((x) => !pred(x)));
    if (universe.every(pred) !== universe.some((x) => !pred(x)))
      existsNegDiffers = true;
  }
  assert.ok(existsNegDiffers);
  assert.equal(e18('L18-E06').answer, 'a');
});

// ---------- L19 ----------
const l19 = await loadBank('L19');
const e19 = (id) => itemOf(l19, id);
const lists = [[], [1], [1, 3, 2], [1, 2, 2], [3, 2, 1], [2, 2, 2], [1, 2, 3]];
const n = (t) => t.length;
const isSorted = (t) => t.every((v, i) => i === n(t) - 1 || v <= t[i + 1]);

test('L19-E01: all(...) over range(n-1) is sortedness; the variants differ on some list', () => {
  const sortedAll = (t) =>
    Array.from({ length: Math.max(n(t) - 1, 0) }, (_, i) => i).every(
      (i) => t[i] <= t[i + 1],
    );
  const sortedAny = (t) =>
    Array.from({ length: Math.max(n(t) - 1, 0) }, (_, i) => i).some(
      (i) => t[i] <= t[i + 1],
    );
  const strict = (t) =>
    Array.from({ length: Math.max(n(t) - 1, 0) }, (_, i) => i).every(
      (i) => t[i] < t[i + 1],
    );
  for (const t of lists) assert.equal(sortedAll(t), isSorted(t));
  assert.ok(lists.some((t) => sortedAny(t) !== isSorted(t)));
  assert.ok(lists.some((t) => strict(t) !== isSorted(t)));
  // range(n) would read t[n]: out of the list for i = n - 1.
  assert.equal([1, 2, 3][3], undefined);
  assert.equal(e19('L19-E01').answer, 'a');
});

test('L19-E02/E03: the negation of sortedness and the number of comparisons', () => {
  const notSorted = (t) =>
    Array.from({ length: Math.max(n(t) - 1, 0) }, (_, i) => i).some(
      (i) => t[i] > t[i + 1],
    );
  for (const t of lists) assert.equal(notSorted(t), !isSorted(t));
  assert.equal(notSorted([1, 3, 2]), true);
  assert.equal(Math.max(3 - 1, 0), 2);
  assert.equal(e19('L19-E02').answer, 'a');
  assert.equal(e19('L19-E03').answer, 'a');
});

test('L19-E04: duplicates need i < j; i ≤ j is always true on a nonempty list', () => {
  const dup = (t) => t.some((v, i) => t.some((w, j) => i < j && v === w));
  const loose = (t) => t.some((v, i) => t.some((w, j) => i <= j && v === w));
  assert.equal(dup([1, 2, 3]), false);
  assert.equal(dup([1, 2, 2]), true);
  assert.equal(loose([1, 2, 3]), true);
  assert.equal(e19('L19-E04').answer, 'a');
});

test('L19-E05: ∃i∀j t[j] ≤ t[i] holds on nonempty lists; ∀i∃j is trivially true', () => {
  const hasMax = (t) => t.some((v) => t.every((w) => w <= v));
  const trivial = (t) => t.every((v) => t.some((w) => w <= v));
  for (const t of lists.filter((t) => t.length > 0)) {
    assert.equal(hasMax(t), true);
    assert.equal(trivial(t), true);
  }
  assert.equal(hasMax([]), false);
  assert.equal(e19('L19-E05').answer, 'a');
});

test('L19-E06: all over nothing is true and any over nothing is false', () => {
  assert.equal(
    [].every(() => false),
    true,
  );
  assert.equal(
    [].some(() => true),
    false,
  );
  assert.equal(isSorted([]), true);
  assert.equal(isSorted([5]), true);
  assert.equal(e19('L19-E06').answer, 'a');
});

// ---------- L20 ----------
const l20 = await loadBank('L20');
const e20 = (id) => itemOf(l20, id);
const users = ['ana', 'ben', 'cleo'];
const requests = ['r1', 'r2'];
const manager = (u) => u === 'ana';
const approves = [
  ['ana', 'r1'],
  ['ana', 'r2'],
  ['ben', 'r1'],
];
const V = (u, r) => approves.some(([a, b]) => a === u && b === r);

test('L20-E01/E02: only managers can approve is V ⇒ M, with M necessary', () => {
  const candidates = {
    a: () =>
      users.every((u) => requests.every((r) => implies(V(u, r), manager(u)))),
    b: () =>
      users.every((u) => requests.every((r) => implies(manager(u), V(u, r)))),
    c: () => users.some((u) => requests.some((r) => V(u, r) && manager(u))),
    d: () => users.every((u) => requests.every((r) => V(u, r) && manager(u))),
  };
  // On the model, “only managers can approve” is false because ben approves r1,
  // while the reversed reading M ⇒ V is true: the two readings differ.
  assert.equal(candidates.a(), false);
  assert.equal(candidates.b(), true); // every manager approves something: a different claim
  assert.equal(candidates.c(), true);
  assert.equal(candidates.d(), false);
  // A model where only managers approve: V ⇒ M holds, M ⇒ V need not.
  const approvals = [['ana', 'r1']];
  const onlyManagers = users.every((u) =>
    requests.every((r) =>
      implies(
        approvals.some(([a, b]) => a === u && b === r),
        manager(u),
      ),
    ),
  );
  const everyManagerApproves = users.every((u) =>
    requests.every((r) =>
      implies(
        manager(u),
        approvals.some(([a, b]) => a === u && b === r),
      ),
    ),
  );
  assert.equal(onlyManagers, true);
  assert.equal(everyManagerApproves, false);
  assert.equal(e20('L20-E01').answer, 'a');
  assert.equal(e20('L20-E02').answer, 'a');
});

test('L20-E03: the rule fails because ben approves r1 without being a manager', () => {
  const counterexamples = users.flatMap((u) =>
    requests.filter((r) => V(u, r) && !manager(u)).map((r) => [u, r]),
  );
  assert.deepEqual(counterexamples, [['ben', 'r1']]);
  assert.equal(e20('L20-E03').answer, 'b');
});

test('L20-E04/E05: translating and negating “every manager can approve all requests”', () => {
  const statement = (M, V) =>
    users.every((u) =>
      implies(
        M(u),
        requests.every((r) => V(u, r)),
      ),
    );
  const negation = (M, V) =>
    users.some((u) => M(u) && requests.some((r) => !V(u, r)));
  const wrongImplication = (M, V) =>
    users.every((u) =>
      implies(
        M(u),
        requests.some((r) => !V(u, r)),
      ),
    );
  const wrongExists = (M, V) =>
    users.some((u) =>
      implies(
        M(u),
        requests.some((r) => !V(u, r)),
      ),
    );
  let wrongImplicationDiffers = false;
  let wrongExistsDiffers = false;
  const pairs = users.flatMap((u) => requests.map((r) => [u, r]));
  for (const managers of subsetsOf(users))
    for (const ext of subsetsOf(pairs)) {
      const Mx = (u) => managers.includes(u);
      const Vx = (u, r) => ext.some(([a, b]) => a === u && b === r);
      assert.equal(statement(Mx, Vx), !negation(Mx, Vx));
      if (wrongImplication(Mx, Vx) !== negation(Mx, Vx))
        wrongImplicationDiffers = true;
      if (wrongExists(Mx, Vx) !== negation(Mx, Vx)) wrongExistsDiffers = true;
    }
  assert.ok(wrongImplicationDiffers && wrongExistsDiffers);
  assert.equal(statement(manager, V), true);
  assert.equal(e20('L20-E04').answer, 'a');
  assert.equal(e20('L20-E05').answer, 'a');
});

test('L20-E06: ∃r ∀u ¬V differs from ∀r ∃u ¬V on some model', () => {
  const nobodyCan = (V) => requests.some((r) => users.every((u) => !V(u, r)));
  const eachHasNonApprover = (V) =>
    requests.every((r) => users.some((u) => !V(u, r)));
  assert.equal(nobodyCan(V), false);
  assert.equal(eachHasNonApprover(V), true);
  assert.equal(e20('L20-E06').answer, 'a');
});
