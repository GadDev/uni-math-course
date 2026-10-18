import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  droitesSourceParts,
  droitesSourceTopics,
} from '../../src/lib/droites-source.ts';

test('the PDF path preserves source order across existing lesson boundaries in both languages', () => {
  assert.equal(droitesSourceParts.length, 5);
  const pages = droitesSourceTopics.map((topic) => topic.page);
  assert.equal(new Set(pages).size, pages.length);
  assert.deepEqual(
    pages,
    [...pages].sort((a, b) => a - b),
  );
  assert.equal(
    new Set(droitesSourceTopics.map((topic) => topic.lessonId)).size,
    16,
  );
  for (const locale of ['fr', 'en']) {
    for (const [index, topic] of droitesSourceTopics.entries()) {
      const text = readFileSync(
        `content/lessons/${topic.lessonId}/${locale}.md`,
        'utf8',
      );
      assert.equal(text.split(`id="pdf-${topic.page}"`).length - 1, 1);
      const next = droitesSourceTopics[index + 1];
      const marker = `<span id="pdf-${topic.page}"`;
      const tail = text.slice(text.indexOf(marker));
      const region = tail
        .split(/<span id="pdf-\d+"/)
        .slice(1)
        .join('<span id="pdf-');
      // Find the first continuation after this marker, not an unrelated link elsewhere.
      const continuation = tail.match(
        /<p class="source-next"><a href="([^"]+)"/,
      );
      assert.ok(continuation, `${topic.lessonId} p.${topic.page} ${locale}`);
      assert.equal(
        continuation[1],
        next
          ? `/${locale}/lessons/${next.lessonId}/#pdf-${next.page}`
          : `/${locale}/chapters/C02/`,
      );
      assert.ok(region.length > 0);
    }
    const identity = droitesSourceTopics.findIndex((t) => t.page === 15);
    assert.equal(droitesSourceTopics[identity - 1].lessonId, 'L23');
    assert.equal(droitesSourceTopics[identity].lessonId, 'L22');
    const triangle = droitesSourceTopics.findIndex((t) => t.page === 60);
    assert.equal(droitesSourceTopics[triangle - 1].page, 59);
    assert.equal(droitesSourceTopics[triangle + 1].page, 62);
  }
});

test('teaching figures have paired local SVGs, descriptions and matching mathematical notation', () => {
  for (let i = 21; i <= 36; i++) {
    const pair = ['fr', 'en'].map((locale) =>
      readFileSync(`content/lessons/L${i}/${locale}.md`, 'utf8'),
    );
    const formulas = (text) =>
      [...text.matchAll(/\$([^$\n]+)\$/g)].map((m) => m[1]);
    assert.deepEqual(formulas(pair[0]), formulas(pair[1]), `L${i} notation`);
    const figureNames = [];
    for (const [index, text] of pair.entries()) {
      const figures = [
        ...text.matchAll(
          /<img src="(\/diagrams\/droites\/(fr|en)\/([^"/]+)\.svg)" alt="([^"]+)"/g,
        ),
      ];
      figureNames.push(figures.map((m) => m[3]));
      for (const [, path, locale, , alt] of figures) {
        assert.equal(locale, index === 0 ? 'fr' : 'en');
        assert.ok(alt.trim().length > 0);
        assert.ok(existsSync(`public${path}`), path);
        const svg = readFileSync(`public${path}`, 'utf8');
        assert.match(svg, /<svg[^>]*viewBox=/);
        assert.doesNotMatch(svg, /<script\b|<image\b/);
      }
    }
    assert.deepEqual(figureNames[0], figureNames[1], `L${i} visual parity`);
  }
});
