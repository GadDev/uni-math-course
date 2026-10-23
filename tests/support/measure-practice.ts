// Build first with `pnpm build:test`, then run this file with Node 24.
// Synthetic local protocol measurements, never hosted latency claims.
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';
import { startAuthFixture } from './auth-fixture.ts';

const origin = 'http://127.0.0.1:4321';
const counts: Record<string, number> = {};
const latency = 150;
const fixture = await startAuthFixture(54329, async (path) => {
  if (!path.startsWith('/auth/') && !path.startsWith('/rest/')) return;
  counts[path] = (counts[path] ?? 0) + 1;
  await delay(latency);
});
const app = spawn(process.execPath, ['.test-build/server/entry.mjs'], {
  stdio: ['ignore', 'ignore', 'inherit'],
  env: {
    ...process.env,
    HOST: '127.0.0.1',
    PORT: '4321',
    AUTH_PROVIDER: 'password',
    AUTH_SITE_URL: origin,
    SUPABASE_URL: 'http://127.0.0.1:54329',
    SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_protocol_fixture',
    SUPABASE_SECRET_KEY: 'sb_secret_protocol_fixture',
  },
});
let browser;
try {
  for (let attempt = 0; ; attempt++) {
    try {
      await fetch(origin + '/fr/');
      break;
    } catch (error) {
      if (attempt > 100) throw error;
      await delay(50);
    }
  }
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const context = await browser.newContext();
  const issued = await (
    await context.request.post('http://127.0.0.1:54329/__fixture/session', {
      data: {},
    })
  ).json();
  await context.addCookies([
    {
      name: issued.cookieName,
      value: issued.cookieValue,
      url: origin,
      httpOnly: true,
    },
    { name: 'um-session', value: '1', url: origin },
  ]);
  const page = await context.newPage();
  const samples = [];
  for (let i = 0; i < 6; i++) {
    const before = { ...counts };
    const requests: string[] = [];
    const track = (request: { url(): string }) => {
      if (request.url().includes('/api/'))
        requests.push(new URL(request.url()).pathname);
    };
    page.on('request', track);
    const start = performance.now();
    const documentResponse = await page.goto(
      origin + '/en/lessons/L05/practice/',
    );
    await page.waitForFunction(
      () => document.querySelector('.pp-options input'),
      null,
      { polling: 'raf' },
    );
    const readyMs = Math.round(performance.now() - start);
    const documentBytes = (await documentResponse!.body()).length;
    const navigation = await page.evaluate(() => {
      const entry = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      return {
        ttfbMs: Math.round(entry.responseStart),
        documentMs: Math.round(entry.responseEnd),
      };
    });
    await page.waitForLoadState('networkidle');
    const loadCalls = Object.fromEntries(
      Object.entries(counts)
        .map(([path, n]) => [path, n - (before[path] ?? 0)])
        .filter(([, n]) => n),
    );
    await page.locator('.pp-options input').first().check();
    const beforeSubmit = { ...counts };
    const feedbackMs = await page.evaluate(async () => {
      const start = performance.now();
      const feedback = new Promise<void>((resolve) => {
        const observer = new MutationObserver(() => {
          if (!document.querySelector('#pp-feedback-title')) return;
          observer.disconnect();
          resolve();
        });
        observer.observe(document.body, { childList: true, subtree: true });
      });
      document.querySelector<HTMLButtonElement>('.pp-button-solid')!.click();
      await feedback;
      return Math.round(performance.now() - start);
    });
    const submitCalls = Object.fromEntries(
      Object.entries(counts)
        .map(([path, n]) => [path, n - (beforeSubmit[path] ?? 0)])
        .filter(([, n]) => n),
    );
    samples.push({
      visit: i === 0 ? 'first' : 'repeat',
      readyMs,
      feedbackMs,
      documentBytes,
      ...navigation,
      loadCalls,
      submitCalls,
      requests,
    });
    page.off('request', track);
    await page.evaluate(() => sessionStorage.clear());
  }
  await context.clearCookies();
  const anonymousStart = performance.now();
  await page.goto(origin + '/en/lessons/L05/practice/');
  console.log(
    JSON.stringify(
      {
        delayPerUpstreamRequestMs: latency,
        samples,
        anonymous: {
          redirectMs: Math.round(performance.now() - anonymousStart),
          signIn: new URL(page.url()).pathname === '/en/sign-in/',
        },
      },
      null,
      2,
    ),
  );
} finally {
  await browser?.close();
  app.kill();
  fixture.closeAllConnections();
  await new Promise<void>((resolve) => fixture.close(() => resolve()));
}
