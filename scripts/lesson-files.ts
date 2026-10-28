import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function readLessonSource(directory: string, locale: string) {
  const candidates = (await readdir(directory)).filter((name) =>
    [locale + '.md', locale + '.mdx'].includes(name),
  );
  assert.equal(
    candidates.length,
    1,
    `expected one ${locale} lesson source (.md or .mdx)`,
  );
  return readFile(join(directory, candidates[0]!), 'utf8');
}

// Resolve the exact reviewed source files, in French/English order. Keep the
// release gate strict when adding MDX: no duplicate or unrecorded counterpart.
export function lessonFiles(id: string, fingerprints: Record<string, string>) {
  return ['fr', 'en'].map((locale) => {
    const candidates = ['md', 'mdx']
      .map((extension) => `content/lessons/${id}/${locale}.${extension}`)
      .filter((path) => Object.hasOwn(fingerprints, path));
    assert.equal(
      candidates.length,
      1,
      `${id}: expected one ${locale} lesson source (.md or .mdx)`,
    );
    return candidates[0]!;
  });
}
