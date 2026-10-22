// Fail before Astro's server build if the React renderer resolves a different React.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { dependencies } = require('../package.json');
const expected = dependencies.react;
const expectedDom = dependencies['react-dom'];

const reactDomManifest = require.resolve('react-dom/package.json');
const requireFromReactDom = createRequire(reactDomManifest);
const installed = {
  react: require('react/package.json').version,
  'react-dom': require(reactDomManifest).version,
  'react used by react-dom': requireFromReactDom('react/package.json').version,
};

console.log(
  `React build versions: declared react=${expected}, react-dom=${expectedDom}; ` +
    Object.entries(installed)
      .map(([name, version]) => `${name}=${version}`)
      .join(', '),
);

const failures = [];
if (!/^\d+\\.\d+\\.\d+$/.test(expected) || expected !== expectedDom) {
  failures.push('Pin react and react-dom to the same exact version in package.json.');
}
for (const [name, version] of Object.entries(installed)) {
  if (version !== expected) {
    failures.push(`${name} resolved to ${version}, expected ${expected}.`);
  }
}

if (failures.length > 0) {
  console.error(
    `React dependency mismatch:\n${failures.map((issue) => `- ${issue}`).join('\n')}\n` +
      'Install with pnpm 11.25.0 and pnpm install --frozen-lockfile. ' +
      'For Vercel, enable ENABLE_EXPERIMENTAL_COREPACK=1 and redeploy without cache.',
  );
  process.exitCode = 1;
}
