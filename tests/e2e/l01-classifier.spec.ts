import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en'] as const) {
  test(`L01 classifier supports all four categories (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L01/`);
    await expect(page.locator('.lesson-prose h2')).toHaveCount(6);
    const lab = page.locator('[data-l01-classifier]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset')).toBeVisible();
    const feedback = lab.locator('[data-classifier-feedback]');
    await lab.locator('[data-classifier-choice="none"]').click();
    await expect(feedback).toContainText(
      locale === 'fr' ? 'À revoir' : 'Try again',
    );
    const answers = [
      'true',
      'false',
      'none',
      'none',
      'unknown',
      'none',
      'none',
      'true',
    ];
    for (const [index, answer] of answers.entries()) {
      const button = lab.locator(`[data-classifier-choice="${answer}"]`);
      await button.focus();
      await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(feedback).toContainText(
        locale === 'fr' ? 'Bonne réponse' : 'Correct',
      );
      if (index < answers.length - 1) {
        await lab.locator('[data-classifier-next]').click();
        await expect(feedback).toBeEmpty();
      }
    }
    await expect(lab.locator('[data-classifier-next]')).toBeDisabled();
    await lab.locator('[data-classifier-reset]').click();
    await expect(feedback).toBeEmpty();
    await expect(lab.locator('[data-classifier-prev]')).toBeDisabled();
    await page.emulateMedia({ media: 'print' });
    await expect(lab.locator('fieldset')).not.toBeVisible();
    await expect(lab.locator('[data-classifier-static]')).toBeVisible();
    await expect(page.locator('.l01-revision')).toBeVisible();
  });

  test(`L01 static diagrams and revision fit at 320px (${locale})`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 900 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L01/`);
      const lab = page.locator('[data-l01-classifier]');
      await expect(lab.locator('[data-classifier-static]')).toBeVisible();
      await expect(lab.locator('fieldset')).not.toBeVisible();
      const figures = page.locator('.lesson-prose img');
      await expect(figures).toHaveCount(2);
      for (const figure of await figures.all()) {
        await expect(figure).toHaveAttribute('alt', /.+/);
        await expect
          .poll(() =>
            figure.evaluate((img) => (img as HTMLImageElement).naturalWidth),
          )
          .toBeGreaterThan(0);
      }
      await expect(page.locator('.l01-revision')).toBeVisible();
      await expect(page.locator('.katex-error')).toHaveCount(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
    } finally {
      await context.close();
    }
  });
}
