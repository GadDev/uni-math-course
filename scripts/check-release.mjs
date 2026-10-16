import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function validateReleaseApproval(version, manifestVersion, approval) {
  assert.match(version, /^\d+\.\d+\.\d+$/, 'Use a stable application SemVer');
  assert.equal(
    version,
    manifestVersion,
    'Application and release manifest versions differ',
  );
  assert.equal(
    typeof approval.approved,
    'boolean',
    'Release approval must be explicit',
  );
  if (version === '0.0.0' && !approval.approved) return;
  assert.equal(
    approval.approved,
    true,
    'Hosted pilot acceptance pending: do not merge the first release PR. Record actual acceptance evidence and approve it in a separate reviewed PR.',
  );
  assert.ok(
    typeof approval.approvedBy === 'string' && approval.approvedBy.trim(),
    'Name the actual acceptance operator',
  );
  assert.ok(
    typeof approval.approvedAt === 'string' &&
      /^\d{4}-\d{2}-\d{2}T/.test(approval.approvedAt) &&
      Number.isFinite(Date.parse(approval.approvedAt)),
    'Record an actual ISO acceptance time',
  );
  assert.equal(
    approval.evidence,
    'docs/PILOT_ACCEPTANCE.md',
    'Link the authoritative acceptance record',
  );
}

export async function checkRelease(
  root = fileURLToPath(new URL('../', import.meta.url)),
) {
  const json = async (path) =>
    JSON.parse(await readFile(resolve(root, path), 'utf8'));
  const pkg = await json('package.json');
  const manifest = await json('.release-please-manifest.json');
  const approval = await json('.github/release-approval.json');
  validateReleaseApproval(pkg.version, manifest['.'], approval);
  assert.equal(
    pkg.private,
    true,
    'This application must not be published to npm',
  );
  if (approval.approved) {
    assert.ok(
      (await readFile(resolve(root, approval.evidence), 'utf8')).trim(),
      'Acceptance evidence is missing',
    );
  }
  return pkg.version;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  console.log('Release policy checked for ' + (await checkRelease()));
}
