import { test, expect } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`PDF path crosses stable lesson boundaries and preserves source anchors (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/chapters/C02/`);
    const path = page.locator('.source-path');
    await expect(path.locator('details')).toHaveCount(5);
    await expect(path.locator('li')).toHaveCount(48);
    await path.locator('a[href$="L23/#pdf-14"]').click();
    await expect(page.locator('#pdf-14')).toBeInViewport();
    const next = page.locator('.source-next a[href$="L22/#pdf-15"]');
    await next.click();
    await expect(page.locator('#pdf-15')).toBeInViewport();
    await expect
      .poll(() =>
        page
          .locator('.teaching-figure img')
          .first()
          .evaluate((img: HTMLImageElement) => img.naturalWidth),
      )
      .toBeGreaterThan(0);
    const other = locale === 'fr' ? 'en' : 'fr';
    await page
      .getByRole('link', { name: other.toUpperCase(), exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${other}/lessons/L22/#pdf-15$`));
    await expect(page.locator('#pdf-15')).toBeInViewport();
  });

  for (const width of [320, 1280]) {
    test(`teaching figures and data tables remain usable (${locale}, ${width})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const id of [
        'L22',
        'L26',
        'L27',
        'L28',
        'L29',
        'L30',
        'L31',
        'L32',
        'L33',
        'L34',
        'L35',
        'L36',
      ]) {
        await page.goto(`/${locale}/lessons/${id}/`);
        const figures = page.locator('.teaching-figure img');
        expect(await figures.count()).toBeGreaterThan(0);
        for (const figure of await figures.all()) {
          await figure.scrollIntoViewIfNeeded();
          await expect
            .poll(() =>
              figure.evaluate(
                (image: HTMLImageElement) =>
                  image.complete && image.naturalWidth > 0,
              ),
            )
            .toBe(true);
          const box = await figure.boundingBox();
          expect(box?.width).toBeLessThanOrEqual(width);
        }
        await expect(page.locator('.katex-error')).toHaveCount(0);
        // A stylesheet from a different KaTeX version leaves math bases inline,
        // allowing a subscript to wrap away from its parent symbol.
        await expect(
          page.locator('.lesson-prose .katex-base').first(),
        ).toHaveCSS('display', 'inline-block');
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
      }
    });
  }
}

test('PDF reading links, diagrams and examples work without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 },
  });
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4321/fr/chapters/C02/');
    await page.locator('.source-path a[href$="L26/#pdf-25"]').click();
    await expect(page.locator('#pdf-25')).toBeInViewport();
    await expect(page.locator('article')).toContainText(
      'indice, pas un exposant',
    );
    const image = page.locator('img[src$="/sigma.svg"]');
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (e: HTMLImageElement) => e.complete && e.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await page.locator('.source-next a[href$="#pdf-26"]').click();
    await expect(page.locator('#pdf-26')).toBeInViewport();
  } finally {
    await context.close();
  }
});
