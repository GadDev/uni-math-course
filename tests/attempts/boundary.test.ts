import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const files = (directory: string): string[] =>
  readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });

test('answer-bearing modules are confined to explicit server routes', () => {
  const offenders = files('src')
    .filter((path) => /\.(astro|tsx?|jsx?)$/.test(path))
    .filter(
      (path) =>
        !path.startsWith(join('src', 'lib', 'exercises')) &&
        !path.startsWith(join('src', 'pages', 'api')) &&
        path !== join('src', 'pages', '[locale]', 'progress.astro') &&
        path !==
          join(
            'src',
            'pages',
            '[locale]',
            'lessons',
            '[lessonId]',
            'practice.astro',
          ),
    )
    .filter((path) =>
      /lib\/exercises|exercises\/L\d\d/.test(readFileSync(path, 'utf8')),
    );
  assert.deepEqual(offenders, []);
});

test('the practice client has no server settings and keeps API recovery paths', () => {
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

// The practice route can import only the sanitizing projection. Test the actual
// serialized document too in practice-performance.spec.ts.
test('practice page uses only the public exercise projection on demand', () => {
  const source = readFileSync(
    'src/pages/[locale]/lessons/[lessonId]/practice.astro',
    'utf8',
  );
  assert.match(source, /export const prerender = false/);
  assert.match(source, /lib\/exercises\/public-bank/);
  assert.doesNotMatch(source, /lib\/exercises\/(bank|grading)/);
});
