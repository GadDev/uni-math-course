import { test, expect, type BrowserContext } from '@playwright/test';
import { readFileSync } from 'node:fs';
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
for (const locale of ['fr', 'en']) {
  test(`Chapter 2 keeps incorrect feedback distinct at 320px (${locale})`, async ({
    page,
    context,
  }) => {
    await identify(context);
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(`/${locale}/lessons/L35/practice/`);
    await expect(page.locator('.pp-step')).toHaveCount(15);
    await page.locator('input[value="b"]').check();
    await page.locator('.pp-button-solid').click();
    const feedback = page.locator('.pp-feedback.is-wrong');
    await expect(feedback).toBeVisible();
    expect(
      await feedback.evaluate((e) => getComputedStyle(e).borderTopColor),
    ).toBe('rgb(237, 52, 38)');
    expect(
      await page
        .locator('.pp-step.is-wrong')
        .evaluate((e) => getComputedStyle(e).borderBottomColor),
    ).toBe('rgb(185, 40, 25)');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
  });
  for (const width of [320, 1280]) {
    test(`all Chapter 2 lessons render with chapter context and matching anchors (${locale}, ${width})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      for (let number = 21; number <= 36; number++) {
        const id = `L${number}`;
        const response = await page.goto(`/${locale}/lessons/${id}/`);
        expect(response?.status()).toBe(200);
        await expect(page.locator('main')).toHaveAttribute(
          'data-chapter',
          'C02',
        );
        await expect(
          page.locator('.course-outline .outline-topics li'),
        ).toHaveCount(16);
        await expect(page.locator('.breadcrumb a')).toHaveAttribute(
          'href',
          `/${locale}/chapters/C02/`,
        );
        await expect(page.locator('.reading-geometry svg')).toHaveAttribute(
          'data-variant',
          'decalage',
        );
        await expect(page.locator('.katex-error')).toHaveCount(0);
        await expect(page.locator('.katex-mathml math').first()).toBeAttached();
        await expect(page.locator('astro-island')).toHaveCount(
          number <= 27 ? 1 : 0,
        );
        if (number <= 27) {
          await expect(page.locator('astro-island')).toHaveAttribute(
            'component-url',
            /AlgebraExplorer/,
          );
          await expect(page.locator('astro-island')).toHaveAttribute(
            'client',
            'visible',
          );
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
      }
      await page.goto(`/${locale}/lessons/L35/`);
      await page
        .locator(width === 320 ? '.mobile-contents summary' : '.section-nav h2')
        .click();
      const links = page.locator(
        width === 320 ? '.mobile-contents' : '.section-nav',
      );
      await links
        .getByRole('link', { name: /^(Exemple guidé|Guided example)/ })
        .first()
        .click();
      const alternate = locale === 'fr' ? 'en' : 'fr';
      await page
        .getByRole('link', { name: alternate.toUpperCase(), exact: true })
        .click();
      expect(new URL(page.url()).pathname).toBe(`/${alternate}/lessons/L35/`);
      expect(decodeURIComponent(new URL(page.url()).hash)).toMatch(
        /^#(exemple-guidé|guided-example)/,
      );
    });
  }
  for (const id of ['L21', 'L33', 'L36']) {
    test(`new practice saves feedback and progress across reload, language and fresh sign-in (${locale}, ${id})`, async ({
      page,
      context,
      browser,
    }) => {
      const session = await identify(context);
      const releases = JSON.parse(
        readFileSync('content/releases.json', 'utf8'),
      );
      const version = releases.lessons[id].version;
      const bank = JSON.parse(
        readFileSync(`exercises/${id}/v${version}.json`, 'utf8'),
      );
      // A hard item exercises E15 routing as well as the larger 15-item bank.
      const exercise = bank.exercises[14];
      const destination = `/${locale}/lessons/${id}/practice/?exercise=${exercise.id}&version=${version}`;
      await page.goto(destination);
      await expect(page.locator('.pp-step')).toHaveCount(15);
      // Teaching scope may reorder the sequence; the explicit ID must remain selected.
      await expect(page.locator('.pp-options input').first()).toHaveAttribute(
        'name',
        exercise.id,
      );
      await page.locator(`input[value="${exercise.answer}"]`).check();
      const saved = page.waitForResponse(
        (r) =>
          r.url().endsWith('/api/attempts/') && r.request().method() === 'POST',
      );
      await page.locator('.pp-button-solid').click();
      expect((await saved).status()).toBe(201);
      await expect(page.locator('.pp-feedback')).toBeVisible();
      await page.reload();
      await expect(page.locator('.pp-feedback')).toBeVisible();
      const alternate = locale === 'fr' ? 'en' : 'fr';
      await page
        .getByRole('link', { name: alternate.toUpperCase(), exact: true })
        .click();
      await expect(page.locator('input:checked')).toHaveValue(exercise.answer);
      await expect(page.locator('.pp-feedback')).toBeVisible();
      await page.goto(`/${alternate}/progress/#chapter-C02`);
      await expect(page.locator('#chapter-C02')).toContainText('1 / 240');
      await expect(page.locator('.progress-history li')).toHaveCount(1);
      await expect(page.locator('.progress-history li')).toContainText(id);
      // A new browser context has no local practice draft; the account history is server-held.
      const fresh = await browser.newContext();
      try {
        await fresh.request.post('/auth/login/', {
          headers: { Origin: app },
          form: {
            locale: alternate,
            email: session.user.email,
            password: 'correct-horse-battery',
          },
        });
        const later = await fresh.newPage();
        await later.goto(`/${alternate}/progress/`);
        await expect(later.locator('.progress-history li')).toHaveCount(1);
        await expect(later.locator('#chapter-C02')).toContainText('1 / 240');
      } finally {
        await fresh.close();
      }
      const stranger = await browser.newContext();
      try {
        await identify(stranger);
        const other = await stranger.newPage();
        await other.goto(`/${alternate}/progress/`);
        await expect(other.locator('.progress-history li')).toHaveCount(0);
        await expect(other.locator('#chapter-C02')).toContainText('0 / 240');
      } finally {
        await stranger.close();
      }
    });
  }
  test(`Chapter 2 login retains the selected question (${locale})`, async ({
    page,
  }) => {
    const version = JSON.parse(readFileSync('content/releases.json', 'utf8'))
      .lessons.L36.version;
    const target = `/${locale}/lessons/L36/practice/?exercise=L36-E15&version=${version}`;
    await page.goto(target);
    await expect(page.locator('input[name="next"]')).toHaveValue(target);
    await page.locator('#email').fill('learner@example.invalid');
    await page.locator('#password').fill('correct-horse-battery');
    await page.locator('.auth-form button').click();
    await expect(page).toHaveURL(target);
    await expect(page.locator('.pp-options input').first()).toHaveAttribute(
      'name',
      'L36-E15',
    );
  });
}
