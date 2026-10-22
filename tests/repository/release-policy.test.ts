import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import {
  checkRelease,
  validateReleaseVersion,
} from '../../scripts/check-release.ts';

test('scaffold, first and later application releases need no hosted approval', () => {
  for (const version of ['0.0.0', '0.1.0', '0.1.1', '0.2.0', '1.0.0']) {
    validateReleaseVersion(version, version, true);
  }
});

test('version drift, unsupported versions and npm publication fail', () => {
  assert.throws(
    () => validateReleaseVersion('0.1.0', '0.0.0', true),
    /versions differ/,
  );
  for (const version of ['invalid', '0.1', 'v0.1.0', '0.1.0-beta.1']) {
    assert.throws(
      () => validateReleaseVersion(version, version, true),
      /stable application SemVer/,
    );
  }
  for (const privatePackage of [false, undefined]) {
    assert.throws(
      () => validateReleaseVersion('0.1.0', '0.1.0', privatePackage),
      /must not be published/,
    );
  }
});

test('first release checks only package and manifest, without an approval file', async () => {
  const root = await mkdtemp(join(tmpdir(), 'release-policy-'));
  try {
    await writeFile(
      join(root, 'package.json'),
      JSON.stringify({ version: '0.1.0', private: true }),
    );
    await writeFile(
      join(root, '.release-please-manifest.json'),
      JSON.stringify({ '.': '0.1.0' }),
    );
    assert.equal(await checkRelease(root), '0.1.0');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
