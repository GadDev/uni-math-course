import { test, expect } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`${locale}: theory diagrams and guided reasoning remain readable without JavaScript and in print`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 900 },
    });
    const page = await context.newPage();
    try {
      for (const lesson of [48, 51, 52, 53, 54]) {
        await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L${lesson}/`);
        const figure = page.locator('.info-concept-figure');
        await expect(figure).toHaveCount(1);
        await expect(figure.locator('img')).toHaveAttribute('alt', /\S/);
        await figure.scrollIntoViewIfNeeded();
        await expect(figure.locator('img')).toBeVisible();
        await expect
          .poll(() =>
            figure
              .locator('img')
              .evaluate(
                (el: HTMLImageElement) =>
                  el.complete && el.naturalWidth === 480,
              ),
          )
          .toBe(true);
        const scroll = figure.getByRole('region');
        await scroll.focus();
        await expect(scroll).toBeFocused();
        await page.keyboard.press('ArrowRight');
        const guided = page.locator('.info-guided details').first();
        await guided.locator('summary').click();
        await expect(guided).toHaveAttribute('open', '');
        await expect(guided.locator('p').first()).toBeVisible();
        await guided.locator('summary').click();
        await expect(guided).not.toHaveAttribute('open');
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(320);
        await expect(page.locator('.katex-error')).toHaveCount(0);
        await page.emulateMedia({ media: 'print' });
        await expect(figure.locator('img')).toBeVisible();
        // Print opens native disclosure content even if its screen state is closed.
        expect(
          await guided
            .locator('p')
            .first()
            .evaluate((el) => el.getBoundingClientRect().height),
        ).toBeGreaterThan(0);
        await page.emulateMedia({ media: 'screen' });
      }
    } finally {
      await context.close();
    }
  });
}
