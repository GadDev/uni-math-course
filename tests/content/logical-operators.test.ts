import test from 'node:test';
import assert from 'node:assert/strict';
import {
  operatorExamples,
  operatorValue,
} from '../../src/lib/logical-operators.ts';

test('L02: every operator agrees with independent truth columns', () => {
  const expected: Record<string, string> = {
    and: '0001',
    or: '0111',
    not: '1100',
    xor: '0110',
    top: '1111',
    'not-first': '1101',
    'not-group': '1000',
  };
  assert.equal(operatorExamples.length, Object.keys(expected).length);
  for (const example of operatorExamples) {
    const column = [false, true]
      .flatMap((a) => [false, true].map((b) => operatorValue(example, a, b)))
      .join('');
    assert.equal(column, expected[example.id], example.id);
  }
});
