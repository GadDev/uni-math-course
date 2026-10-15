import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

export async function validateReleases(
  releases,
  read = (path) => readFile(path),
) {
  for (const [id, record] of Object.entries(releases.lessons)) {
    assert.match(id, /^L\d{2}$/);
    assert.ok(Number.isInteger(record.version) && record.version > 0);
    assert.ok(['self-checked', 'unreviewed-exception'].includes(record.review));
    assert.ok(
      (await read(record.evidence)).length,
      `${id}: missing review/exception evidence`,
    );
    const paths = [
      `content/lessons/${id}/fr.md`,
      `content/lessons/${id}/en.md`,
      `exercises/${id}/v${record.version}.json`,
    ];
    assert.deepEqual(
      Object.keys(record.fingerprints).sort(),
      [...paths].sort(),
    );
    for (const path of paths) {
      const digest = createHash('sha256')
        .update(await read(path))
        .digest('hex');
      assert.equal(
        record.fingerprints[path],
        digest,
        `${id}: stale release review for ${path}. Review both languages/mathematics and explicitly renew the release record; current SHA-256: ${digest}`,
      );
    }
  }
}

export async function checkReleases() {
  await validateReleases(
    JSON.parse(await readFile('content/releases.json', 'utf8')),
  );
}
