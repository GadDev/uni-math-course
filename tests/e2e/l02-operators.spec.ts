import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en'] as const) {
  test(`L02 predicts and compares operators (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/lessons/L02/`);
    await expect(page.locator('.lesson-prose h2')).toHaveCount(6);
    const lab = page.locator('[data-operator-lab]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset')).toBeVisible();
    const feedback = lab.locator('[data-operator-feedback]');
    const result = lab.locator('[data-operator-result]');
    await lab.locator('[data-operator-predict="0"]').click();
    await expect(feedback).toContainText(
      locale === 'fr' ? 'À revoir' : 'Try again',
    );
    await expect(result).toHaveText('1');
    await lab.locator('[data-operator-formula]').selectOption('or');
    await expect(result).toHaveCount(0);
    await lab.locator('[data-operator-predict="1"]').focus();
    await page.keyboard.press('Enter');
    await expect(feedback).toContainText(
      locale === 'fr' ? 'Bonne réponse' : 'Correct',
    );
    await lab.locator('[data-operator-formula]').selectOption('xor');
    await lab.locator('[data-operator-predict="0"]').click();
    await expect(result).toHaveText('0');
    await lab.locator('[data-operator-input="A"]').uncheck();
    await expect(result).toHaveCount(0);
    await lab.locator('[data-operator-predict="1"]').click();
    await expect(result).toHaveText('1');
    await lab.locator('[data-operator-reset]').click();
    await expect(lab.locator('[data-operator-input="A"]')).toBeChecked();
    await expect(lab.locator('[data-operator-formula]')).toHaveValue('and');
    await expect(feedback).toBeEmpty();
    for (const [formula, expected] of [
      ['not-first', '1'],
      ['not-group', '0'],
      ['top', '1'],
    ]) {
      await lab.locator('[data-operator-formula]').selectOption(formula!);
      await lab.locator(`[data-operator-predict="${expected}"]`).click();
      await expect(result).toHaveText(expected!);
    }
    await page.emulateMedia({ media: 'print' });
    await expect(lab.locator('fieldset')).not.toBeVisible();
    await expect(lab.locator('.operator-print')).toBeVisible();
    await expect(page.locator('.operator-revision')).toBeVisible();
    await expect(page.locator('.katex-error')).toHaveCount(0);
  });

  test(`L02 static figures and print memo fit (${locale})`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 900 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L02/`);
      await expect(page.locator('[data-operator-static]')).toBeVisible();
      await expect(
        page.locator('[data-operator-lab] fieldset'),
      ).not.toBeVisible();
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
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
    } finally {
      await context.close();
    }
  });
}
