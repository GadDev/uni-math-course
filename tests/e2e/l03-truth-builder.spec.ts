import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en'] as const) {
  test(`L03 builds and corrects columns (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/lessons/L03/`);
    await expect(page.locator('.lesson-prose h2')).toHaveCount(6);
    const lab = page.locator('[data-truth-builder]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset')).toBeVisible();
    const check = lab.locator('[data-truth-check]');
    const feedback = lab.locator('[data-truth-feedback]');
    await check.click();
    await expect(feedback).toContainText(
      locale === 'fr' ? 'cellule vide' : 'empty cell',
    );
    await lab.locator('[data-truth-cell="0"]').selectOption('0');
    await check.click();
    await expect(feedback).toContainText(
      locale === 'fr' ? 'valeur incorrecte' : 'incorrect value',
    );
    await expect(lab.locator('[data-truth-cell="0"]')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await expect(lab.locator('[data-truth-progress]')).toContainText('0/3');
    for (const [i, column] of ['1100', '1101', '0001'].entries()) {
      if (i === 1) {
        await lab.locator('[data-truth-cell="0"]').selectOption('0');
        await check.click();
        await expect(feedback).toContainText(
          locale === 'fr' ? 'Ligne 00' : 'Row 00',
        );
        await expect(feedback).toContainText('B = 0');
        await expect(feedback).toContainText('¬A = 1');
        await expect(lab.locator('[data-truth-progress]')).toContainText(
          '1/3',
        );
      }
      for (const [row, value] of [...column].entries()) {
        await lab.locator(`[data-truth-cell="${row}"]`).selectOption(value);
      }
      await check.click();
      await expect(lab.locator('[data-truth-progress]')).toContainText(
        `${i + 1}/3`,
      );
    }
    await expect(check).toBeDisabled();
    await expect(lab.locator('[data-truth-cell]')).toHaveCount(0);
    await lab.locator('[data-truth-example]').selectOption('2');
    await expect(lab.locator('[data-truth-cell]')).toHaveCount(8);
    for (const [i, column] of [
      '11001100',
      '11001111',
      '01110111',
      '01000111',
    ].entries()) {
      for (const [row, value] of [...column].entries()) {
        await lab.locator(`[data-truth-cell="${row}"]`).selectOption(value);
      }
      await check.click();
      await expect(lab.locator('[data-truth-progress]')).toContainText(
        `${i + 1}/4`,
      );
    }
    await lab.locator('[data-truth-reset]').click();
    await expect(lab.locator('[data-truth-cell]')).toHaveCount(8);
    await expect(feedback).toBeEmpty();
    await page.emulateMedia({ media: 'print' });
    await expect(lab.locator('fieldset')).not.toBeVisible();
    await expect(page.locator('.truth-builder-revision')).toBeVisible();
    await expect(page.locator('.katex-error')).toHaveCount(0);
  });

  test(`L03 no-JS fallback (${locale})`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L03/`);
      await expect(page.locator('[data-truth-static]')).toBeVisible();
      await expect(
        page.locator('[data-truth-builder] fieldset'),
      ).not.toBeVisible();
    } finally {
      await context.close();
    }
  });
}
