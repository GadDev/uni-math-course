import { test, expect } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  for (const width of [320, 375, 960, 1440]) {
    test(`Chapter 4 Ember Signal overview stays in the Signal shell (${locale}, ${width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(`/${locale}/chapters/C04/`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(
        locale === 'fr' ? 'Théorie de' : 'Information',
      );
      await expect(page.locator('.planned-list li')).toHaveCount(6);
      await expect(page.locator('.planned-list a')).toHaveCount(0);
      await expect(page.locator('.chapter-picker [aria-current="location"]')).toHaveAttribute(
        'data-chapter',
        'C04',
      );
      await expect(page.locator('.feature-formula .katex-mathml math')).toBeAttached();
      await expect(page.locator('.featured-action .primary-link')).toHaveAttribute(
        'href',
        '#parcours',
      );
      await expect(page.locator('.hero-art svg[data-variant="information"]')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
      await expect(page.locator('astro-island')).toHaveCount(0);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
      if (width <= 375) await expect(page.locator('.hero-art')).toBeHidden();
      else await expect(page.locator('.hero-art')).toBeVisible();
      await page.locator('.featured-action a').click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/chapters/C04/#parcours$`));
      const other = locale === 'fr' ? 'en' : 'fr';
      await page.getByRole('link', { name: other.toUpperCase(), exact: true }).click();
      await expect(page).toHaveURL(`/${other}/chapters/C04/`);
    });
  }
}

test('Chapter 4 overview is readable without JavaScript and has no unpublished lesson links', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/fr/chapters/C04/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Théorie');
    await expect(page.locator('.planned-list a')).toHaveCount(0);
    await page.locator('.featured-action a').click();
    await expect(page).toHaveURL(/#parcours$/);
  } finally {
    await context.close();
  }
});
