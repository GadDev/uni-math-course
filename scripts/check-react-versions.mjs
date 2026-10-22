// Fail before Astro's SSR build if React and its renderer resolve different versions.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const declared = require('../package.json').dependencies;
const expected = declared.react;
const rendererVersion = declared['react-dom'];

const domRequire = createRequire(require.resolve('react-dom/package.json'));
const installed = [
  ['react', require('react/package.json').version],
  ['react-dom', require('react-dom/package.json').version],
  ['react used by react-dom', domRequire('react/package.json').version],
];

const errors = [];
if (!/^\d+\.\d+\.\d+$/.test(expected)) {
  errors.push('Pin react to an exact patch version in package.json.');
}
if (expected !== rendererVersion) {
  errors.push('react and react-dom must have the same declared version.');
}

console.log('React version required by the app: ' + expected);
for (const [name, version] of installed) {
  console.log(name + ': ' + version);
  if (version !== expected) {
    errors.push(name + ' resolved to ' + version + ', expected ' + expected);
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }
  console.error('Reinstall with pnpm 11.25.0 and --frozen-lockfile.');
  console.error('For Vercel, enable ENABLE_EXPERIMENTAL_COREPACK=1.');
  process.exitCode = 1;
}
