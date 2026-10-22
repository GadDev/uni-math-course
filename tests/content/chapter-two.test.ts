import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  droitesLessonIds,
  droitesGroups,
} from '../../src/lib/droites-lessons.ts';
import {
  RELEASED_LESSONS,
  isReviewed,
} from '../../src/lib/released-lessons.ts';

test('Chapter 2 catalogue selects 16 reviewed bilingual lesson pairs with exactly 5/5/5 exercises', () => {
  assert.equal(droitesGroups.length, 5);
  assert.equal(new Set(droitesLessonIds).size, 16);
  assert.equal(droitesLessonIds[0], 'L21');
  assert.equal(droitesLessonIds.at(-1), 'L36');
  for (const id of droitesLessonIds) {
    assert.ok(RELEASED_LESSONS.includes(id));
    assert.ok(isReviewed(id));
    const bank = JSON.parse(readFileSync(`exercises/${id}/v1.json`, 'utf8'));
    const draft = JSON.parse(
      readFileSync(`exercises/drafts/${id}/v1.draft.json`, 'utf8'),
    );
    assert.deepEqual(
      bank,
      draft,
      `${id} immutable copy must match reviewed draft`,
    );
    assert.equal(bank.exercises.length, 15);
    for (const level of ['easy', 'medium', 'hard'])
      assert.equal(
        bank.exercises.filter(
          (e: { difficulty: string }) => e.difficulty === level,
        ).length,
        5,
      );
    // Reading may evolve after the original authoring checkpoint. Its current
    // bytes and bilingual review are bound by the release registry; archived
    // exercise banks and the original draft checkpoint remain immutable here.
  }
});
