import { readFileSync } from 'node:fs';

const paths = [
  'src/layouts/Base.astro',
  'src/lib/printable-exercises.ts',
  'src/pages/[locale]/exercises.astro',
  'src/styles/printable-exercises.css',
  'tests/content/printable-exercises.test.ts',
  'tests/e2e/printable-exercises.spec.ts',
];

for (const path of paths) {
  console.log('AUTO_FORMAT_B64 ' + path + ' ' + readFileSync(path).toString('base64'));
}
