import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en'] as const) {
  test(`L09 explores both Russell cases independently (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L09/`);
    const lab = page.locator('[data-russell-workshop]');
    await lab.scrollIntoViewIfNeeded();
    const assumptions = lab.locator('fieldset').first();
    await expect(assumptions).toBeVisible();
    const status = lab.getByRole('status');
    await expect(status).toContainText('0/2');
    await assumptions.getByRole('button', { name: 'E ∈ E', exact: true }).click();
    const predictions = lab.locator('fieldset').nth(1);
    await predictions.getByRole('button', { name: 'E ∈ E', exact: true }).click();
    await expect(status).toContainText('0/2');
    await expect(status).toContainText(locale === 'fr' ? 'Réessayez' : 'Try again');
    await predictions.getByRole('button', { name: 'E ∉ E', exact: true }).click();
    await expect(status).toContainText('1/2');
    await expect(status).toContainText('E ∈ E ⇒ E ∉ E');
    await assumptions.getByRole('button', { name: 'E ∉ E', exact: true }).click();
    const second = predictions.getByRole('button', { name: 'E ∈ E', exact: true });
    await second.focus();
    await page.keyboard.press('Enter');
    await expect(status).toContainText('2/2');
    await expect(status).toContainText('E ∉ E ⇒ E ∈ E');
    await lab.getByRole('button', { name: locale === 'fr' ? 'Réinitialiser' : 'Reset' }).click();
    await expect(status).toContainText('0/2');
    await expect(predictions).toHaveCount(0);
    await page.emulateMedia({ media: 'print' });
    await expect(lab.locator('.l09-static')).toBeVisible();
    await expect(assumptions).not.toBeVisible();
  });
}
