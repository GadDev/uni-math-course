import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assignments,
  evaluate,
  formulaText,
  type Variable,
} from '../../src/lib/l04-boolean.ts';
import {
  canonicalDnf,
  firstMismatch,
  joinChoices,
  minterm,
  normalExamples,
  orNot,
  usesOnlyOrNot,
} from '../../src/lib/normal-form.ts';

test('L08 constructs every three-variable truth table using OR and NOT', () => {
  const variables: Variable[] = ['A', 'B', 'C'];
  const rows = assignments(variables);
  for (let mask = 0; mask < 256; mask++) {
    const outputs = mask.toString(2).padStart(8, '0');
    const dnf = canonicalDnf(variables, outputs);
    const restricted = orNot(dnf);
    for (const formula of [dnf, restricted]) {
      const actual = rows.map((row) => Number(evaluate(formula, row))).join('');
      assert.equal(actual, outputs);
    }
    assert.doesNotMatch(formulaText(restricted), /[∧⇒⇔⊤]/);
    assert.equal(usesOnlyOrNot(restricted), true);
  }
  for (let i = 0; i < 8; i++) {
    const term = minterm(variables, i);
    assert.deepEqual(
      rows.map((row) => Number(evaluate(term, row))),
      rows.map((_, j) => Number(i === j)),
    );
  }
});

test('L08 guided choices preserve the output and reject distractors', () => {
  for (const example of normalExamples) {
    for (const formula of [
      joinChoices(example)[0]!,
      example.simplified,
      orNot(example.simplified),
    ]) {
      assert.equal(firstMismatch(example, formula), -1, example.id);
    }
    for (const formula of [
      joinChoices(example)[1]!,
      example.wrong,
      orNot(example.wrong),
    ]) {
      assert.notEqual(firstMismatch(example, formula), -1, example.id);
    }
  }
});

test('L08 restricted grammar rejects equivalent formulas with AND', () => {
  for (const example of normalExamples) {
    assert.equal(usesOnlyOrNot(orNot(example.simplified)), true);
  }
  assert.equal(usesOnlyOrNot(normalExamples[0]!.simplified), false);
  assert.equal(usesOnlyOrNot(true), false);
  assert.equal(usesOnlyOrNot(false), false);
});
