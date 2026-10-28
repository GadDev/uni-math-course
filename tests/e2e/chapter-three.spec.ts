import { test, expect } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`Chapter 3 overview, lessons, navigation and mobile (${locale})`, async ({
    page,
  }) => {
    for (const width of [320, 375, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/chapters/C03/`);
      await expect(
        page.locator('.chapter-overview[data-chapter="C03"]'),
      ).toBeVisible();
      await expect(page.locator('.chapter-lessons li')).toHaveCount(6);
      await expect(
        page.locator('.chapter-picker [aria-current="location"]'),
      ).toHaveAttribute('data-chapter', 'C03');
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
    await page.goto(`/${locale}/lessons/L38/`);
    await expect(page.locator('[data-lesson-id="L38"]')).toBeVisible();
    await expect(
      page.locator('.reading-geometry [data-variant="functions-mosaic"]'),
    ).toHaveCount(1);
    await expect(
      page.locator(`a[href="/${locale}/lessons/L38/practice/"]`),
    ).toBeVisible();
  });

  test(`Secant presets and tangent-limit behaviour (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/chapters/C03/#secant`);
    await expect(page.locator('[data-secant-explorer]')).toBeVisible();
    await page.locator('[data-preset="1"]').click();
    await expect(page.locator('[data-slope]')).toHaveText(
      locale === 'fr' ? '1,5' : '1.5',
    );
    await page.locator('[data-preset="0"]').click();
    await expect(page.locator('[data-slope]')).toHaveText('→ 1');
    await expect(page.locator('[data-explanation]')).toContainText(
      locale === 'fr' ? 'indéfini' : 'undefined',
    );
    await page.locator('[data-preset="2"]').click();
    await expect(page.locator('[data-slope]')).toHaveText('2');
    const range = page.locator('[data-h]');
    await range.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('[data-h-value]')).toHaveText(
      locale === 'fr' ? '1,99' : '1.99',
    );
  });
}
