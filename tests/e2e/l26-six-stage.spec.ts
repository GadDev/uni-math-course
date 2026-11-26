import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`${locale}: L26 running totals and deviation measures`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L26/`);
    await expect(
      page.locator('.algebra-study h2').filter({ hasText: /^[1-6]\. / }),
    ).toHaveCount(6);
    const sigma = page.locator('[data-method-lab] .method-live');
    await sigma.scrollIntoViewIfNeeded();
    await expect(sigma.locator('fieldset')).toBeVisible();
    const trace = sigma.locator('[data-sigma-trace]');
    await expect(trace.locator('tbody tr')).toHaveCount(3);
    await expect(
      trace.locator('tbody tr').last().locator('td').last(),
    ).toHaveText('15');
    await sigma.getByRole('combobox').selectOption('1');
    await expect(
      trace.locator('tbody tr').first().locator('td').last(),
    ).toHaveText('5');
    await sigma.getByRole('slider').first().press('End');
    await expect(trace).toHaveCount(0);
    const mean = page.locator('.algebra-live');
    await mean.scrollIntoViewIfNeeded();
    await expect(mean.locator('fieldset')).toBeVisible();
    await expect(mean.locator('[data-absolute-deviations]')).toContainText('6');
    await expect(mean.locator('[data-squared-deviations]')).toContainText('18');
    await expect(mean.locator('[data-centered]')).toContainText('= 0');
    await mean.getByRole('slider').first().press('Home');
    await expect(mean.locator('[data-absolute-deviations]')).toContainText(
      '≈ 0',
    );
    await expect(mean.locator('[data-squared-deviations]')).toContainText(
      '≈ 0',
    );
    await expect(page.locator('.katex-error')).toHaveCount(0);
  });
}
