import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en'] as const) {
  test(`L08 builds minterms and validates every stage (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L08/`);
    await expect(page.locator('.lesson-prose h2')).toHaveCount(6);
    const lab = page.locator('[data-normal-lab]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset')).toBeVisible();
    const check = lab.locator('[data-normal-check]');
    const feedback = lab.locator('[data-normal-feedback]');
    await check.click();
    await expect(feedback).toContainText('010');
    await lab.locator('[data-normal-row="2"]').check();
    await lab.locator('[data-normal-row="6"]').check();
    await check.click();
    await expect(lab.locator('[data-normal-stage="1"]')).toBeVisible();
    await check.click();
    await expect(feedback).toContainText('x');
    for (const bits of ['010', '110']) {
      for (const [i, bit] of [...bits].entries()) {
        await lab.locator(`[data-normal-sign="${i}"]`).selectOption(bit);
      }
      await check.click();
    }
    for (const stage of [2, 3, 4]) {
      await expect(lab.locator(`[data-normal-stage="${stage}"]`)).toBeVisible();
      await lab.locator('[data-normal-choice="1"]').check();
      await check.click();
      await expect(feedback).toContainText(
        locale === 'fr' ? 'Contre-exemple' : 'Counterexample',
      );
      await lab.locator('[data-normal-choice="0"]').check();
      await check.focus();
      await page.keyboard.press('Enter');
    }
    await expect(lab.locator('[data-normal-result]')).toBeVisible();
    await expect(lab.locator('[data-normal-result]')).not.toContainText('∧');
    await lab.locator('[data-normal-example]').selectOption('2');
    await check.click();
    await expect(lab.locator('[data-normal-stage="2"]')).toBeVisible();
    for (const stage of [2, 3, 4]) {
      await expect(lab.locator(`[data-normal-stage="${stage}"]`)).toBeVisible();
      await lab.locator('[data-normal-choice="0"]').check();
      await check.click();
    }
    await expect(lab.locator('[data-normal-result]')).toBeVisible();
    await lab.locator('[data-normal-reset]').click();
    await expect(lab.locator('[data-normal-stage="0"]')).toBeVisible();
    await page.emulateMedia({ media: 'print' });
    await expect(lab.locator('fieldset')).toBeHidden();
    await expect(lab.locator('[data-normal-static]')).toBeVisible();
    await expect(page.locator('.l08-revision')).toBeVisible();
  });

  test(`L08 diagrams and fixed example without JavaScript (${locale})`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 900 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L08/`);
      await expect(page.locator('[data-normal-static]')).toBeVisible();
      const diagrams = page.locator('.lesson-prose img');
      await expect(diagrams).toHaveCount(2);
      for (const diagram of await diagrams.all()) {
        await expect(diagram).toHaveAttribute('alt', /.+/);
        await expect
          .poll(() =>
            diagram.evaluate((img) => (img as HTMLImageElement).naturalWidth),
          )
          .toBeGreaterThan(0);
      }
      await expect(page.locator('.katex-error')).toHaveCount(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
    } finally {
      await context.close();
    }
  });
}
