import { test, expect, type BrowserContext, type Page } from '@playwright/test';

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
const entry = (page: Page, id = 'L05-E01') =>
  page.evaluate(
    (id) => JSON.parse(sessionStorage.getItem('um-practice:L05')!).entries[id],
    id,
  );

for (const locale of ['fr', 'en'] as const) {
  const uncertain =
    locale === 'en'
      ? 'couldn’t confirm whether your answer was saved'
      : 'pas pu confirmer l’enregistrement';
  const recover =
    locale === 'en' ? 'Check saved response' : 'Vérifier l’enregistrement';

  test(`deadline ends waiting but retains exact replay after a committed save (${locale})`, async ({
    page,
    context,
  }) => {
    await identify(context);
    await page.goto(`/${locale}/lessons/L05/practice/`);
    await page.locator('input[value="10"]').check();
    await page.clock.install();
    let release!: () => void;
    let committed!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const saved = new Promise<void>((resolve) => {
      committed = resolve;
    });
    let original: unknown;
    await page.route(
      '**/api/attempts/',
      async (route) => {
        original = route.request().postDataJSON();
        const response = await route.fetch();
        committed();
        await gate;
        await route.fulfill({ response });
      },
      { times: 1 },
    );
    try {
      await page.locator('.pp-button-solid').click();
      await saved;
      const snapshot = await entry(page);
      await page.clock.runFor(15_001);
      await expect(page.locator('.practice-error')).toContainText(uncertain);
      await expect(
        page.getByRole('button', { name: recover, exact: false }),
      ).toBeEnabled();
      await expect(page.locator('input[value="10"]')).toBeDisabled();
      expect((await entry(page)).submissionId).toBe(snapshot.submissionId);
      expect((await entry(page)).submission).toEqual(snapshot.submission);
    } finally {
      release();
    }
    const resent = page.waitForRequest(
      (r) => r.url().endsWith('/api/attempts/') && r.method() === 'POST',
    );
    const returned = page.waitForResponse((r) =>
      r.url().endsWith('/api/attempts/'),
    );
    await page.getByRole('button', { name: recover, exact: false }).click();
    expect((await resent).postDataJSON()).toEqual(original);
    const result = await (await returned).json();
    expect(result.duplicate).toBe(true);
    await expect(page.locator('.pp-feedback')).toBeVisible();
    await page.goto(`/${locale}/progress/`);
    await expect(page.locator('.progress-history li')).toHaveCount(1);
  });

  test(`lost acknowledgement reports uncertainty and replays one attempt (${locale})`, async ({
    page,
    context,
  }) => {
    await identify(context);
    await page.goto(`/${locale}/lessons/L05/practice/`);
    await page.locator('input[value="10"]').check();
    await page.route(
      '**/api/attempts/',
      async (route) => {
        await route.fetch();
        await route.abort('failed');
      },
      { times: 1 },
    );
    await page.locator('.pp-button-solid').click();
    await expect(page.locator('.practice-error')).toContainText(uncertain);
    const before = await entry(page);
    await page.reload();
    await expect(page.locator('input[value="10"]')).toBeChecked();
    expect((await entry(page)).submissionId).toBe(before.submissionId);
    const check = page.getByRole('button', { name: recover, exact: false });
    await expect(check).toBeEnabled();
    const returned = page.waitForResponse((r) =>
      r.url().endsWith('/api/attempts/'),
    );
    await check.click();
    expect((await returned).ok()).toBe(true);
    await expect(page.locator('.pp-feedback')).toBeVisible();
    await page.goto(`/${locale}/progress/`);
    await expect(page.locator('.progress-history li')).toHaveCount(1);
  });

  test(`expired session offers sign-in and retries the same snapshot after same-learner renewal (${locale})`, async ({
    page,
    context,
  }) => {
    const owner = await identify(context);
    await page.goto(`/${locale}/lessons/L05/practice/`);
    await expect(page.locator('.profile-menu')).toBeVisible();
    await page.locator('input[value="10"]').check();
    await context.request.post(fixture + '/__fixture/revoke', {
      data: { refresh_token: owner.refresh_token },
    });
    const rejected = page.waitForResponse((r) =>
      r.url().endsWith('/api/attempts/'),
    );
    await page.locator('.pp-button-solid').click();
    expect((await rejected).status()).toBe(401);
    await expect(page.locator('.practice-error')).toContainText(
      locale === 'en' ? 'session has expired' : 'session a expiré',
    );
    await expect(page.locator('.practice-error a')).toHaveAttribute(
      'href',
      new RegExp(`/${locale}/sign-in/`),
    );
    const before = await entry(page);
    // Renew via the real login route while keeping this activity open. Confirmed
    // logout/401 tab revalidation still clears drafts under the privacy contract.
    await context.request.post('/auth/login/', {
      headers: { Origin: app },
      form: {
        email: owner.user.email,
        password: 'correct-horse-battery',
        locale,
      },
    });
    const resent = page.waitForRequest(
      (r) => r.url().endsWith('/api/attempts/') && r.method() === 'POST',
    );
    await page.getByRole('button', { name: recover, exact: false }).click();
    expect((await resent).postDataJSON().submissionId).toBe(
      before.submissionId,
    );
    await expect(page.locator('.pp-feedback')).toBeVisible();
    await page.goto(`/${locale}/progress/`);
    await expect(page.locator('.progress-history li')).toHaveCount(1);
  });

  test(`version conflict reloads current exercise without reusing its old answer (${locale})`, async ({
    page,
    context,
  }) => {
    await identify(context);
    await page.route(
      '**/api/exercises/L05/',
      async (route) => {
        const response = await route.fetch();
        const payload = await response.json();
        // A stale client version is rejected by the real grading endpoint.
        payload.exercises[3].version = 99;
        await route.fulfill({ response, json: payload });
      },
      { times: 1 },
    );
    await page.goto(`/${locale}/lessons/L05/practice/`);
    await page.locator('input[value="10"]').check();
    await page.locator('.pp-step').nth(3).click();
    await page.locator('.pp-options input').first().check();
    const rejected = page.waitForResponse((r) =>
      r.url().endsWith('/api/attempts/'),
    );
    await page.locator('.pp-button-solid').click();
    expect((await rejected).status()).toBe(409);
    await expect(page.getByRole('alert')).toContainText(
      locale === 'en' ? 'This exercise has changed' : 'Cet exercice a changé',
    );
    await expect(page.locator('.pp-button-solid')).toBeDisabled();
    const old = await entry(page, 'L05-E04');
    await page
      .getByRole('button', {
        name:
          locale === 'en'
            ? 'Load current version'
            : 'Charger la version actuelle',
      })
      .click();
    await expect(page.locator('.pp-step[aria-current="step"]')).toContainText(
      '04',
    );
    await expect(page.locator('input:checked')).toHaveCount(0);
    const fresh = await entry(page, 'L05-E04');
    expect(fresh.version).toBe(1);
    expect(fresh.submissionId).not.toBe(old.submissionId);
    expect(fresh.submission).toBeNull();
    expect((await entry(page)).answers).toEqual({ choice: '10' });
    await expect(page.locator('.pp-footnote')).toContainText(
      locale === 'en'
        ? 'Closing the tab may lose them'
        : 'Fermer l’onglet peut les effacer',
    );
    await page.goto(`/${locale}/progress/`);
    await expect(page.locator('.progress-history li')).toHaveCount(0);
  });
}
