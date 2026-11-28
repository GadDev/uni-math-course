import assert from 'node:assert/strict';
import test from 'node:test';
import {
  checkEvidence,
  evaluateDomain,
  evaluatePredicate,
  universe,
  type PredicateId,
} from '../../src/lib/l11-quantifiers.ts';

test('L11: exhaustive finite domains and predicate evidence', () => {
  const cases: [PredicateId, number[]][] = [
    ['even', [0, 2, 4, 6]],
    ['greater', [3, 4, 5, 6]],
    ['square', [2]],
  ];
  for (const [id, passing] of cases) {
    for (const x of universe) {
      assert.equal(evaluatePredicate(id, x), passing.includes(x));
    }
    for (let mask = 0; mask < 2 ** universe.length; mask++) {
      const domain = universe.filter((_, i) => (mask & (1 << i)) !== 0);
      const witnesses = domain.filter((x) => passing.includes(x));
      const counterexamples = domain.filter((x) => !passing.includes(x));
      assert.deepEqual(evaluateDomain(id, domain), {
        universal: counterexamples.length === 0,
        existential: witnesses.length > 0,
        witnesses,
        counterexamples,
      });
      for (const candidate of [...universe, null]) {
        assert.equal(
          checkEvidence(id, domain, 'witness', candidate),
          candidate === null
            ? witnesses.length === 0
            : witnesses.includes(candidate),
        );
        assert.equal(
          checkEvidence(id, domain, 'counterexample', candidate),
          candidate === null
            ? counterexamples.length === 0
            : counterexamples.includes(candidate),
        );
      }
    }
  }
});
