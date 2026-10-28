import test from 'node:test';
import assert from 'node:assert/strict';
import { implicationValues } from '../../src/lib/implication.ts';

test('public examples agree with independently specified truth tables', () => {
  // Columns: A, B, implication, its negation, implication of negated operands.
  for (const [a, b, implication, negation, negatedOperands] of [
    [0, 0, 1, 0, 1],
    [0, 1, 1, 0, 0],
    [1, 0, 0, 1, 1],
    [1, 1, 1, 0, 1],
  ]) {
    assert.deepEqual(implicationValues(Boolean(a), Boolean(b)), {
      implication: Boolean(implication),
      negation: Boolean(negation),
      negatedOperands: Boolean(negatedOperands),
    });
  }
});
