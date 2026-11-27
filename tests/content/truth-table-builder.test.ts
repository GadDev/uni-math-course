import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTruthTable,
  columnLabel,
  firstColumnIssue,
  truthExamples,
} from '../../src/lib/truth-table-builder.ts';

test('L03 columns follow dependencies and independent truth columns', () => {
  const expected = [
    ['1100', '1101', '0001'],
    ['1010', '0010', '1101'],
    ['11001100', '11001111', '01110111', '01000111'],
  ];
  for (const [i, example] of truthExamples.entries()) {
    const table = buildTruthTable(example);
    assert.equal(table.rows.length, 2 ** example.variables.length);
    assert.equal(
      new Set(table.rows.map((row) => JSON.stringify(row))).size,
      table.rows.length,
    );
    assert.deepEqual(
      table.values.map((column) => column.join('')),
      expected[i],
    );
    assert.equal(
      columnLabel(table.columns.at(-1)!),
      columnLabel(example.formula),
    );
  }
});

test('L03 identifies the first missing or incorrect cell', () => {
  assert.deepEqual(firstColumnIssue(['1', '', '1'], [1, 0, 0]), {
    row: 1,
    missing: true,
    expected: 0,
  });
  assert.deepEqual(firstColumnIssue(['0', '1'], [1, 1]), {
    row: 0,
    missing: false,
    expected: 1,
  });
  assert.equal(firstColumnIssue(['1', '0'], [1, 0]), null);
});
