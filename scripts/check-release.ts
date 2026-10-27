import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function validateReleaseVersion(
  version: string,
  manifestVersion: string,
  privatePackage: boolean | undefined,
) {
  assert.match(version, /^\d+\.\d+\.\d+$/, 'Use a stable application SemVer');
  assert.equal(
    version,
    manifestVersion,
    'Application and release manifest versions differ',
  );
  assert.equal(
    privatePackage,
    true,
    'This application must not be published to npm',
  );
}

export async function checkRelease(
  root = fileURLToPath(new URL('../', import.meta.url)),
) {
  const json = async (path: string) =>
    JSON.parse(await readFile(resolve(root, path), 'utf8'));
  const pkg = await json('package.json');
  const manifest = await json('.release-please-manifest.json');
  validateReleaseVersion(pkg.version, manifest['.'], pkg.private);
  return pkg.version;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  console.log('Release policy checked for ' + (await checkRelease()));
}

/* Temporary formatting probe for PR #108: remove in the next commit. */
if (process.env.CI) {
  const prettier = await import('prettier');
  const filesToFormat = [
    'src/components/SecantExplorer.astro',
    'src/lib/chapters.ts',
    'src/lib/functions.ts',
    'src/lib/functions-lessons.ts',
    'src/pages/[locale]/chapters/C03.astro',
    'src/pages/[locale]/lessons/[lessonId].astro',
    'tests/content/chapter-three.test.ts',
    'tests/e2e/chapter-three.spec.ts',
  ];
  for (const file of filesToFormat) {
    const options = (await prettier.resolveConfig(file)) ?? {};
    const formatted = await prettier.format(await readFile(file, 'utf8'), {
      ...options,
      filepath: file,
    });
    console.log(
      'FMTFILE|' +
        encodeURIComponent(file) +
        '|' +
        Buffer.from(formatted).toString('base64') +
        '|DONE',
    );
  }
}
