import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const statusDocuments = ['README.md', 'AGENTS.md', 'docs/ROADMAP.md'];
const start = '<!-- release-status:start -->';
const end = '<!-- release-status:end -->';

export function releaseStatus(releases) {
  const entries = Object.entries(releases.lessons).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  const reviewed = (select) =>
    entries
      .filter(([, record]) => select(record) === 'self-checked')
      .map(([id]) => id)
      .join(', ') || 'none';
  const exceptions = (select) =>
    entries.filter(([, record]) => select(record) === 'unreviewed-exception')
      .length;
  return `${start}
Release status (generated from content/releases.json): ${entries.length} public bilingual lessons; ${entries.filter(([, record]) => record.practice !== false).length} served practice banks. Mathematical author self-check: ${reviewed((record) => record.review)}; explicit unreviewed release exceptions: ${exceptions((record) => record.review)} banks. Translation self-check: ${reviewed((record) => record.translation.review)}; explicit unreviewed translation exceptions: ${exceptions((record) => record.translation.review)} lesson pairs. These records do not certify independent review or hosted class readiness.
${end}`;
}

export function replaceStatus(text, expected) {
  assert.equal(
    text.split(start).length,
    2,
    'Expected exactly one release-status start marker',
  );
  assert.equal(
    text.split(end).length,
    2,
    'Expected exactly one release-status end marker',
  );
  assert.ok(
    text.indexOf(start) < text.indexOf(end),
    'Release-status markers are reversed',
  );
  return (
    text.slice(0, text.indexOf(start)) +
    expected +
    text.slice(text.indexOf(end) + end.length)
  );
}

export async function syncReleaseStatus(write = false) {
  const expected = releaseStatus(
    JSON.parse(await readFile('content/releases.json', 'utf8')),
  );
  for (const path of statusDocuments) {
    const text = await readFile(path, 'utf8');
    const updated = replaceStatus(text, expected);
    if (write) await writeFile(path, updated);
    else
      assert.equal(
        text,
        updated,
        `${path}: stale release status; run pnpm sync:release-status after reviewing content/releases.json`,
      );
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await syncReleaseStatus(process.argv.includes('--write'));
}
