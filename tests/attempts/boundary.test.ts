import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const files = (directory: string): string[] =>
  readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });

test('answer-bearing modules are imported only by server API routes', () => {
  const offenders = files('src')
    .filter((path) => /\.(astro|tsx?|jsx?)$/.test(path))
    .filter(
      (path) =>
        !path.startsWith(join('src', 'lib', 'exercises')) &&
        !path.startsWith(join('src', 'pages', 'api')) &&
        path !== join('src', 'pages', '[locale]', 'progress.astro'),
    )
    .filter((path) =>
      /lib\/exercises|exercises\/L\d\d/.test(readFileSync(path, 'utf8')),
    );
  assert.deepEqual(offenders, []);
});

test('the practice component and its page only talk to the API', () => {
  const source = readFileSync('src/components/PracticeActivity.tsx', 'utf8');
  assert.doesNotMatch(
    source,
    /SUPABASE_SECRET_KEY|process\.env|import\.meta\.env|correctAnswer/,
  );
  assert.match(source, /\/api\/exercises\//);
  assert.match(source, /\/api\/attempts\//);
});

test('the progress page that reads the bank is on demand and has no client code', () => {
  const source = readFileSync('src/pages/[locale]/progress.astro', 'utf8');
  assert.match(source, /export const prerender = false/);
  assert.doesNotMatch(source, /\sclient:(load|idle|visible|media|only)/);
});
