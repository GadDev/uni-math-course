// Temporary CI formatting handoff. Removed before the PR is ready.
import { readFile } from 'node:fs/promises';
const files = [
  'src/lib/numbers.ts',
  'src/pages/[locale]/index.astro',
  'src/pages/[locale]/numbers.astro',
  'src/styles/numbers.css',
  'tests/e2e/numbers.spec.ts',
];
for (const [fileNumber, file] of files.entries()) {
  const source = await readFile(file, 'utf8');
  for (let index = 0, chunk = 0; index < source.length; index += 1000, chunk++) {
    console.log('__FMT__' + fileNumber + '__' + chunk + '__' + JSON.stringify(source.slice(index, index + 1000)));
  }
  console.log('__FMT_END__' + fileNumber + '__');
}
