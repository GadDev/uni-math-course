import test from 'node:test';
import assert from 'node:assert/strict';
import { compare } from '../../src/lib/l04-boolean.ts';
import { checkProofStep, proofs } from '../../src/lib/boolean-proof.ts';

test('L04 guided proof steps preserve truth and reject wrong rewrites or laws', () => {
  for (const proof of proofs) {
    let before = proof.start;
    for (const [i, step] of proof.steps.entries()) {
      assert.equal(compare(before, step.next, ['A', 'B', 'C']).equivalent, true);
      assert.equal(compare(before, step.wrong, ['A', 'B', 'C']).equivalent, false);
      assert.equal(checkProofStep(proof, i, step.law, true).status, 'correct');
      assert.equal(checkProofStep(proof, i, 'invalid', true).status, 'law');
      const wrong = checkProofStep(proof, i, step.law, false);
      assert.equal(wrong.status, 'formula');
      if (wrong.status === 'formula') assert.ok(wrong.counterexample);
      before = step.next;
    }
  }
});
