import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  isOfflineReadingPath,
  offlinePagePaths,
} from '../../scripts/offline-manifest.ts';

test('offline index includes public reading but excludes authenticated routes', () => {
  for (const path of [
    '/fr/',
    '/en/',
    '/fr/offline/',
    '/en/chapters/C04/',
    '/fr/lessons/L49/',
    '/en/glossary/',
    '/fr/numbers/',
    '/en/exercises/',
  ]) {
    assert.equal(isOfflineReadingPath(path), true, path);
  }
  for (const path of [
    '/api/attempts',
    '/api/lesson-completions',
    '/auth/login/',
    '/fr/sign-in/',
    '/en/account/',
    '/fr/progress/',
    '/en/lessons/L05/practice/',
    '/fr/lessons/L05/practice/?x=1',
    '/pdfs/exercises/chapter-01-exercises.pdf',
  ]) {
    assert.equal(isOfflineReadingPath(path), false, path);
  }
  assert.deepEqual(
    offlinePagePaths(['/en/', 'fr/lessons/L05/', '/fr/account/', '/en/']),
    ['/en/', '/fr/lessons/L05/'],
  );
});

test('service worker protects private content and manifest is installable', () => {
  const worker = readFileSync('public/sw.js', 'utf8');
  assert.match(
    worker,
    /request\.mode === 'navigate' && publicPage\.test\(path\)/,
  );
  assert.doesNotMatch(worker, /\/api\/attempts|\/practice\/|\/pdfs\//);
  const manifest = JSON.parse(
    readFileSync('public/manifest.webmanifest', 'utf8'),
  );
  assert.equal(manifest.display, 'standalone');
  assert.ok(
    manifest.icons.some((icon: { sizes: string }) => icon.sizes === '192x192'),
  );
  assert.ok(
    manifest.icons.some((icon: { sizes: string }) => icon.sizes === '512x512'),
  );
});
