import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assignments,
  biconditional,
  compareRow,
  evidence,
  isPairId,
  type Bit,
  type PairId,
} from '../../src/lib/l07-logic.ts';

test('L07 biconditional matches equality, including two false operands', () => {
  for (const [a, b] of assignments) {
    assert.equal(biconditional(a, b), Number(a === b));
  }
});

test('L07 selectable formulas agree with independently specified truth columns', () => {
  const expected: Record<PairId, readonly [Bit[], Bit[]]> = {
    converse: [
      [1, 1, 0, 1],
      [1, 0, 1, 1],
    ],
    implication: [
      [1, 1, 0, 1],
      [1, 1, 0, 1],
    ],
    deMorgan: [
      [1, 1, 1, 0],
      [1, 1, 1, 0],
    ],
    wrongMorgan: [
      [1, 1, 1, 0],
      [1, 0, 0, 0],
    ],
    doubleNegation: [
      [0, 0, 1, 1],
      [0, 0, 1, 1],
    ],
  };
  for (const pair of Object.keys(expected) as PairId[]) {
    for (const [i, [a, b]] of assignments.entries()) {
      const row = compareRow(pair, a, b);
      assert.equal(row.p, expected[pair][0][i]);
      assert.equal(row.q, expected[pair][1][i]);
      assert.equal(row.agreement, Number(row.p === row.q));
    }
  }
});

test('L07 never promotes partial evidence to proof; one mismatch refutes', () => {
  // Exercise all subsets and all visitation orders/repeated row selections.
  for (let mask = 0; mask < 16; mask++) {
    const seen = [0, 1, 2, 3].filter((i) => mask & (1 << i));
    for (const pair of ['implication', 'deMorgan', 'doubleNegation'] as const) {
      assert.equal(
        evidence(pair, [...seen].reverse().concat(seen)).state,
        seen.length === 4 ? 'proved' : 'incomplete',
      );
    }
    for (const pair of ['converse', 'wrongMorgan'] as const) {
      assert.equal(
        evidence(pair, seen).state,
        seen.includes(1) || seen.includes(2) ? 'refuted' : 'incomplete',
      );
    }
  }
  assert.equal(evidence('implication', [0, 0, -1, 4, NaN, 1.5]).count, 1);
  assert.equal(evidence('doubleNegation', [0]).state, 'incomplete');
  assert.equal(compareRow('doubleNegation', 0, 0).agreement, 1);
  assert.ok(isPairId('converse'));
  assert.ok(!isPairId('toString'));
  assert.ok(!isPairId('unknown'));
});
