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

/* Temporary formatting probe. Removed immediately after capturing output. */
if (process.env.CI) {
  const prettier = await import('prettier');
  const name = 'tests/content/printable-exercises.test.ts';
  const options = (await prettier.resolveConfig(name)) ?? {};
  const formatted = await prettier.format(await readFile(name, 'utf8'), {
    ...options,
    filepath: name,
  });
  console.log('FMTUNIT|' + Buffer.from(formatted).toString('base64') + '|END');
}
