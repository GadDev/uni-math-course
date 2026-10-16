import { test, expect } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  for (const width of [1440, 960, 375, 320]) {
    test(`Chapter 2 overview is public and honest about preparation (${locale}, ${width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto(`/${locale}/chapters/C02/`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(
        locale === 'fr' ? 'Droites' : 'Straight lines',
      );
      await expect(page.locator('.status')).toContainText(
        locale === 'fr' ? 'Chapitre en préparation' : 'Chapter in preparation',
      );
      await expect(page.locator('.planned-list li')).toHaveCount(4);
      await expect(page.locator('.planned-list a')).toHaveCount(0);
      await expect(page.locator('.chapter-pending-action')).toBeDisabled();
      await expect(page.locator('.chapter-empty-progress dd')).toHaveCount(3);
      await expect(page.locator('.katex-mathml math')).toBeAttached();
      await expect(page.locator('astro-island')).toHaveCount(0);
      await expect(page.locator('[data-variant="decalage"]')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      if (width <= 375) await expect(page.locator('.hero-art')).toBeHidden();
      else await expect(page.locator('.hero-art')).toBeVisible();
      const primary = page.locator('.featured-action a');
      await primary.click();
      await expect(page).toHaveURL(
        new RegExp(`/${locale}/chapters/C02/#parcours$`),
      );
      const alternate = locale === 'fr' ? 'en' : 'fr';
      await page
        .getByRole('link', { name: alternate.toUpperCase(), exact: true })
        .click();
      await expect(page).toHaveURL(`/${alternate}/chapters/C02/#parcours`);
      await expect(page.locator('html')).toHaveAttribute('lang', alternate);
    });
  }
}

test('Chapter 2 reading works without JavaScript and does not change Chapter 1', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const noJS = await context.newPage();
    await noJS.goto('http://127.0.0.1:4321/fr/chapters/C02/');
    await expect(noJS.getByRole('heading', { level: 1 })).toContainText(
      'Droites',
    );
    await noJS.locator('.featured-action a').click();
    await expect(noJS).toHaveURL('/fr/chapters/C02/#parcours');
  } finally {
    await context.close();
  }
  await page.goto('/fr/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Logique',
  );
  await expect(page.locator('.hero-art svg')).toHaveAttribute(
    'data-variant',
    'logic',
  );
  await page.getByRole('link', { name: 'Lire la leçon' }).click();
  await expect(page).toHaveURL('/fr/lessons/L05/');
});
