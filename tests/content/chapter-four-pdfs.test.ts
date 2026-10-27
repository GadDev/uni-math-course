import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

import { printableChapters } from '../../src/lib/printable-exercises.ts';

test('Chapter 4 printable PDFs are real files, registered by hash and cover all 700 matching exercises', () => {
  const chapter = printableChapters.find((item) => item.id === 'chapter-04');
  assert.ok(chapter);
  assert.equal(chapter.count, 700);
  assert.equal(chapter.documents.length, 2);
  const contents = chapter.documents.map((doc) => {
    const bytes = readFileSync('public/' + doc.path);
    const actualHash = createHash('sha256').update(bytes).digest('hex');
    assert.equal(actualHash, doc.sha256, doc.path);
    const pdf = bytes.toString('latin1');
    assert.match(pdf.slice(0, 16), /^%PDF-1\.[0-9]/);
    assert.match(pdf.slice(-30), /%%EOF\s*$/);
    const pageObjects = (pdf.match(/\/Type \/Page \/Parent/g) ?? []).length;
    assert.equal(pageObjects, doc.pages);
    const ids = new Set(pdf.match(/C04-T\d{2}-E\d{3}/g) ?? []);
    assert.equal(ids.size, 700, doc.path);
    const xref = pdf.match(/startxref\s*(\d+)\s*%%EOF\s*$/);
    assert.ok(xref, doc.path + ': missing cross-reference');
    assert.equal(pdf.slice(Number(xref[1]), Number(xref[1]) + 4), 'xref');
    return ids;
  });
  assert.deepEqual([...contents[0]].sort(), [...contents[1]].sort());
});
