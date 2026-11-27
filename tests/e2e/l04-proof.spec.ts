import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en'] as const) {
  test(`L04 proof checks formula and law separately (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L04/`);
    await expect(page.locator('.lesson-prose h2')).toHaveCount(6);
    const lab = page.locator('[data-boolean-proof]');
    await lab.scrollIntoViewIfNeeded();
    const law = lab.locator('[data-proof-law]');
    const line = lab.locator('[data-proof-line]');
    const check = lab.locator('[data-proof-check]');
    const feedback = lab.locator('[data-proof-feedback]');
    await law.selectOption('double');
    await line.selectOption('right');
    await check.click();
    await expect(feedback).toContainText(
      locale === 'fr' ? 'pas la loi' : 'not the law',
    );
    await line.selectOption('wrong');
    await check.click();
    await expect(feedback).toContainText('≠');
    await expect(lab.locator('[data-proof-progress]')).toHaveText('0/2');
    for (const value of ['morgan', 'double']) {
      await law.selectOption(value);
      await line.selectOption('right');
      await check.click();
    }
    await expect(lab.locator('[data-proof-complete]')).toBeVisible();
    await lab.locator('[data-proof-example]').selectOption('1');
    for (const value of [
      'commute',
      'distribute',
      'excluded',
      'identity',
      'commute',
    ]) {
      await law.selectOption(value);
      await line.selectOption('right');
      await check.click();
    }
    await expect(lab.locator('[data-proof-progress]')).toHaveText('5/5');
    await lab.locator('[data-proof-reset]').click();
    await expect(lab.locator('[data-proof-progress]')).toHaveText('0/5');
    await page.emulateMedia({ media: 'print' });
    await expect(lab.locator('.l04-proof-screen')).not.toBeVisible();
    await expect(lab.locator('[data-proof-static]')).toBeVisible();
  });
}
