import { spawn } from 'node:child_process';
import { startAuthFixture } from './auth-fixture.mjs';
const build = spawn('pnpm', ['build:test'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    AUTH_PROVIDER: '',
    SUPABASE_URL: '',
    SUPABASE_PUBLISHABLE_KEY: '',
    AUTH_SITE_URL: '',
  },
});
if ((await new Promise((resolve) => build.on('exit', resolve))) !== 0)
  process.exit(1);
const fixture = await startAuthFixture();
const children = [];
for (const port of [4321, 4323]) {
  children.push(
    spawn(process.execPath, ['.test-build/server/entry.mjs'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        HOST: '127.0.0.1',
        PORT: String(port),
        AUTH_PROVIDER: port === 4321 ? 'password' : '',
        AUTH_SITE_URL: `http://127.0.0.1:${port}`,
        SUPABASE_URL: port === 4321 ? 'http://127.0.0.1:54329' : '',
        SUPABASE_PUBLISHABLE_KEY:
          port === 4321 ? 'sb_publishable_protocol_fixture' : '',
      },
    }),
  );
}
const stop = () => {
  for (const child of children) child.kill();
  fixture.close();
};
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, stop);
for (const child of children)
  child.on('exit', (code) => {
    if (code) {
      stop();
      process.exit(code);
    }
  });
