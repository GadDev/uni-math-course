import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cheatSheetCopy,
  mappingProperties,
  symbolGroups,
  truthTableRows,
} from '../../src/lib/cheat-sheet';

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

test('truth table covers every P/Q valuation with correct connectives', () => {
  assert.equal(truthTableRows.length, 4);
  const combinations = new Set(
    truthTableRows.map((row) => `${row.p}:${row.q}`),
  );
  assert.equal(combinations.size, 4);
  for (const row of truthTableRows) {
    assert.equal(row.and, row.p && row.q);
    assert.equal(row.or, row.p || row.q);
    assert.equal(row.implies, !row.p || row.q);
    assert.equal(row.iff, row.p === row.q);
  }
  assert.equal(truthTableRows.filter((row) => !row.implies).length, 1);
});

test('mapping examples obey the injective/surjective/bijective formulas', () => {
  assert.deepEqual(
    mappingProperties.map((property) => property.id),
    ['injective', 'surjective', 'bijective'],
  );
  for (const property of mappingProperties) {
    const { source, target, pairs } = property.diagram;
    assert.equal(pairs.length, source.length);
    assert.deepEqual(
      pairs.map(([from]) => from).sort(),
      source.map((_, index) => index),
    );
    const arrivals = target.map(
      (_, to) => pairs.filter(([, destination]) => destination === to).length,
    );
    if (property.id === 'injective') {
      assert.ok(arrivals.every((count) => count <= 1));
      assert.ok(arrivals.some((count) => count === 0));
    }
    if (property.id === 'surjective') {
      assert.ok(arrivals.every((count) => count >= 1));
      assert.ok(arrivals.some((count) => count > 1));
    }
    if (property.id === 'bijective') {
      assert.ok(arrivals.every((count) => count === 1));
    }
    assert.ok(property.formula.includes('\\forall'));
    assert.ok(property.title.fr && property.title.en);
    assert.ok(property.description.fr && property.description.en);
    assert.ok(property.arrows.fr && property.arrows.en);
  }
});
