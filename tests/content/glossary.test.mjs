import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import katex from 'katex';

const bank = JSON.parse(
  readFileSync(
    new URL('../../src/data/glossary.json', import.meta.url),
    'utf8',
  ),
);

test('glossary has stable, unique bilingual entries, valid pages and renderable math', () => {
  assert.equal(bank.version, 2);
  assert.equal(bank.entries.length, 143);
  assert.equal(new Set(bank.entries.map((e) => e.id)).size, 143);
  const sources = new Map(bank.sources.map((source) => [source.id, source]));
  assert.equal(sources.size, bank.sources.length);
  assert.equal(sources.get('logic').pageCount, 96);
  assert.equal(sources.get('droites').pageCount, 87);
  assert.equal(bank.entries.filter((e) => e.sourceId === 'logic').length, 64);
  assert.equal(bank.entries.filter((e) => e.sourceId === 'droites').length, 79);
  const categories = new Set(bank.categories.map((c) => c.id));
  for (const category of bank.categories) {
    for (const locale of ['fr', 'en']) assert.ok(category.title[locale].trim());
  }
  for (const entry of bank.entries) {
    assert.match(entry.id, /^(E\d{2}|G\d{2}|D\d{3})$/);
    assert.ok(categories.has(entry.category));
    assert.ok(
      ['source-formula', 'teaching-example'].includes(entry.exampleOrigin),
    );
    const source = sources.get(entry.sourceId);
    assert.ok(source, 'Unknown source for ' + entry.id);
    assert.ok(entry.sourcePages.length);
    for (const page of entry.sourcePages)
      assert.ok(
        Number.isInteger(page) && page >= 1 && page <= source.pageCount,
      );
    for (const locale of ['fr', 'en']) {
      for (const key of ['name', 'meaning', 'reading', 'explanation'])
        assert.ok(
          entry[locale][key].trim(),
          entry.id + ':' + locale + ':' + key,
        );
      assert.equal(typeof entry[locale].confusion, 'string');
    }
    if (entry.format !== 'code') {
      for (const value of [entry.notation, entry.example]) {
        const rendered = katex.renderToString(value, {
          throwOnError: true,
          output: 'htmlAndMathml',
          trust: false,
        });
        assert.ok(rendered.includes('<math'));
      }
    }
  }
});

test('glossary preserves course-specific distinctions and complement context', () => {
  const entry = (id) => bank.entries.find((item) => item.id === id);
  assert.match(entry('E23').en.meaning, /starting at zero/);
  assert.match(entry('E15').en.meaning, /Builds a statement/);
  assert.match(entry('E16').en.meaning, /every interpretation/);
  assert.match(entry('E38').notation, /overline.*C/);
  assert.match(entry('E38').example, /A\\cup B/);
  assert.match(entry('E28').notation, /\[10,.*\\infty\[/);
});

test('Droites entries distinguish powers, indices, means, predictions and correlation domains', () => {
  const entry = (id) => bank.entries.find((item) => item.id === id);
  for (const id of [
    'D019',
    'D022',
    'D034',
    'D036',
    'D050',
    'D074',
    'D081',
    'D083',
  ]) {
    assert.equal(entry(id).sourceId, 'droites');
  }
  assert.match(entry('D019').en.confusion, /not a subscript/);
  assert.match(entry('D036').notation, /bar/);
  assert.match(entry('D081').notation, /hat/);
  assert.match(entry('D080').en.confusion, /neither the final residual/);
  assert.match(entry('D083').en.confusion, /If Sxx or Syy is zero/);
  assert.match(entry('D075').en.confusion, /nonnegative/);
  assert.deepEqual(entry('D034').sourcePages, [25, 26, 67, 70, 71, 72]);
});
