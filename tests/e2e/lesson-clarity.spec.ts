import { test, expect, type BrowserContext } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { rewritePracticePayload } from '../support/practice-payload';
const releases = JSON.parse(
  readFileSync('content/releases.json', 'utf8'),
).lessons;
async function identify(context: BrowserContext) {
  const issued = await (
    await context.request.post('http://127.0.0.1:54329/__fixture/session', {
      data: {},
    })
  ).json();
  await context.addCookies([
    {
      name: issued.cookieName,
      value: issued.cookieValue,
      url: 'http://127.0.0.1:4321',
      httpOnly: true,
    },
    { name: 'um-session', value: '1', url: 'http://127.0.0.1:4321' },
  ]);
}
for (const locale of ['fr', 'en']) {
  test(`${locale}: exercise data tables, code and actual bank metadata are readable`, async ({
    page,
    context,
  }) => {
    await identify(context);
    await page.setViewportSize({ width: 320, height: 900 });
    for (const [id, item] of [
      ['L08', 'L08-E01'],
      ['L03', 'L03-E05'],
    ] as const) {
      await page.goto(
        `/${locale}/lessons/${id}/practice/?exercise=${item}&version=${releases[id].version}`,
      );
      const table = page.locator('.exercise-data-table');
      await expect(table.locator('thead th')).toHaveCount(3);
      await expect(table.locator('tbody tr')).toHaveCount(4);
      await expect(page.locator('.pp-prompt')).not.toContainText('| --- |');
      await expect(page.locator('.pp-subtitle')).toContainText(
        String(releases[id].version),
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
    }
    await page.goto(`/${locale}/lessons/L19/practice/`);
    await expect(page.locator('.pp-options code')).toHaveCount(4);
    await expect(page.locator('.pp-options')).not.toContainText('`');
    await page.goto(`/${locale}/lessons/L04/practice/`);
    await expect(page.locator('.pp-subtitle')).toContainText(
      `${locale === 'fr' ? 'Version de la banque' : 'Bank version'} ${releases.L04.version}`,
    );
    await page.locator('.pp-step').last().click();
    await expect(page.locator('.pp-subtitle')).toContainText(
      locale === 'fr' ? 'Difficile' : 'Hard',
    );
  });
  test(`${locale}: core questions lead, while extension deep links and drafts still work`, async ({
    page,
    context,
  }) => {
    await identify(context);
    for (const id of ['L35', 'L36']) {
      await page.goto(`/${locale}/lessons/${id}/practice/`);
      await expect(page.locator('.pp-scope strong')).toHaveText(
        locale === 'fr' ? 'Parcours principal' : 'Core practice',
      );
      await expect(page.locator('.pp-fieldset')).toHaveAttribute(
        'aria-describedby',
        'pp-prompt',
      );
      await page.goto(
        `/${locale}/lessons/${id}/practice/?exercise=${id}-E01&version=${releases[id].version}`,
      );
      await expect(page.locator('.pp-scope strong')).toHaveText(
        locale === 'fr' ? 'Approfondissement facultatif' : 'Optional extension',
      );
      await page.locator('.pp-options input').first().check();
      await page.reload();
      await expect(page.locator('.pp-options input').first()).toBeChecked();
      const link = page.locator('.pp-scope a');
      await link.click();
      const supplement = page.locator('article details').filter({
        has: page.locator(
          id === 'L35' ? '#supplement-square' : '#supplement-correlation',
        ),
      });
      await expect(supplement).toHaveAttribute('open', '');
    }
  });
  test(`${locale}: new lesson tables fit mobile and full-size figures have keyboard links`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    for (const id of [
      'L04',
      'L08',
      'L14',
      'L16',
      'L18',
      'L19',
      'L20',
      'L33',
      'L35',
      'L36',
    ]) {
      await page.goto(`/${locale}/lessons/${id}/`);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        id,
      ).toBeLessThanOrEqual(320);
      await expect(page.locator('.katex-error')).toHaveCount(0);
    }
    const link = page.locator('.figure-full-size').first();
    await link.focus();
    await expect(link).toBeFocused();
    const popup = page.waitForEvent('popup');
    await page.keyboard.press('Enter');
    const figure = await popup;
    await expect(figure).toHaveURL(/\/diagrams\/droites\/.*\.svg$/);
    await figure.close();
  });
}

test('exercise markup stays escaped while maths and code render', async ({
  page,
  context,
}) => {
  await identify(context);
  await page.route('**/en/lessons/L08/practice/', (route) =>
    rewritePracticePayload(route, (data) => {
      data.exercises[0]!.prompt.en =
        '<img src=x onerror="window.exerciseMarkupRan=true"> `x < y` **Reason** $x^2$';
    }),
  );
  await page.goto('/en/lessons/L08/practice/');
  const prompt = page.locator('#pp-prompt');
  await expect(prompt).toContainText('<img src=x');
  await expect(prompt.locator('img')).toHaveCount(0);
  await expect(prompt.locator('code')).toHaveText('x < y');
  await expect(prompt.locator('strong')).toHaveText('Reason');
  await expect(prompt.locator('.katex')).toHaveCount(1);
  expect(
    await page.evaluate(() => Object.hasOwn(window, 'exerciseMarkupRan')),
  ).toBe(false);
});
