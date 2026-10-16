import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  validateReleases,
  validateReleaseCoverage,
} from '../../scripts/check-releases.mjs';

const fixture = () => {
  const files = {
    'review.md': 'Existing author self-check; no independent review claimed.',
    'content/lessons/L05/fr.md': 'Texte français',
    'content/lessons/L05/en.md': 'English text',
    'exercises/L05/v1.json': '{"version":1}',
  };
  const releases = {
    lessons: {
      L05: {
        version: 1,
        review: 'self-checked',
        evidence: 'review.md',
        translation: {
          source: 'fr',
          target: 'en',
          review: 'self-checked',
          evidence: 'review.md',
          sourceFingerprint: createHash('sha256')
            .update(files['content/lessons/L05/fr.md'])
            .digest('hex'),
        },
        fingerprints: Object.fromEntries(
          Object.entries(files)
            .filter(([p]) => p !== 'review.md')
            .map(([p, value]) => [
              p,
              createHash('sha256').update(value).digest('hex'),
            ]),
        ),
      },
    },
  };
  return {
    files,
    releases,
    read: async (path) => {
      assert.ok(Object.hasOwn(files, path), `Missing ${path}`);
      return files[path];
    },
  };
};

test('release fingerprints accept the recorded pair and explicit exception', async () => {
  const { releases, read } = fixture();
  await validateReleases(releases, read);
  releases.lessons.L05.review = 'unreviewed-exception';
  await validateReleases(releases, read);
});

test('removing a release record cannot bypass freshness for a public reading lesson', () => {
  const { releases } = fixture();
  validateReleaseCoverage(releases, ['L05']);
  assert.throws(
    () => validateReleaseCoverage({ lessons: {} }, ['L05']),
    /Every public reading lesson/,
  );
});

test('withdrawing practice still checks the French/English reading fingerprints', async () => {
  const { releases, files, read } = fixture();
  releases.lessons.L05.practice = false;
  await validateReleases(releases, read);
  files['content/lessons/L05/en.md'] += ' edited';
  await assert.rejects(
    validateReleases(releases, read),
    /stale release review/,
  );
});

for (const path of [
  'content/lessons/L05/en.md',
  'content/lessons/L05/fr.md',
  'exercises/L05/v1.json',
]) {
  test(`a changed ${path} blocks stale release evidence`, async () => {
    const { files, releases, read } = fixture();
    files[path] += ' changed';
    await assert.rejects(
      validateReleases(releases, read),
      /stale release review/,
    );
  });
}

test('missing translation or review evidence blocks a release', async () => {
  const { files, releases, read } = fixture();
  delete files['content/lessons/L05/en.md'];
  await assert.rejects(validateReleases(releases, read), /Missing/);
  const other = fixture();
  delete other.files['review.md'];
  await assert.rejects(validateReleases(other.releases, other.read), /Missing/);
});

test('refreshing only the release hash cannot silently certify a changed translation source', async () => {
  const { releases, files, read } = fixture();
  files['content/lessons/L05/fr.md'] += ' Nouvelle explication';
  releases.lessons.L05.fingerprints['content/lessons/L05/fr.md'] = createHash(
    'sha256',
  )
    .update(files['content/lessons/L05/fr.md'])
    .digest('hex');
  await assert.rejects(
    validateReleases(releases, read),
    /translation source changed/,
  );
  releases.lessons.L05.translation.sourceFingerprint =
    releases.lessons.L05.fingerprints['content/lessons/L05/fr.md'];
  await validateReleases(releases, read);
});

test('translation metadata and its own evidence are required, including under an exception', async () => {
  const { releases, read } = fixture();
  releases.lessons.L05.translation.review = 'unreviewed-exception';
  await validateReleases(releases, read);
  releases.lessons.L05.translation.evidence = 'missing.md';
  await assert.rejects(validateReleases(releases, read), /Missing/);
  delete releases.lessons.L05.translation;
  await assert.rejects(validateReleases(releases, read), /translation source/);
});
