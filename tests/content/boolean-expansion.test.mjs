import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBank, envsOf } from '../support/logic.mjs';
import {
  parseFormula,
  evaluate,
} from '../../.claude/skills/math-course-studio/scripts/logic-check.mjs';

const bank = await loadBank('L04');
const rows = envsOf(['A', 'B', 'C']);
const formula = (text) =>
  parseFormula(
    text
      .replaceAll('$', '')
      .replaceAll('\\neg', '!')
      .replaceAll('\\land', '&')
      .replaceAll('\\lor', '|'),
  );

// These independent functions express the requested meaning, rather than
// copying the keyed option's formula. Parse every actual option from the bank.
const meanings = {
  'L04-E22': ({ A, B }) => !A || B,
  'L04-E23': ({ A, B, C }) => A && B && !C,
  'L04-E24': ({ A, B }) => A || !B,
  'L04-E25': () => false,
  'L04-E26': ({ A, B, C }) => !A || (B && C),
  'L04-E27': ({ A, B, C }) => (A || B) && (A || !C),
  'L04-E28': ({ A, B, C }) => !((A || B) && !C),
};

for (const [id, meaning] of Object.entries(meanings)) {
  test(`${id}: exactly the stored choice has the requested Boolean meaning`, () => {
    const item = bank.exercises.find((entry) => entry.id === id);
    const matching = item.options.filter((option) => {
      const tree = formula(option.label.en);
      return rows.every((row) => evaluate(tree, row) === meaning(row));
    });
    assert.deepEqual(
      matching.map((option) => option.id),
      [item.answer],
    );
  });
}

test('L04-E29: exactly the keyed offered assignment refutes the mixed regrouping', () => {
  const item = bank.exercises.find((entry) => entry.id === 'L04-E29');
  const witnesses = item.options.filter((option) => {
    const env = Object.fromEntries(
      [...option.label.en.matchAll(/([ABC])=(0|1)/g)].map((match) => [
        match[1],
        match[2] === '1',
      ]),
    );
    assert.equal(Object.keys(env).length, 3);
    const { A, B, C } = env;
    return (A && (B || C)) !== ((A && B) || C);
  });
  assert.deepEqual(
    witnesses.map((option) => option.id),
    [item.answer],
  );
});
