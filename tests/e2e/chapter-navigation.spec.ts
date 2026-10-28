import { test, expect } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`switching chapters preserves language and leaves shared resources neutral (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L20/`);
    const picker = page.locator('.chapter-picker');
    await expect(picker.locator('summary')).toHaveAccessibleName(
      new RegExp('01'),
    );
    await picker.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(picker).toHaveAttribute('open', '');
    await page.keyboard.press('Tab');
    await expect(picker.locator('.chapter-option').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(picker).not.toHaveAttribute('open');
    await expect(picker.locator('summary')).toBeFocused();
    await picker.locator('summary').click();
    await picker.locator('[data-chapter="C02"]').click();
    await expect(page).toHaveURL(`/${locale}/chapters/C02/`);
    await expect(picker.locator('summary')).toHaveAccessibleName(
      new RegExp('02'),
    );
    await picker.locator('summary').click();
    await expect(picker.locator('[aria-current="location"]')).toHaveAttribute(
      'data-chapter',
      'C02',
    );
    await page.locator('.hero .lede').click();
    await expect(picker).not.toHaveAttribute('open');
    await picker.locator('summary').focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(picker).not.toHaveAttribute('open');
    await page.locator('.primary-nav > a').first().click();
    await expect(page).toHaveURL(`/${locale}/glossary/`);
    await picker.locator('summary').click();
    await expect(picker.locator('[aria-current]')).toHaveCount(0);
    await picker.locator('[data-chapter="C01"]').click();
    await expect(page).toHaveURL(`/${locale}/`);
  });

  for (const width of [320, 375, 960, 1050, 1051, 1440]) {
    test(`chapter panel and header fit without wrapping (${locale}, ${width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      for (const path of ['', 'chapters/C02/', 'chapters/C03/', 'chapters/C04/', 'glossary/']) {
        await page.goto(`/${locale}/${path}`);
        await page.evaluate(() => document.fonts.ready);
        const header = await page.locator('.site-header').boundingBox();
        expect(header!.height).toBeLessThanOrEqual(width > 1050 ? 100 : 145);
        for (const node of await page
          .locator('.primary-nav > a, .chapter-selector-title')
          .all()) {
          // Hidden/full label spans can create duplicate DOM rects; compare y positions.
          const ys = await node.evaluate((e) => {
            const r = document.createRange();
            r.selectNodeContents(e);
            return [
              ...new Set(
                [...r.getClientRects()]
                  .filter((r) => r.width > 0)
                  .map((r) => Math.round(r.y)),
              ),
            ];
          });
          expect(ys.length).toBe(1);
        }
        const trigger = page.locator('.chapter-picker summary');
        await trigger.click();
        const panel = await page.locator('.chapter-panel').boundingBox();
        expect(panel!.x).toBeGreaterThanOrEqual(0);
        expect(panel!.x + panel!.width).toBeLessThanOrEqual(width);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
        await expect(page.locator('.chapter-option')).toHaveCount(4);
        for (const link of await page.locator('.chapter-option').all())
          expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
    });
  }
}

test('chapter switching works without JavaScript at 320px', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 900 },
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/fr/');
    await page.locator('.chapter-picker summary').click();
    await page.locator('.chapter-option[data-chapter="C02"]').click();
    await expect(page).toHaveURL('/fr/chapters/C02/');
    await page.locator('.chapter-picker summary').click();
    await expect(
      page.locator('.chapter-option[aria-current="location"]'),
    ).toHaveAttribute('data-chapter', 'C02');
  } finally {
    await context.close();
  }
});
