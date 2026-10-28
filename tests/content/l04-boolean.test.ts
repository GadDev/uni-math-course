import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assignments,
  booleanLaws,
  compare,
  evaluate,
  formulaText,
} from '../../src/lib/l04-boolean.ts';

// Literal independent truth columns, in binary assignment order (A first).
const expected: Record<string, string> = {
  nested: '0010',
  'commute-and': '0001',
  'commute-or': '0111',
  'associate-and': '00000001',
  'associate-or': '01111111',
  double: '01',
  excluded: '11',
  contradiction: '00',
  'not-and': '1110',
  'not-or': '1000',
  'and-over-or': '00000111',
  'or-over-and': '00011111',
};
for (const law of booleanLaws) {
  test(`${law.id}: original, rewrite and every justified intermediate match the independent truth column`, () => {
    const envs = assignments(law.variables);
    assert.equal(
      new Set(envs.map((e) => law.variables.map((v) => Number(e[v])).join('')))
        .size,
      2 ** law.variables.length,
    );
    for (const formula of [
      law.left,
      ...law.steps.map((s) => s.formula),
      law.right,
    ]) {
      assert.equal(
        envs.map((env) => Number(evaluate(formula, env))).join(''),
        expected[law.id],
      );
    }
    const result = compare(law.left, law.right, law.variables);
    assert.equal(result.equivalent, true);
    assert.equal(result.counterexample, undefined);
    assert.ok(law.steps.every((s) => s.reason.fr && s.reason.en));
  });
}
test('each intentional mistake has a real counterexample, although some local rows agree', () => {
  const wrongColumns: Record<string, string> = {
    nested: '1011',
    'not-and': '1000',
    'not-or': '1110',
    'and-over-or': '00000011',
    'or-over-and': '00111111',
  };
  for (const law of booleanLaws.filter((l) => l.wrong)) {
    const result = compare(law.left, law.wrong!, law.variables);
    assert.equal(
      result.rows.map((r) => Number(r.right)).join(''),
      wrongColumns[law.id],
    );
    assert.equal(result.equivalent, false);
    assert.ok(result.counterexample);
    assert.notEqual(result.counterexample.left, result.counterexample.right);
    assert.ok(result.rows.some((r) => r.left === r.right));
    const reverse = compare(law.wrong!, law.left, law.variables);
    assert.equal(reverse.equivalent, false);
    assert.equal(reverse.counterexample!.left, result.counterexample.right);
  }
});
test('symbolic display preserves negation scope and associative grouping', () => {
  assert.equal(
    formulaText(booleanLaws.find((l) => l.id === 'nested')!.left),
    '¬(¬A ∨ B)',
  );
  assert.equal(
    formulaText(booleanLaws.find((l) => l.id === 'associate-and')!.left),
    '(A ∧ (B ∧ C))',
  );
  assert.equal(
    formulaText(booleanLaws.find((l) => l.id === 'associate-and')!.right),
    '((A ∧ B) ∧ C)',
  );
  assert.equal(formulaText(false), '¬⊤');
});
