import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { selectedL05Version } from './released-bank.ts';

const app = 'http://127.0.0.1:4321';
const fixture = 'http://127.0.0.1:54329';

async function identify(context: BrowserContext) {
  const issued = await (
    await context.request.post(fixture + '/__fixture/session', { data: {} })
  ).json();
  await context.addCookies([
    {
      name: issued.cookieName,
      value: issued.cookieValue,
      url: app,
      httpOnly: true,
      sameSite: 'Lax',
    },
    { name: 'um-session', value: '1', url: app },
  ]);
  return issued.session;
}

// Deterministically exercise the browser event handlers. Real tabs share the
// cookie jar; synthetic visibility/pageshow events also cover headless runners
// that do not consistently move pages into the OS foreground or enable BFCache.
async function revisit(page: Page, restored = false) {
  const checked = page.waitForResponse((r) =>
    r.url().endsWith('/api/auth/session/'),
  );
  await page.evaluate((restored) => {
    if (restored)
      window.dispatchEvent(
        new PageTransitionEvent('pageshow', { persisted: true }),
      );
    else {
      window.dispatchEvent(new Event('focus'));
      document.dispatchEvent(new Event('visibilitychange'));
    }
  }, restored);
  return checked;
}

for (const locale of ['fr', 'en'] as const) {
  test(`same learner focus preserves draft; another tab's saved attempt refreshes progress (${locale})`, async ({
    page,
    context,
  }) => {
    const owner = await identify(context);
    await page.goto(`/${locale}/lessons/L05/practice/`);
    await expect(page.locator('.profile-menu')).toBeVisible();
    await page.locator('input[value="10"]').check();
    const before = await page.evaluate(() =>
      sessionStorage.getItem('um-practice:L05'),
    );
    expect((await revisit(page)).status()).toBe(200);
    await expect(page.locator('input[value="10"]')).toBeChecked();
    expect(
      await page.evaluate(() => sessionStorage.getItem('um-practice:L05')),
    ).toBe(before);
    const progress = await context.newPage();
    await progress.goto(`/${locale}/progress/`);
    await expect(progress.locator('.profile-menu')).toBeVisible();
    await expect(progress.locator('.progress-history li')).toHaveCount(0);
    const saved = await context.request.post('/api/attempts/', {
      headers: { Origin: app },
      data: {
        expectedLearnerId: owner.user.id,
        submissionId: randomUUID(),
        exerciseId: 'L05-E01',
        version: selectedL05Version,
        locale,
        response: { optionId: '10' },
      },
    });
    expect(saved.status()).toBe(201);
    expect((await revisit(progress)).status()).toBe(200);
    await expect(progress.locator('.progress-history li')).toHaveCount(1);
    await expect(page.locator('input[value="10"]')).toBeChecked();
  });

  test(`logout in another tab clears old practice and private progress on return (${locale})`, async ({
    page,
    context,
  }) => {
    await identify(context);
    await page.goto(`/${locale}/lessons/L05/practice/`);
    await expect(page.locator('.profile-menu')).toBeVisible();
    await page.locator('input[value="10"]').check();
    const progress = await context.newPage();
    await progress.goto(`/${locale}/progress/`);
    await expect(progress.locator('.profile-menu')).toBeVisible();
    await progress.request.post('/auth/logout/', {
      headers: { Origin: app },
      form: { locale },
    });
    expect((await revisit(page)).status()).toBe(401);
    await expect(page.locator('.pp-question')).toHaveCount(0);
    await expect(page.locator('.profile-menu')).toBeHidden();
    expect(
      await page.evaluate(() => sessionStorage.getItem('um-practice:L05')),
    ).toBeNull();
    await revisit(progress, true);
    await expect(progress).toHaveURL(new RegExp(`/${locale}/sign-in/`));
    await expect(progress.locator('.progress-history')).toHaveCount(0);
  });
}

test('account switch clears private identity and drafts before loading the current learner', async ({
  page,
  context,
}) => {
  const original = await identify(context);
  await page.goto('/en/lessons/L05/practice/');
  await expect(page.locator('.profile-menu')).toBeVisible();
  await page.locator('input[value="10"]').check();
  const account = await context.newPage();
  await account.goto('/en/account/');
  await expect(account.locator('.account-identity')).toHaveText(
    original.user.email,
  );
  const replacement = await identify(context);
  expect((await revisit(page)).status()).toBe(200);
  await expect(page.getByRole('alert')).toContainText(
    'The account has changed',
  );
  await expect(page.locator('.pp-question')).toHaveCount(0);
  await revisit(account, true);
  await expect(account.locator('.account-identity')).toHaveText(
    replacement.user.email,
  );
  await page.getByRole('button', { name: 'Load current account' }).click();
  await expect(page.locator('.pp-options')).toBeVisible();
  await expect(page.locator('input:checked')).toHaveCount(0);
});

