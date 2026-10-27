import { test, expect } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  for (const width of [320, 375, 960, 1440]) {
    test(`C04 Ember Signal (${locale}, ${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(`/${locale}/chapters/C04/`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toContainText(
        locale === 'fr' ? 'Théorie de' : 'Information',
      );
      await expect(page.locator('.planned-list li')).toHaveCount(6);
      await expect(page.locator('.planned-list a')).toHaveCount(0);
      const selected = page.locator('.chapter-option[aria-current]');
      await expect(selected).toHaveAttribute('data-chapter', 'C04');
      const math = page.locator('.feature-formula .katex-mathml math');
      await expect(math).toBeAttached();
      const primary = page.locator('.featured-action .primary-link');
      await expect(primary).toHaveAttribute('href', '#parcours');
      const artwork = page.locator('.hero-art svg[data-variant="ember"]');
      await expect(artwork).toHaveAttribute('aria-hidden', 'true');
      await expect(page.locator('astro-island')).toHaveCount(0);
      await page.evaluate(() => document.fonts.ready);
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      expect(scrollWidth).toBeLessThanOrEqual(width);
      if (width <= 375) await expect(page.locator('.hero-art')).toBeHidden();
      else await expect(page.locator('.hero-art')).toBeVisible();
      await primary.click();
      const anchorUrl = `/${locale}/chapters/C04/#parcours`;
      await expect(page).toHaveURL(anchorUrl);
      const other = locale === 'fr' ? 'en' : 'fr';
      await page.locator('[data-language-link]').click();
      await expect(page).toHaveURL(`/${other}/chapters/C04/`);
    });
  }
}

test('C04 works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/fr/chapters/C04/');
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toContainText('Théorie');
    await expect(page.locator('.planned-list a')).toHaveCount(0);
    await page.locator('.featured-action a').click();
    await expect(page).toHaveURL(/#parcours$/);
  } finally {
    await context.close();
  }
});
