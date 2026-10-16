import {
  test,
  expect,
  type Browser,
  type BrowserContext,
  type Page,
} from '@playwright/test';
import { createServerClient } from '@supabase/ssr';
import { randomUUID } from 'node:crypto';
import { hostedSettings } from './settings.ts';

const settings = hostedSettings();
const origin = settings.origin;
const practice = (locale: string) => `/${locale}/lessons/L05/practice/`;
const historyTotal = (page: Page) =>
  page.locator('.progress-stats > div').nth(1).locator('dd').first();
const draft = (page: Page) =>
  page.evaluate(() => sessionStorage.getItem('um-practice:L05'));
const entry = async (page: Page) =>
  JSON.parse((await draft(page))!).entries['L05-E01'];

async function contextFor(browser: Browser) {
  const context = await browser.newContext({
    baseURL: origin,
    serviceWorkers: 'block',
  });
  context.setDefaultTimeout(15_000);
  return context;
}

async function login(page: Page, account: 'a' | 'b', locale: string) {
  if ((await page.request.get('/api/auth/session/')).status() === 200)
    await logout(page.context(), locale);
  await page.goto(`/${locale}/sign-in/`);
  expect(new URL(page.url()).origin === origin).toBe(true);
  expect(new URL(page.url()).pathname === `/${locale}/sign-in/`).toBe(true);
  await page.locator('input[name="email"]').fill(settings[account].email);
  await page.locator('input[name="password"]').fill(settings[account].password);
  await page
    .locator('form[action="/auth/login/"] button[type="submit"]')
    .click();
  await expect(page).toHaveURL(new RegExp(`/${locale}/account/$`));
  const session = await page.request.get('/api/auth/session/');
  expect(session.status()).toBe(200);
  expect(session.headers()['cache-control']).toContain('no-store');
  return (await session.json()).user.id as string;
}

