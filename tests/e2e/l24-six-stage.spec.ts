import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`${locale}: L24 balance and inequality direction follow the controls`, async ({
    page,
  }) => {
    const fr = locale === 'fr';
    await page.goto(`/${locale}/lessons/L24/`);
    await expect(
      page.locator('.algebra-study h2').filter({ hasText: /^[1-6]\. / }),
    ).toHaveCount(6);
    const live = page.locator('[data-method-lab="equation"] .method-live');
    await live.scrollIntoViewIfNeeded();
    const balance = live.locator('[data-equation-balance]');
    await expect(balance).toContainText('3x + 5 = 11');
    const next = live.getByRole('button', {
      name: fr ? 'Étape suivante' : 'Next step',
    });
    await next.click();
    await expect(balance).toContainText('3x = 6');
    await next.click();
    await next.click();
    await expect(balance).toContainText('x = 2');
    const slider = live.getByRole('slider').first();
    await slider.press('Home');
    await expect(balance).toHaveCount(0);
    const inequality = page.locator('[data-algebra-lab="inequality"]');
    await inequality.scrollIntoViewIfNeeded();
    await expect(
      inequality.locator('[data-inequality-reason]:visible'),
    ).toContainText(fr ? 'Diviseur négatif' : 'Negative divisor');
    const a = inequality.getByRole('slider').first();
    await a.press('End');
    await expect(
      inequality.locator('[data-inequality-reason]:visible'),
    ).toContainText(fr ? 'Diviseur positif' : 'Positive divisor');
    for (let i = 0; i < 4; i++) await a.press('ArrowLeft');
    await expect(
      inequality.locator('[data-inequality-reason]:visible'),
    ).toContainText(fr ? 'Coefficient nul' : 'Zero coefficient');
    await expect(page.locator('.katex-error')).toHaveCount(0);
  });
}
