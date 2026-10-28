import { readFileSync } from 'node:fs';
const files = [
  "src/pages/[locale]/index.astro",
  "src/pages/[locale]/offline.astro",
  "src/styles/offline.css",
  "scripts/offline-manifest.ts",
  "tests/e2e/offline-pwa.spec.ts",
  "tests/repository/offline-pwa.test.ts"
];
for (const path of files) {
  console.log('PWA_FORMAT_JSON ' + JSON.stringify({ path, content: readFileSync(path, 'utf8') }));
}
