import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { validateBank } from '../../../../scripts/check-content.mjs';

// Review selected content, including withdrawn practice, without silently
// substituting an archive. This does not certify release fingerprints/review.
export async function loadSelectedBanks(root) {
  const { lessons } = JSON.parse(
    await readFile(join(root, 'content/releases.json'), 'utf8'),
  );
  assert.ok(lessons && typeof lessons === 'object' && !Array.isArray(lessons));
  const banks = [];
  for (const [lessonId, release] of Object.entries(lessons).sort()) {
    assert.match(lessonId, /^L\d{2}$/);
    assert.ok(Number.isInteger(release.version) && release.version > 0);
    const bank = validateBank(
      JSON.parse(
        await readFile(
          join(root, 'exercises', lessonId, `v${release.version}.json`),
          'utf8',
        ),
      ),
    );
    assert.equal(bank.lessonId, lessonId);
    assert.equal(bank.version, release.version);
    banks.push(bank);
  }
  return banks;
}
