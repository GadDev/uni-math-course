import test from 'node:test';
import assert from 'node:assert/strict';
import { compare } from '../../src/lib/l04-boolean.ts';
import { checkProofStep, proofs } from '../../src/lib/boolean-proof.ts';

test('L04 proof steps preserve truth and reject wrong laws and lines', () => {
  for (const proof of proofs) {
    let before = proof.start;
    for (const [i, step] of proof.steps.entries()) {
      const valid = compare(before, step.next, ['A', 'B', 'C']);
      const invalid = compare(before, step.wrong, ['A', 'B', 'C']);
      assert.equal(valid.equivalent, true);
      assert.equal(invalid.equivalent, false);
      assert.equal(checkProofStep(proof, i, step.law, true).status, 'correct');
      assert.equal(checkProofStep(proof, i, 'invalid', true).status, 'law');
      const wrong = checkProofStep(proof, i, step.law, false);
      assert.equal(wrong.status, 'formula');
      if (wrong.status === 'formula') assert.ok(wrong.counterexample);
      before = step.next;
    }
  }
});
