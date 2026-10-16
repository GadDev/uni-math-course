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
  for (const path of [
    'glossary/',
    'numbers/',
    'progress/',
    'account/',
    'lessons/L21/',
    'chapters/C99/',
  ])
    assert.equal(chapterForPath(path), undefined);
});
