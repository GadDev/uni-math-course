import { defineConfig, devices } from '@playwright/test';
import { hostedSettings } from './tests/hosted/settings.ts';

const settings = hostedSettings();
export default defineConfig({
  testDir: './tests/hosted',
  testMatch: '**/*.spec.ts',
  workers: 1,
  retries: 0,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  // No raw Playwright artifacts: login fields, cookies and saved work are private.
  reporter: [['./tests/hosted/reporter.ts']],
  outputDir: 'private/hosted-acceptance/artifacts',
  preserveOutput: 'never',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: settings.origin,
    trace: 'off',
    screenshot: 'off',
    video: 'off',
    serviceWorkers: 'block',
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    },
  },
  ...(settings.localFixture
    ? {
        webServer: {
          command: 'node tests/support/run-server.ts',
          url: settings.origin + '/fr/',
          timeout: 120_000,
          reuseExistingServer: false,
        },
      }
    : {}),
});
