import test from 'node:test';
import assert from 'node:assert/strict';
import { challengeValue } from '../../src/lib/implication.ts';

test('L05 prediction and refutation agree with independent columns', () => {
  for (const task of ['predict', 'failure', 'converse']) {
    const values = [false, true].flatMap((a) =>
      [false, true].map((b) => Number(challengeValue(task, a, b))),
    );
    assert.equal(values.join(''), task === 'converse' ? '1011' : '1101');
  }
});
