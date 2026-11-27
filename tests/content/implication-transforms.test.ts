import test from 'node:test';
import assert from 'node:assert/strict';
import { assignments } from '../../src/lib/l07-logic.ts';
import {
  transformEvidence,
  transformIds,
  transformRow,
} from '../../src/lib/implication-transforms.ts';

test('L06 transformation columns match independent truth tables', () => {
  const expected = {
    converse: '1011',
    contrapositive: '1101',
    inverse: '1011',
    negation: '0010',
  };
  for (const id of transformIds) {
    const rows = assignments.map(([a, b]) => transformRow(id, a, b));
    assert.equal(rows.map((row) => row.original).join(''), '1101');
    assert.equal(rows.map((row) => row.value).join(''), expected[id]);
  }
});

test('L06 requires all four matching rows, but one difference refutes', () => {
  assert.equal(transformEvidence('contrapositive', []).state, 'pending');
  assert.equal(
    transformEvidence('contrapositive', [0, 0, 1, 2, 9]).state,
    'pending',
  );
  assert.equal(
    transformEvidence('contrapositive', [0, 1, 2, 3]).state,
    'proved',
  );
  assert.equal(transformEvidence('converse', [0]).state, 'pending');
  assert.equal(transformEvidence('converse', [1]).state, 'refuted');
  assert.equal(transformEvidence('inverse', [2]).state, 'refuted');
  assert.equal(transformEvidence('negation', [0]).state, 'refuted');
});
