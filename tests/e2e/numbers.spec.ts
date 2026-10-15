import { test, expect } from '@playwright/test';

for (const locale of ['en', 'fr'] as const) {
  test(
    'number families is a readable bilingual reference (' + locale + ')',
    async ({ page }) => {
      await page.goto('/' + locale + '/numbers/');
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('.numbers-table tbody tr')).toHaveCount(8);
      await expect(page.locator('.numbers-properties article')).toHaveCount(6);
      await expect(page.locator('.numbers-checks li')).toHaveCount(3);
      await expect(
        page.locator('.numbers-chain .katex-mathml math'),
      ).toBeAttached();
      await expect(page.locator('.numbers-diagram')).toHaveAttribute(
        'role',
        'img',
      );
      await expect(page.locator('.numbers-convention').first()).toContainText(
        'ℕ',
      );
      await expect(
        page.locator('.numbers-checks details').first(),
      ).not.toHaveAttribute('open');
      await page.locator('.numbers-checks summary').first().focus();
      await page.keyboard.press('Enter');
      await expect(
        page.locator('.numbers-checks details').first(),
      ).toHaveAttribute('open', '');
    },
  );

  for (const width of [320, 375, 768, 1280]) {
    test(
      'number families fits at ' + width + 'px (' + locale + ')',
      async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto('/' + locale + '/numbers/');
        await page.evaluate(() => document.fonts.ready);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
      },
    );
  }
}

test('numbers language switch preserves the section', async ({ page }) => {
  await page.goto('/fr/numbers/#family-tree');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL('/en/numbers/#family-tree');
  await expect(page.locator('#family-tree')).toBeAttached();
});

test('reference is reachable from home and the related L10 lesson', async ({
  page,
}) => {
  await page.goto('/en/');
  await page.getByRole('link', { name: 'Explore the number families' }).click();
  await expect(page).toHaveURL('/en/numbers/');
  await page.goto('/fr/lessons/L10/');
  await page
    .getByRole('link', {
      name: 'Guide visuel : familles de nombres',
      exact: true,
    })
    .click();
  await expect(page).toHaveURL('/fr/numbers/');
});
