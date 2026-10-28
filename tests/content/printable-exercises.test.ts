import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import {
  printableChapters,
  printableCopy,
} from '../../src/lib/printable-exercises.ts';

test('printable exercise catalog contains Chapter 3 bilingual PDFs', () => {
  assert.equal(printableChapters.length, 3);
  assert.equal(
    printableChapters.reduce((sum, chapter) => sum + chapter.count, 0),
    1540,
  );
  assert.deepEqual(
    printableChapters.map((chapter) => chapter.lessons),
    ['L01–L20', 'L21–L36', 'L37–L42'],
  );
  const documentIds = new Set<string>();
  const paths = new Set<string>();

  for (const chapter of printableChapters) {
    assert.equal(chapter.documents.length, chapter.id === 'chapter-03' ? 8 : 2);
    assert.deepEqual(
      chapter.documents.map((document) => document.type),
      chapter.id === 'chapter-03'
        ? [
            'exercises',
            'solutions',
            'exercises',
            'solutions',
            'exercises',
            'solutions',
            'exercises',
            'solutions',
          ]
        : ['exercises', 'solutions'],
    );
    assert.ok(chapter.title.fr && chapter.title.en);
    assert.ok(chapter.description.fr && chapter.description.en);
    for (const document of chapter.documents) {
      assert.match(document.path, /^pdfs\/exercises\/[a-z0-9-]+\.pdf$/);
      assert.match(document.sha256, /^[0-9a-f]{64}$/);
      if (chapter.id === 'chapter-03') {
        assert.ok(document.language === 'fr' || document.language === 'en');
        assert.ok(document.label?.fr && document.label?.en);
      }
      assert.ok(document.pages > 0);
      assert.ok(!paths.has(document.path), 'Duplicate PDF path');
      assert.ok(!documentIds.has(document.id), 'Duplicate document identity');
      paths.add(document.path);
      documentIds.add(document.id);

      // Verify exact bytes whenever PDFs are present, so wrong or stale
      // uploads cannot silently be published.
      const absolutePath = join(process.cwd(), 'public', document.path);
      if (existsSync(absolutePath)) {
        const bytes = readFileSync(absolutePath);
        assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
        assert.equal(
          createHash('sha256').update(bytes).digest('hex'),
          document.sha256,
          'Uploaded PDF does not match the approved workbook: ' + document.path,
        );
      }
    }
  }

  assert.equal(paths.size, 12);
  assert.equal(
    printableChapters[2]!.documents.filter(
      (document) => document.language === 'fr',
    ).length,
    4,
  );
  assert.equal(
    printableChapters[2]!.documents.filter(
      (document) => document.language === 'en',
    ).length,
    4,
  );
  for (const locale of ['fr', 'en'] as const) {
    const text = printableCopy[locale];
    assert.ok(text.title && text.nav && text.description);
    assert.equal(text.steps.length, 3);
  }
});
