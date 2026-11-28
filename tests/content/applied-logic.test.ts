import assert from 'node:assert/strict';
import test from 'node:test';
import {
  accessFacts,
  initialRelation,
  listFacts,
  relationFacts,
} from '../../src/lib/applied-logic.ts';

test('L17 and L18: every relation on the three-by-two product', () => {
  for (let mask = 0; mask < 64; mask++) {
    const grid = Array.from({ length: 3 }, (_, i) =>
      Array.from({ length: 2 }, (_, j) => (mask & (1 << (2 * i + j))) !== 0),
    );
    const facts = relationFacts(grid);
    assert.equal(facts.every, facts.missing.length === 0);
    assert.equal(
      facts.common.length > 0,
      [0, 1].some((j) => [0, 1, 2].every((i) => grid[i]![j])),
    );
    if (facts.common.length) assert.equal(facts.every, true);
  }
  const source = relationFacts(initialRelation);
  assert.deepEqual(source.missing, ['cleo']);
  assert.deepEqual(source.prog, ['ana', 'ben']);
  assert.deepEqual(source.allCourses, ['ana']);
  assert.deepEqual(source.common, []);
});

test('L19: short, empty, repeated and unsorted lists', () => {
  for (const list of [[], [5], [1, 3, 2], [1, 2, 2], [3, 3], [-1, -3]]) {
    const facts = listFacts(list);
    assert.equal(
      facts.sorted,
      list.every((value, i) => i === 0 || list[i - 1]! <= value),
    );
    assert.equal(facts.duplicate, new Set(list).size < list.length);
    assert.equal(facts.hasMaximum, list.length > 0);
    assert.equal(facts.adjacent.length, Math.max(list.length - 1, 0));
  }
  assert.deepEqual(
    listFacts([1, 3, 2]).adjacent.map((r) => r.pass),
    [true, false],
  );
});

test('L20: role is necessary but not sufficient', () => {
  const facts = accessFacts(initialRelation, [true, false, false]);
  assert.deepEqual(facts.violations, [[1, 1]]);
  const compliant = accessFacts(
    [
      [true, false],
      [false, false],
      [false, false],
    ],
    [true, false, false],
  );
  assert.deepEqual(compliant.violations, []);
  assert.deepEqual(compliant.missing, [[0, 1]]);
  assert.deepEqual(compliant.inaccessible, ['f2']);
});