test('503 preserves private UI and drafts, coalesces return events, and recovers on the next check', async ({
  page,
  context,
}) => {
  await identify(context);
  await page.goto('/en/lessons/L05/practice/');
  await expect(page.locator('.profile-menu')).toBeVisible();
  await page.locator('input[value="10"]').check();
  let calls = 0;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/api/auth/session/', async (route) => {
    calls++;
    await gate;
    await route.fulfill({ status: 503, json: { error: 'auth_unavailable' } });
  });
  const checked = revisit(page);
  await expect.poll(() => calls).toBe(1);
  // The additional cluster arrives while the shared request is still pending.
  await page.evaluate(() => {
    window.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new Event('visibilitychange'));
    window.dispatchEvent(
      new PageTransitionEvent('pageshow', { persisted: true }),
    );
  });
  // Give the coalescing timer a turn before releasing the network response.
  await page.waitForTimeout(100);
  expect(calls).toBe(1);
  release();
  expect((await checked).status()).toBe(503);
  await expect(page.getByRole('status')).toContainText('could not be checked');
  await expect(page.locator('input[value="10"]')).toBeChecked();
  await expect(page.locator('.profile-menu')).toBeVisible();
  expect(
    await page.evaluate(() => sessionStorage.getItem('um-practice:L05')),
  ).not.toBeNull();
  await page.unroute('**/api/auth/session/');
  expect((await revisit(page, true)).status()).toBe(200);
  await expect(page.getByRole('status')).toBeHidden();
  await expect(page.locator('input[value="10"]')).toBeChecked();
});

test('back/forward navigation restores draft and pageshow refreshes stale saved history', async ({
  page,
  context,
}) => {
  const owner = await identify(context);
  await page.goto('/en/lessons/L05/practice/');
  await page.locator('input[value="10"]').check();
  await page.goto('/en/progress/');
  await page.goBack();
  await expect(page.locator('input[value="10"]')).toBeChecked();
  await page.goForward();
  await expect(page.locator('.profile-menu')).toBeVisible();
  const saved = await context.request.post('/api/attempts/', {
    headers: { Origin: app },
    data: {
      expectedLearnerId: owner.user.id,
      submissionId: randomUUID(),
      exerciseId: 'L05-E01',
      version: selectedL05Version,
      locale: 'en',
      response: { optionId: '10' },
    },
  });
  expect(saved.status()).toBe(201);
  await revisit(page, true);
  await expect(page.locator('.progress-history li')).toHaveCount(1);
});

test('an old submission response cannot restore private feedback after an account switch', async ({
  page,
  context,
}) => {
  await identify(context);
  await page.goto('/en/lessons/L05/practice/');
  await expect(page.locator('.profile-menu')).toBeVisible();
  await page.locator('input[value="10"]').check();
  let release!: () => void;
  let committed!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const saved = new Promise<void>((resolve) => {
    committed = resolve;
  });
  await page.route('**/api/attempts/', async (route) => {
    const response = await route.fetch();
    committed();
    await gate;
    await route.fulfill({ response });
  });
  try {
    await page.locator('.pp-button-solid').click();
    await saved;
    await identify(context);
    await revisit(page);
    await expect(page.getByRole('alert')).toContainText(
      'The account has changed',
    );
    await page.getByRole('button', { name: 'Load current account' }).click();
    await expect(page.locator('.pp-options')).toBeVisible();
    await expect(page.locator('input:checked')).toHaveCount(0);
  } finally {
    release();
  }
  // Wait for the old fetch to settle before checking that it was discarded.
  await page.waitForResponse((r) => r.url().endsWith('/api/attempts/'));
  await expect(page.locator('.pp-feedback')).toHaveCount(0);
  await expect(page.locator('input:checked')).toHaveCount(0);
});

test('a delayed explicit exercise reload cannot reveal the old learner after a session check detects a switch', async ({
  page,
  context,
}) => {
  await identify(context);
  await page.goto('/en/lessons/L05/practice/');
  await expect(page.locator('.pp-options')).toBeVisible();
  await identify(context);
  await revisit(page);
  await expect(page.getByRole('alert')).toContainText(
    'The account has changed',
  );
  let release!: () => void;
  let loaded!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const delivered = new Promise<void>((resolve) => {
    loaded = resolve;
  });
  await page.route(
    '**/api/exercises/L05/',
    async (route) => {
      const response = await route.fetch();
      loaded();
      await gate;
      await route.fulfill({ response });
    },
    { times: 1 },
  );
  await page.getByRole('button', { name: 'Load current account' }).click();
  try {
    await delivered;
    await expect(page.locator('.profile-menu')).toBeVisible();
    await identify(context);
    await revisit(page);
  } finally {
    release();
  }
  await expect(page.getByRole('alert')).toContainText(
    'The account has changed',
  );
  await expect(page.locator('.pp-question')).toHaveCount(0);
  await page.getByRole('button', { name: 'Load current account' }).click();
  await expect(page.locator('.pp-options')).toBeVisible();
  await expect(page.locator('input:checked')).toHaveCount(0);
});
