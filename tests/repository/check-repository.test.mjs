import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateRepository } from '../../scripts/check-repository.mjs';
test('preserve Markdown checks, duplicate anchors and generated-directory exclusions', async () => {
  const root = await mkdtemp(join(tmpdir(), 'uni-math-docs-'));
  try {
    await mkdir(join(root, 'node_modules'));
    await writeFile(
      join(root, 'node_modules', 'ignored.md'),
      'broken markdown',
    );
    await writeFile(
      join(root, 'README.md'),
      '# Test\n\n## Example\n\n## Example\n\n[second](#example-1)\n\n<span id="pdf-4"></span>\n\n[source](#pdf-4)\n',
    );
    assert.equal(await validateRepository(root, []), 1);
    for (const body of [
      '# Test\n\n[missing](missing.md)\n',
      '# Test\n\n[bad](#absent)\n',
      '# Test\n\n[x][undefined]\n',
      '# Test\n\n```html\n<span id="fenced"></span>\n```\n\n[bad](#fenced)\n',
      '# Test\n\n~~~js\ncode\n',
    ]) {
      await writeFile(join(root, 'README.md'), body);
      await assert.rejects(validateRepository(root, []));
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
