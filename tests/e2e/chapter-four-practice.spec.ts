import { test, expect, type BrowserContext } from '@playwright/test';

const app = 'http://127.0.0.1:4321';
const fixture = 'http://127.0.0.1:54329';

async function identify(context: BrowserContext) {
  const issued = await (
    await context.request.post(fixture + '/__fixture/session', {
      data: {},
    })
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
}

for (const locale of ['fr', 'en']) {
  test(`Chapter 4 practice requires a verified account (${locale})`, async ({
    request,
  }) => {
    const response = await request.get(
      `/${locale}/lessons/L49/practice/`,
      { maxRedirects: 0 },
    );
    expect(response.status()).toBe(303);
    expect(response.headers().location).toMatch(
      new RegExp(`^/${locale}/sign-in/\\?next=`),
    );
  });

  test(`signed-in Chapter 4 learners see 15 questions in every lesson (${locale})`, async ({
    context,
    page,
  }) => {
    await identify(context);
    await page.setViewportSize({ width: 375, height: 900 });
    for (let n = 43; n <= 49; n++) {
      const id = `L${n}`;
      const response = await page.goto(
        `/${locale}/lessons/${id}/practice/`,
      );
      expect(response?.status(), id).toBe(200);
      await expect(page.locator('.pp-step')).toHaveCount(15);
      await expect(page.locator('main')).toHaveAttribute(
        'data-chapter',
        'C04',
      );
      await expect(page.locator('.practice-geometry svg')).toHaveAttribute(
        'data-variant',
        'ember',
      );
      const markup = await page.content();
      expect(markup).not.toContain('"correctAnswer":');
      expect(markup).not.toContain('"answer":"a"');
      const width = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      expect(width).toBeLessThanOrEqual(375);
    }
  });
}
