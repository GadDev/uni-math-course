import test from 'node:test';
import assert from 'node:assert/strict';
import { symbolGroups, cheatSheetCopy } from '../../src/lib/cheat-sheet';

test('cheat sheet lists all requested logic and set symbols', () => {
  const logic = symbolGroups.find((group) => group.id === 'logic');
  const sets = symbolGroups.find((group) => group.id === 'sets');
  assert.ok(logic);
  assert.ok(sets);
  assert.deepEqual(
    symbolGroups.map((group) => [group.id, group.rows.length]),
    [
      ['logic', 8],
      ['sets', 11],
    ],
  );
  assert.deepEqual(
    logic.rows.map((row) => row.notation),
    ['∀', '∃', '∃!', '¬', '∧', '∨', '⇒', '⇔'],
  );
  assert.deepEqual(
    sets.rows.map((row) => row.notation),
    ['∈', '∉', '∅', '⊆', '⊈', '∪', '∩', 'A ∖ B', '𝒫(A)', '|A|', 'A × B'],
  );
});

test('every reference item has a bilingual label and explanation', () => {
  for (const group of symbolGroups) {
    assert.ok(group.title.fr && group.title.en);
    for (const row of group.rows) {
      assert.ok(row.english.trim(), row.notation);
      assert.ok(row.french.trim(), row.notation);
      assert.ok(row.meaning.fr.trim(), row.notation);
      assert.ok(row.meaning.en.trim(), row.notation);
    }
  }
  assert.equal(cheatSheetCopy.fr.tips.length, 3);
  assert.equal(cheatSheetCopy.en.tips.length, 3);
});

test('critical notation alternatives and distinctions are explicit', () => {
  const logic = symbolGroups.find((group) => group.id === 'logic');
  const sets = symbolGroups.find((group) => group.id === 'sets');
  assert.ok(logic);
  assert.ok(sets);
  assert.equal(
    logic.rows.find((row) => row.notation === '¬')?.alternative,
    '~',
  );
  assert.equal(
    sets.rows.find((row) => row.notation === '∅')?.alternative,
    '{}',
  );
  assert.equal(
    sets.rows.find((row) => row.notation === '|A|')?.alternative,
    'Card(A)',
  );
  assert.match(
    sets.rows.find((row) => row.notation === '⊆')!.meaning.fr,
    /égalité/,
  );
  assert.match(
    logic.rows.find((row) => row.notation === '∨')!.meaning.en,
    /inclusive/,
  );
});
