import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`${locale}: L25 compares methods and explains all system outcomes`, async ({
    page,
  }) => {
    const fr = locale === 'fr';
    await page.goto(`/${locale}/lessons/L25/`);
    await expect(
      page.locator('.algebra-study h2').filter({ hasText: /^[1-6]\. / }),
    ).toHaveCount(6);
    const methods = page.locator(
      '[data-method-lab="elimination"] .method-live',
    );
    await methods.scrollIntoViewIfNeeded();
    await expect(methods.locator('fieldset')).toBeVisible();
    const comparison = methods.locator('[data-system-comparison]');
    await comparison.locator('summary').click();
    await expect(comparison.locator('[data-comparison-result]')).toHaveText(
      '(x ; y) = (4 ; 3)',
    );
    await methods.getByRole('combobox').selectOption('1');
    await expect(comparison.locator('[data-comparison-result]')).toHaveText(
      '(x ; y) = (4 ; 3)',
    );
    await methods.getByRole('slider').first().press('Home');
    await expect(comparison.locator('[data-comparison-result]')).toHaveText(
      fr ? '(x ; y) = (0,5 ; -0,5)' : '(x ; y) = (0.5 ; -0.5)',
    );
    const graph = page.locator('.algebra-live');
    await graph.scrollIntoViewIfNeeded();
    await expect(graph.locator('fieldset')).toBeVisible();
    const reason = graph.locator('[data-system-reason]');
    await expect(reason).toContainText(
      fr ? 'Coefficient non nul' : 'Nonzero coefficient',
    );
    const m = graph.getByRole('slider').first();
    await m.press('Home');
    for (let i = 0; i < 3; i++) await m.press('ArrowRight');
    await expect(reason).toContainText('Contradiction');
    const b = graph.getByRole('slider').nth(1);
    await b.press('Home');
    for (let i = 0; i < 4; i++) await b.press('ArrowRight');
    await expect(reason).toContainText('0 = 0');
    await expect(page.locator('.katex-error')).toHaveCount(0);
  });
}
