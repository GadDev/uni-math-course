import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { validateBank } from '../../scripts/check-content.ts';

const original = JSON.parse(
  await readFile(
    new URL('../../exercises/L01/v1.json', import.meta.url),
    'utf8',
  ),
);

const expand = () => {
  const bank = structuredClone(original);
  const levels = ['easy', 'medium', 'hard'];
  bank.exercises.push(
    ...Array.from({ length: 15 }, (_, index) => ({
      ...structuredClone(original.exercises[index % 6]),
      id: `L01-E${String(index + 7).padStart(2, '0')}`,
      difficulty: levels[Math.floor(index / 5)],
    })),
  );
  bank.exerciseCount = bank.exercises.length;
  return bank;
};

test('immutable six-item archives remain supported', () => {
  assert.equal(validateBank(structuredClone(original)).exerciseCount, 6);
});

test('expanded banks support repeated objectives and five new items per level', () => {
  const bank = expand();
  assert.equal(validateBank(bank).exerciseCount, 21);
  assert.deepEqual(
    ['easy', 'medium', 'hard'].map(
      (level) =>
        bank.exercises.filter(
          (item: { difficulty: string }) => item.difficulty === level,
        ).length,
    ),
    [5, 5, 5],
  );
});

test('exercise count and distinct IDs remain strict', () => {
  const bank = expand();
  bank.exerciseCount--;
  assert.throws(() => validateBank(bank));
  bank.exerciseCount++;
  bank.exercises[6].id = bank.exercises[0].id;
  assert.throws(() => validateBank(bank), /Duplicate exercise ID/);
});

test('every lesson objective must still be represented', () => {
  const bank = expand();
  for (const exercise of bank.exercises)
    if (exercise.objectiveId === 'L01-O06') exercise.objectiveId = 'L01-O01';
  assert.throws(() => validateBank(bank));
});

test('unsupported difficulty remains invalid', () => {
  const bank = expand();
  bank.exercises[10].difficulty = 'expert';
  assert.throws(() => validateBank(bank));
});
