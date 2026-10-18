import { test, expect } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`Chapter 1 keeps the PDF's three parts (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/`);
    const parts = page.locator('.programme-part');
    await expect(parts).toHaveCount(3);
    for (const [index, count] of [8, 7, 5].entries()) {
      await expect(parts.nth(index).locator('.planned-list a')).toHaveCount(
        count,
      );
    }
    await expect(parts.nth(0).locator('h3')).toContainText(
      locale === 'fr' ? 'Logique propositionnelle' : 'Classical propositional',
    );
  });

  test(`Chapter 1 diagrams load and fit without JavaScript (${locale})`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 900 },
    });
    try {
      const page = await context.newPage();
      for (const [lesson, count] of [
        ['L03', 1],
        ['L04', 1],
        ['L10', 1],
        ['L13', 1],
        ['L15', 3],
      ] as const) {
        await page.goto(`http://127.0.0.1:4321/${locale}/lessons/${lesson}/`);
        const diagrams = page.locator('.lesson-prose img');
        await expect(diagrams).toHaveCount(count);
        for (const diagram of await diagrams.all()) {
          await expect(diagram).toHaveAttribute('alt', /.+/);
          await expect
            .poll(() =>
              diagram.evaluate((img) => (img as HTMLImageElement).naturalWidth),
            )
            .toBeGreaterThan(0);
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
          `${locale}/${lesson} must fit the 320px viewport`,
        ).toBeLessThanOrEqual(320);
      }
    } finally {
      await context.close();
    }
  });

  test(`Boolean algebra section survives language switching (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L04/`);
    await page
      .locator('.section-nav')
      .getByRole('link', {
        name: locale === 'fr' ? /Algèbre de Boole/ : /Boolean algebra/,
      })
      .click();
    const other = locale === 'fr' ? 'en' : 'fr';
    await page
      .getByRole('link', { name: other.toUpperCase(), exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${other}/lessons/L04/#`));
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: other === 'fr' ? /Algèbre de Boole/ : /Boolean algebra/,
      }),
    ).toBeInViewport();
  });
}
