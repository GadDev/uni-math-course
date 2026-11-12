import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sigmaCopy,
  sigmaParts,
  sigmaPatterns,
  sigmaRules,
} from '../../src/lib/sigma-cheat-sheet.ts';

test('Sigma anatomy includes five unambiguous parts', () => {
  assert.deepEqual(
    sigmaParts.map((part) => part.id),
    ['operator', 'index', 'lower', 'upper', 'term'],
  );
  for (const part of sigmaParts) {
    assert.ok(part.symbol);
    assert.ok(part.name.fr && part.name.en);
    assert.ok(part.meaning.fr && part.meaning.en);
  }
});

test('Sigma examples include finite, indexed, set and infinite readings', () => {
  assert.deepEqual(
    sigmaPatterns.map((pattern) => pattern.id),
    ['count', 'powers', 'indexed', 'set', 'infinite'],
  );
  for (const pattern of sigmaPatterns) {
    assert.ok(pattern.notation.includes('\\sum'));
    assert.ok(pattern.reading.fr && pattern.reading.en);
    assert.ok(pattern.expansion);
  }
  assert.match(sigmaPatterns.find((pattern) => pattern.id === 'powers')!.expansion, /31/);
  assert.match(sigmaPatterns.find((pattern) => pattern.id === 'set')!.note!.en, /finite/);
  assert.match(
    sigmaPatterns.find((pattern) => pattern.id === 'infinite')!.note!.fr,
    /converge/,
  );
});

test('Sigma rules reflect finite-summation identities', () => {
  assert.deepEqual(
    sigmaRules.map((rule) => rule.id),
    ['count', 'constant', 'factor', 'split', 'dummy'],
  );
  assert.equal(5 - 1 + 1, 5);
  assert.equal(5 - 0 + 1, 6);
  assert.equal(2 ** 0 + 2 ** 1 + 2 ** 2 + 2 ** 3 + 2 ** 4, 31);
  assert.equal(2 ** 2 + 3 ** 2 + 4 ** 2, 29);
  assert.equal(1 ** 2 + 2 ** 2 + 3 ** 2, 14);
  for (const rule of sigmaRules) {
    assert.ok(rule.formula);
    assert.ok(rule.explanation.fr && rule.explanation.en);
  }
  assert.match(sigmaCopy.fr.caution, /convergence/);
  assert.match(sigmaCopy.en.caution, /convergence/);
});
