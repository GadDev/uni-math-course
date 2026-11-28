import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en'] as const) {
  test(`L05 predicts and refutes with feedback (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L05/`);
    await expect(page.locator('.lesson-prose h2')).toHaveCount(6);
    const lab = page.locator('[data-implication-challenge]');
    await expect(lab).toHaveAttribute('data-ready', 'true');
    const task = lab.locator('[data-task]');
    const a = lab.locator('[data-challenge-a]');
    const b = lab.locator('[data-challenge-b]');
    const prediction = lab.locator('[data-prediction]');
    const check = lab.locator('[data-challenge-check]');
    const feedback = lab.locator('[data-challenge-feedback]');
    await expect(check).toBeDisabled();
    for (const [left, right, result] of [
      ['0', '0', '1'],
      ['0', '1', '1'],
      ['1', '0', '0'],
      ['1', '1', '1'],
    ] as const) {
      await a.selectOption(left);
      await b.selectOption(right);
      await prediction.selectOption(result === '1' ? '0' : '1');
      await check.click();
      await expect(feedback).toContainText(
        locale === 'fr' ? 'À revoir' : 'Try again',
      );
      await prediction.selectOption(result);
      await check.focus();
      await page.keyboard.press('Enter');
      await expect(feedback).toContainText(
        locale === 'fr' ? 'Bonne réponse' : 'Correct',
      );
    }
    await task.selectOption('failure');
    await a.selectOption('1');
    await b.selectOption('0');
    await check.click();
    await expect(feedback).toContainText('A ⇒ B = 0');
    await task.selectOption('converse');
    await check.click();
    await expect(feedback).toContainText('B ⇒ A = 1');
    await a.selectOption('0');
    await b.selectOption('1');
    await check.click();
    await expect(feedback).toContainText('B ⇒ A = 0');
    await lab.locator('[data-challenge-reset]').click();
    await expect(check).toBeDisabled();
    await expect(feedback).toBeEmpty();
    await page.emulateMedia({ media: 'print' });
    await expect(lab.locator('fieldset')).toBeHidden();
    await expect(lab.locator('[data-challenge-static]')).toBeVisible();
    await expect(page.locator('.implication-revision')).toBeVisible();
    await expect(page.locator('.katex-error')).toHaveCount(0);
  });

  test(`L05 diagrams and static challenge fit without JS (${locale})`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 900 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L05/`);
      await expect(page.locator('[data-challenge-static]')).toBeVisible();
      const figures = page.locator('.lesson-prose img');
      await expect(figures).toHaveCount(3);
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
