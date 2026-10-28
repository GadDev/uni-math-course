import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';

import { printableChapters } from '../../src/lib/printable-exercises.ts';

const exerciseIdPattern = /C04-T\d{2}-E\d{3}/g;

// The newer A4 workbook uses ReportLab's ASCII85 + Flate compression.
// Older booklet revisions store their exercise IDs directly in PDF streams.
function decodeAscii85(source: Buffer): Buffer {
  const bytes: number[] = [];
  let value = 0;
  let digits = 0;
  for (const byte of source) {
    if (byte === 126) break; // ASCII85's ~> terminator
    if (byte === 122) {
      assert.equal(digits, 0, 'ASCII85 zero group must be standalone');
      bytes.push(0, 0, 0, 0);
      continue;
    }
    if (byte <= 32) continue;
    assert.ok(byte >= 33 && byte <= 117, 'Invalid ASCII85 character');
    value = value * 85 + byte - 33;
    digits++;
    if (digits === 5) {
      bytes.push(
        (value >>> 24) & 255,
        (value >>> 16) & 255,
        (value >>> 8) & 255,
        value & 255,
      );
      value = 0;
      digits = 0;
    }
  }
  if (digits > 0) {
    assert.ok(digits >= 2, 'Invalid ASCII85 final group');
    const keep = digits - 1;
    for (; digits < 5; digits++) value = value * 85 + 84;
    bytes.push(
      ...[
        (value >>> 24) & 255,
        (value >>> 16) & 255,
        (value >>> 8) & 255,
        value & 255,
      ].slice(0, keep),
    );
  }
  return Buffer.from(bytes);
}

function embeddedExerciseIds(bytes: Buffer): Set<string> {
  const text = bytes.toString('latin1');
  const ids = new Set(text.match(exerciseIdPattern) ?? []);
  const streams =
    /\/Filter\s*\[\s*\/ASCII85Decode\s*\/FlateDecode\s*\]\s*\/Length\s+(\d+)\s*>>\s*stream\r?\n/g;
  for (const match of text.matchAll(streams)) {
    const begin = match.index + match[0].length;
    const end = begin + Number(match[1]);
    assert.ok(end <= bytes.length, 'Truncated compressed PDF stream');
    const decoded = inflateSync(decodeAscii85(bytes.subarray(begin, end)));
    for (const id of decoded.toString('latin1').match(exerciseIdPattern) ?? []) {
      ids.add(id);
    }
  }
  return ids;
}

test('Chapter 4 PDFs are intact, pinned by hash, and contain 700 matching exercise IDs', () => {
  const chapter = printableChapters.find((item) => item.id === 'chapter-04');
  assert.ok(chapter);
  assert.equal(chapter.count, 700);
  assert.equal(chapter.documents.length, 2);

  const expected = new Set<string>();
  for (let n = 1; n <= 7; n++) {
    const bank = JSON.parse(
      readFileSync(`exercises/drafts/chapter-04/T0${n}.json`, 'utf8'),
    );
    assert.equal(bank.items.length, 100);
    for (const exercise of bank.items) expected.add(exercise.id);
  }
  assert.equal(expected.size, 700);
  const expectedIds = [...expected].sort();

  for (const doc of chapter.documents) {
    const bytes = readFileSync('public/' + doc.path);
    const actualHash = createHash('sha256').update(bytes).digest('hex');
    assert.equal(actualHash, doc.sha256, doc.path);
    const pdf = bytes.toString('latin1');
    assert.match(pdf.slice(0, 16), /^%PDF-1\.[0-9]/);
    assert.match(pdf.slice(-30), /%%EOF\s*$/);
    const pages = (pdf.match(/\/Type\s*\/Page\b/g) ?? []).length;
    assert.equal(pages, doc.pages, doc.path);
    const xref = pdf.match(/startxref\s*(\d+)\s*%%EOF\s*$/);
    assert.ok(xref, doc.path + ': missing cross-reference');
    assert.equal(pdf.slice(Number(xref[1]), Number(xref[1]) + 4), 'xref');
    assert.deepEqual([...embeddedExerciseIds(bytes)].sort(), expectedIds);
  }
});
