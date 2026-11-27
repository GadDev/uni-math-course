import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateRepository } from '../../scripts/check-repository.ts';
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

test('root-relative public assets resolve but missing assets and public traversal fail', async () => {
  const root = await mkdtemp(join(tmpdir(), 'uni-math-assets-'));
  try {
    await mkdir(join(root, 'public', 'diagrams'), { recursive: true });
    await writeFile(join(root, 'public', 'diagrams', 'set.svg'), '<svg/>');
    await writeFile(join(root, 'note.txt'), 'not a public asset');
    await writeFile(
      join(root, 'README.md'),
      '# Test\n\n![A set](/diagrams/set.svg)\n',
    );
    assert.equal(await validateRepository(root, []), 1);
    for (const target of ['/diagrams/missing.svg', '/../note.txt']) {
      await writeFile(
        join(root, 'README.md'),
        `# Test\n\n![Missing](${target})\n`,
      );
      await assert.rejects(validateRepository(root, []));
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('lesson reading links resolve to exactly one source without accepting missing routes', async () => {
  const root = await mkdtemp(join(tmpdir(), 'uni-math-lesson-links-'));
  try {
    await mkdir(join(root, 'content/lessons/L43'), { recursive: true });
    await writeFile(
      join(root, 'content/lessons/L43/fr.mdx'),
      '# Lesson\n\n## Method\n',
    );
    await writeFile(
      join(root, 'README.md'),
      '# Test\n\n[lesson](/fr/lessons/L43/#method)\n',
    );
    assert.equal(await validateRepository(root, []), 2);
    for (const target of [
      '/en/lessons/L43/',
      '/fr/lessons/L99/',
      '/fr/lessons/L43/#missing',
      '/fr/lessons/L43/practice/',
      '/fr/../note/',
    ]) {
      await writeFile(
        join(root, 'README.md'),
        `# Test\n\n[missing](${target})\n`,
      );
      await assert.rejects(validateRepository(root, []));
    }
    await writeFile(join(root, 'content/lessons/L43/fr.md'), '# Duplicate\n');
    await writeFile(
      join(root, 'README.md'),
      '# Test\n\n[ambiguous](/fr/lessons/L43/)\n',
    );
    await assert.rejects(validateRepository(root, []));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('chapter and LZW links resolve only to existing locale-aware Astro sources', async () => {
  const root = await mkdtemp(join(tmpdir(), 'uni-math-chapter-links-'));
  try {
    await mkdir(join(root, 'src/pages/[locale]/chapters/C04'), {
      recursive: true,
    });
    await writeFile(
      join(root, 'src/pages/[locale]/chapters/C04.astro'),
      '<main/>',
    );
    await writeFile(
      join(root, 'src/pages/[locale]/chapters/C04/lzw.astro'),
      '<main/>',
    );
    for (const target of ['/fr/chapters/C04/', '/en/chapters/C04/lzw/']) {
      await writeFile(
        join(root, 'README.md'),
        `# Test\n\n[route](${target})\n`,
      );
      assert.equal(await validateRepository(root, []), 1);
    }
    for (const target of [
      '/fr/chapters/C99/',
      '/fr/chapters/C99/lzw/',
      '/fr/chapters/C04/missing/',
      '/de/chapters/C04/lzw/',
    ]) {
      await writeFile(
        join(root, 'README.md'),
        `# Test\n\n[missing](${target})\n`,
      );
      await assert.rejects(validateRepository(root, []));
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('logic workshop links resolve only for supported locales and an existing source', async () => {
  const root = await mkdtemp(join(tmpdir(), 'uni-math-workshop-links-'));
  try {
    await mkdir(join(root, 'src/pages/[locale]'), { recursive: true });
    const source = join(root, 'src/pages/[locale]/logic-workshop.astro');
    await writeFile(source, '<main/>');
    for (const target of ['/fr/logic-workshop/', '/en/logic-workshop/']) {
      await writeFile(
        join(root, 'README.md'),
        `# Test\n\n[route](${target})\n`,
      );
      assert.equal(await validateRepository(root, []), 1);
    }
    for (const target of [
      '/de/logic-workshop/',
      '/fr/logic-workshop/missing/',
      '/fr/missing-workshop/',
    ]) {
      await writeFile(
        join(root, 'README.md'),
        `# Test\n\n[missing](${target})\n`,
      );
      await assert.rejects(validateRepository(root, []));
    }
    await rm(source);
    await writeFile(
      join(root, 'README.md'),
      '# Test\n\n[missing](/fr/logic-workshop/)\n',
    );
    await assert.rejects(validateRepository(root, []));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
