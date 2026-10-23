import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { grade, type Exercise } from '../../src/lib/exercises/grading.ts';

// These immutable pairs are the wording/hint corrections from issue #87.
const revisions: [string, number, number][] = [
  ['L04', 5, 6],
  ['L15', 4, 5],
  ['L21', 1, 2],
  ['L22', 1, 2],
  ['L23', 1, 2],
  ['L26', 1, 2],
  ['L28', 1, 2],
  ['L29', 1, 2],
  ['L30', 1, 2],
  ['L31', 2, 3],
  ['L32', 2, 3],
  ['L33', 2, 3],
  ['L34', 2, 3],
  ['L35', 2, 3],
  ['L36', 2, 3],
];
const bank = (id: string, version: number): Exercise[] =>
  JSON.parse(readFileSync(`exercises/${id}/v${version}.json`, 'utf8'))
    .exercises;

test('clarity revisions preserve every ID, option label, answer, grading contract and eligibility rule', () => {
  for (const [id, old, current] of revisions) {
    const before = bank(id, old),
      after = bank(id, current);
    const gradingContract = (items: Exercise[]) =>
      items.map((item) => {
        const {
          version: _version,
          hint: _hint,
          explanation: _explanation,
          ...rest
        } = item;
        return rest.type === 'single-choice'
          ? {
              ...rest,
              options: rest.options.map(
                ({ feedback: _feedback, ...option }) => option,
              ),
            }
          : rest;
      });
    assert.deepEqual(gradingContract(after), gradingContract(before), id);
    for (let i = 0; i < after.length; i++) {
      const a = after[i]!,
        b = before[i]!;
      if (a.type !== 'single-choice' || b.type !== 'single-choice') continue;
      for (const option of a.options)
        assert.equal(
          grade(a, { optionId: option.id }).correct,
          grade(b, { optionId: option.id }).correct,
        );
    }
  }
});

test('L22-E15 corrected expression is an identity on positive, negative and zero inputs', () => {
  const item = bank('L22', 2).find((e) => e.id === 'L22-E15')!;
  assert.equal(item.type, 'single-choice');
  for (const x of [-8, -4, -1, 0, 2, 11])
    assert.equal((x + 4) ** 2, x * x + 8 * x + 16);
  assert.notEqual(8 ** 2, 16); // First option is not the same polynomial at x=0.
  assert.equal(grade(item, { optionId: 'b' }).correct, true);
  assert.equal(grade(item, { optionId: 'a' }).correct, false);
});
