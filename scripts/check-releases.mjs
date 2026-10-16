import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';

export async function validateReleases(
  releases,
  read = (path) => readFile(path),
) {
  for (const [id, record] of Object.entries(releases.lessons)) {
    assert.match(id, /^L\d{2}$/);
    assert.ok(Number.isInteger(record.version) && record.version > 0);
    assert.ok(
      record.practice === undefined || typeof record.practice === 'boolean',
    );
    assert.ok(['self-checked', 'unreviewed-exception'].includes(record.review));
    assert.ok(
      (await read(record.evidence)).length,
      `${id}: missing review/exception evidence`,
    );
    const translation = record.translation;
    assert.equal(
      translation?.source,
      'fr',
      `${id}: translation source must be French`,
    );
    assert.equal(
      translation?.target,
      'en',
      `${id}: translation target must be English`,
    );
    assert.ok(
      ['self-checked', 'unreviewed-exception'].includes(translation.review),
    );
    assert.ok(
      (await read(translation.evidence)).length,
      `${id}: missing translation review/exception evidence`,
    );
    assert.equal(
      translation.sourceFingerprint,
      record.fingerprints[`content/lessons/${id}/fr.md`],
      `${id}: translation source changed; renew bilingual review or explicitly retain the existing exception`,
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
  const releases = JSON.parse(await readFile('content/releases.json', 'utf8'));
  const lessons = (await readdir('content/lessons')).filter((id) =>
    /^L\d{2}$/.test(id),
  );
  validateReleaseCoverage(releases, lessons);
  await validateReleases(releases);
}

export function validateReleaseCoverage(releases, publishedLessonIds) {
  assert.deepEqual(
    Object.keys(releases.lessons).sort(),
    [...publishedLessonIds].sort(),
    'Every public reading lesson needs a freshness record, even when practice is withdrawn',
  );
}
