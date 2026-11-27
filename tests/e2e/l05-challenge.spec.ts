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
  });
}