async function logout(context: BrowserContext, locale: string) {
  const response = await context.request.post('/auth/logout/', {
    headers: { Origin: origin },
    form: { locale },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(303);
}

async function revisit(page: Page) {
  const checked = page.waitForResponse((r) =>
    r.url().endsWith('/api/auth/session/'),
  );
  await page.bringToFront();
  // OS foreground events are unreliable in headless environments. Exercise the
  // actual deployed handlers explicitly; this is not native BFCache evidence.
  await page.evaluate(() => {
    window.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new Event('visibilitychange'));
  });
  return checked;
}

async function rpcRows(context: BrowserContext, owner: string) {
  const client = createServerClient(
    settings.supabaseUrl!,
    settings.publishableKey!,
    {
      cookies: {
        getAll: () => context.cookies(origin),
        setAll: () => {},
      },
    },
  );
  // Token stays in memory and is never attached to reports or written as state.
  const { data } = await client.auth.getSession();
  expect(Boolean(data.session?.access_token)).toBe(true);
  const headers = {
    apikey: settings.publishableKey!,
    Authorization: `Bearer ${data.session!.access_token}`,
  };
  const response = await context.request.post(
    settings.supabaseUrl! + '/rest/v1/rpc/read_attempt_history',
    {
      headers,
      data: {},
    },
  );
  expect(response.status()).toBe(200);
  const rows = (await response.json()) as Record<string, unknown>[];
  expect(Array.isArray(rows)).toBe(true);
  expect(rows.every((row) => row.user_id === owner)).toBe(true);
  return { rows, headers };
}

test.beforeAll(async ({ request }) => {
  if (settings.localFixture) {
    const response = await request.post(
      'http://127.0.0.1:54329/__fixture/session',
      {
        data: {
          user: {
            id: randomUUID(),
            email: settings.b.email,
            role: 'authenticated',
            aud: 'authenticated',
          },
        },
      },
    );
    expect(response.status()).toBe(200);
  }
});

for (const locale of ['fr', 'en']) {
  test(`H2/H3 ${locale}: save, tab progress refresh, draft retention and later sign-in`, async ({
    browser,
  }) => {
    const context = await contextFor(browser);
    try {
      const page = await context.newPage();
      const owner = await login(page, 'a', locale);
      const cookies = (await context.cookies(origin)).filter((c) =>
        c.name.startsWith('sb-'),
      );
      expect(cookies.length > 0).toBe(true);
      expect(
        cookies.every(
          (c) =>
            c.httpOnly &&
            c.sameSite === 'Lax' &&
            (settings.localFixture || c.secure),
        ),
      ).toBe(true);
      const progress = await context.newPage();
      const loaded = await progress.goto(`/${locale}/progress/`);
      expect(loaded?.headers()['cache-control']).toContain('no-store');
      await expect(historyTotal(progress)).toBeVisible();
      const before = Number(await historyTotal(progress).textContent());
      expect(Number.isInteger(before)).toBe(true);
      await page.goto(practice(locale));
      await page.locator('.pp-options input').first().check();
      const saved = page.waitForResponse((r) =>
        r.url().endsWith('/api/attempts/'),
      );
      await page.locator('.pp-button-solid').click();
      expect((await saved).status()).toBe(201);
      await expect(page.locator('.pp-feedback')).toBeVisible();
      await page.reload();
      await expect(page.locator('.pp-feedback')).toBeVisible();
      await page
        .getByRole('button', {
          name: locale === 'en' ? 'Next exercise' : 'Exercice suivant',
          exact: false,
        })
        .click();
      await page.locator('.pp-step').nth(3).click();
      await page.locator('.pp-options input').first().check();
      await expect
        .poll(async () => JSON.parse((await draft(page))!).currentExerciseId)
        .toBe('L05-E04');
      const beforeDraft = await draft(page);
      expect((await revisit(page)).status()).toBe(200);
      expect(await draft(page)).toBe(beforeDraft);
      await page.goto(practice(locale === 'fr' ? 'en' : 'fr'));
      await expect(page.locator('.pp-step').nth(3)).toHaveAttribute(
        'aria-current',
        'step',
      );
      await expect(page.locator('.pp-options input').first()).toBeChecked();
      expect((await revisit(progress)).status()).toBe(200);
      await expect(historyTotal(progress)).toHaveText(String(before + 1));
      await expect(progress.locator('[data-session-private]')).toHaveAttribute(
        'data-session-private',
        owner,
      );
      await page.goto(`/${locale}/account/`);
      await page.goBack();
      await expect(page.locator('.pp-step').nth(3)).toHaveAttribute(
        'aria-current',
        'step',
      );
      await expect(page.locator('.pp-options input').first()).toBeChecked();
      await logout(context, locale);
      await login(page, 'a', locale);
      await page.goto(`/${locale}/progress/`);
      await expect(historyTotal(page)).toHaveText(String(before + 1));
    } finally {
      await context.close();
    }
  });

  test(`H2 ${locale}: another tab logout and account replacement clear private state`, async ({
    browser,
  }) => {
    const context = await contextFor(browser);
    try {
      const page = await context.newPage();
      const original = await login(page, 'a', locale);
      const delivered = await context.request.get('/api/exercises/L05/');
      expect(delivered.status()).toBe(200);
      const activity = (await delivered.json()).exercises.find(
        (item: { id: string }) => item.id === 'L05-E01',
      );
      await page.goto(practice(locale));
      await page.locator('.pp-options input').first().check();
      const other = await context.newPage();
      await logout(context, locale);
      expect((await revisit(page)).status()).toBe(401);
      await expect(page.locator('.pp-question')).toHaveCount(0);
      expect(await draft(page)).toBeNull();
      await login(other, 'a', locale);
      await page.goto(practice(locale));
      await page.locator('.pp-options input').first().check();
      const replacement = await login(other, 'b', locale);
      expect(original === replacement).toBe(false);
      const stale = await context.request.post('/api/attempts/', {
        headers: { Origin: origin },
        data: {
          expectedLearnerId: original,
          submissionId: randomUUID(),
          exerciseId: activity.id,
          version: activity.version,
          locale,
          response: { optionId: activity.options[0].id },
        },
      });
      expect(stale.status()).toBe(409);
      expect((await stale.json()).error).toBe('learner_context_changed');
      expect((await revisit(page)).status()).toBe(200);
      await expect(page.locator('.pp-question')).toHaveCount(0);
      expect(await draft(page)).toBeNull();
      await page
        .getByRole('button', {
          name:
            locale === 'en'
              ? 'Load current account'
              : 'Charger le compte actuel',
        })
        .click();
      await expect(page.locator('.pp-options')).toBeVisible();
      await expect(page.locator('input:checked')).toHaveCount(0);
    } finally {
      await context.close();
    }
  });

  for (const failure of ['lost-response', 'deadline'] as const) {
    test(`H3 ${locale}: ${failure} after real commit retries exact payload once`, async ({
      browser,
    }) => {
      const context = await contextFor(browser);
      try {
        const page = await context.newPage();
        await login(page, 'a', locale);
        await page.goto(`/${locale}/progress/`);
        await expect(historyTotal(page)).toBeVisible();
        const before = Number(await historyTotal(page).textContent());
        await page.goto(practice(locale));
        await page.locator('.pp-options input').first().check();
        if (failure === 'deadline') await page.clock.install();
        let original: unknown;
        let committed!: () => void;
        const saved = new Promise<void>((resolve) => {
          committed = resolve;
        });
        let release!: () => void;
        const gate = new Promise<void>((resolve) => {
          release = resolve;
        });
        await page.route(
          '**/api/attempts/',
          async (route) => {
            original = route.request().postDataJSON();
            const response = await route.fetch();
            expect(response.status()).toBe(201);
            committed();
            if (failure === 'deadline') {
              await gate;
              await route.fulfill({ response }).catch(() => {});
            } else await route.abort('failed');
          },
          { times: 1 },
        );
        try {
          await page.locator('.pp-button-solid').click();
          await saved;
          if (failure === 'deadline') await page.clock.runFor(15_001);
          await expect(page.locator('.practice-error')).toContainText(
            locale === 'en' ? 'couldn’t confirm' : 'pas pu confirmer',
          );
        } finally {
          release();
        }
        const snapshot = await entry(page);
        if (failure === 'deadline') await page.clock.resume();
        await page.reload();
        const restored = await entry(page);
        expect(restored.submissionId === snapshot.submissionId).toBe(true);
        expect(restored.submission).toEqual(snapshot.submission);
        const resent = page.waitForRequest(
          (r) => r.url().endsWith('/api/attempts/') && r.method() === 'POST',
        );
        const returned = page.waitForResponse((r) =>
          r.url().endsWith('/api/attempts/'),
        );
        await page
          .getByRole('button', {
            name:
              locale === 'en'
                ? 'Check saved response'
                : 'Vérifier l’enregistrement',
            exact: false,
          })
          .click();
        expect((await resent).postDataJSON()).toEqual(original);
        expect((await returned).status()).toBe(200);
        expect((await (await returned).json()).duplicate).toBe(true);
        await expect(page.locator('.pp-feedback')).toBeVisible();
        await page.goto(`/${locale}/progress/`);
        await expect(historyTotal(page)).toHaveText(String(before + 1));
      } finally {
        await context.close();
      }
    });
  }
}

test('H3: two real account sessions enforce Data API isolation and deny browser insertion', async ({
  browser,
  request,
}) => {
  test.skip(
    !settings.supabaseUrl,
    'Optional direct Data API configuration absent',
  );
  const a = await contextFor(browser);
  const b = await contextFor(browser);
  try {
    const ownerA = await login(await a.newPage(), 'a', 'en');
    const ownerB = await login(await b.newPage(), 'b', 'en');
    expect(ownerA === ownerB).toBe(false);
    const delivered = await a.request.get('/api/exercises/L05/');
    expect(delivered.status()).toBe(200);
    const exercise = (await delivered.json()).exercises.find(
      (e: { id: string }) => e.id === 'L05-E01',
    );
    const body = {
      expectedLearnerId: ownerA,
      submissionId: randomUUID(),
      exerciseId: exercise.id,
      version: exercise.version,
      locale: 'en',
      response: { optionId: exercise.options[0].id },
    };
    const saved = await a.request.post('/api/attempts/', {
      headers: { Origin: origin },
      data: body,
    });
    expect(saved.status()).toBe(201);
    const attemptId = (await saved.json()).attemptId;
    const savedB = await b.request.post('/api/attempts/', {
      headers: { Origin: origin },
      data: { ...body, expectedLearnerId: ownerB, submissionId: randomUUID() },
    });
    expect(savedB.status()).toBe(201);
    const attemptB = (await savedB.json()).attemptId;
    const own = await rpcRows(a, ownerA);
    const foreign = await rpcRows(b, ownerB);
    expect(own.rows.some((row) => row.id === attemptId)).toBe(true);
    expect(foreign.rows.some((row) => row.id === attemptId)).toBe(false);
    expect(foreign.rows.some((row) => row.id === attemptB)).toBe(true);
    expect(own.rows.some((row) => row.id === attemptB)).toBe(false);
    const filtered = await b.request.get(
      settings.supabaseUrl! + '/rest/v1/attempts',
      {
        headers: foreign.headers,
        params: { select: 'id', submission_id: `eq.${body.submissionId}` },
      },
    );
    expect(filtered.status()).toBe(200);
    expect(await filtered.json()).toEqual([]);
    const stale = await b.request.post('/api/attempts/', {
      headers: { Origin: origin },
      data: body,
    });
    expect(stale.status()).toBe(409);
    expect((await stale.json()).error).toBe('learner_context_changed');
    const anon = await request.post(
      settings.supabaseUrl! + '/rest/v1/rpc/read_attempt_history',
      { headers: { apikey: settings.publishableKey! }, data: {} },
    );
    expect([401, 403]).toContain(anon.status());
    const template = own.rows.find((row) => row.id === attemptId)!;
    const { id: _id, created_at: _at, ...copy } = template;
    const forbidden = await a.request.post(
      settings.supabaseUrl! + '/rest/v1/attempts',
      { headers: own.headers, data: { ...copy, submission_id: randomUUID() } },
    );
    expect([401, 403]).toContain(forbidden.status());
  } finally {
    await a.close();
    await b.close();
  }
});
