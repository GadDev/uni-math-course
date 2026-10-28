import test from 'node:test';
import assert from 'node:assert/strict';
import {
  chapters,
  chapterForPath,
  chapterHref,
} from '../../src/lib/chapters.ts';

test('chapter routes preserve existing identities and keep shared resources neutral', () => {
  assert.equal(chapterHref('fr', chapters[0]), '/fr/');
  assert.equal(chapterHref('en', chapters[1]), '/en/chapters/C02/');
  for (const path of ['', 'lessons/L01/', 'lessons/L20/practice/'])
    assert.equal(chapterForPath(path)?.id, 'C01');
  assert.equal(chapterForPath('chapters/C02/')?.id, 'C02');
  for (const path of ['lessons/L21/', 'lessons/L36/practice/'])
    assert.equal(chapterForPath(path)?.id, 'C02');
  assert.equal(chapterHref('fr', chapters[2]), '/fr/chapters/C03/');
  for (const path of ['chapters/C03/', 'lessons/L37/', 'lessons/L42/practice/'])
    assert.equal(chapterForPath(path)?.id, 'C03');
  assert.equal(chapterHref('fr', chapters[3]), '/fr/chapters/C04/');
  assert.equal(chapterForPath('chapters/C04/')?.id, 'C04');
  assert.deepEqual(chapters[3].lessonIds, [
    'L43',
    'L44',
    'L45',
    'L46',
    'L47',
    'L48',
    'L49',
  ]);
  for (const id of chapters[3].lessonIds) {
    assert.equal(chapterForPath(`lessons/${id}/`)?.id, 'C04');
    assert.equal(chapterForPath(`lessons/${id}/practice/`)?.id, 'C04');
  }
  for (const path of [
    'glossary/',
    'numbers/',
    'progress/',
    'account/',
    'lessons/L99/',
    'chapters/C99/',
  ])
    assert.equal(chapterForPath(path), undefined);
});
