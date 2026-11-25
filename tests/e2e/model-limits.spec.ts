import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`${locale}: L36 correlation domains, outliers and extrapolation`, async ({
    page,
  }) => {
    const fr = locale === 'fr';
    await page.goto(`/${locale}/lessons/L36/`);
    const lab = page.locator('[data-model-limits]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset').first()).toBeVisible();
    const selector = lab.locator('select');
    const r = lab.locator('.geo-live [data-correlation-value]');
    const fit = lab.locator('.geo-live [data-correlation-fit]');
    await expect(r).toHaveText(fr ? 'r ≈ 0,866' : 'r ≈ 0.866');
    await selector.selectOption('negative');
    await expect(r).toHaveText('r ≈ -1');
    await selector.selectOption('curve');
    await expect(r).toHaveText('r ≈ 0');
    await selector.selectOption('constantX');
    await expect(r).toHaveText(fr ? 'r indéfini' : 'r undefined');
    await expect(fit).toContainText(
      fr ? 'Pente non unique' : 'Slope not unique',
    );
    await selector.selectOption('constantY');
    await expect(r).toHaveText(fr ? 'r indéfini' : 'r undefined');
    await expect(fit).toContainText('m ≈ 0');
    await selector.selectOption('outlier');
    await expect(r).toHaveText('r ≈ 1');
    await lab.getByRole('checkbox').check();
    await expect(fit).toContainText(fr ? 'm ≈ 0,1429' : 'm ≈ 0.1429');
    await lab.getByRole('checkbox').uncheck();
    await expect(r).toHaveText('r ≈ 1');
    await lab.getByRole('button', { name: '2017' }).click();
    await expect(
      lab.locator('.geo-live [data-extrapolation-result]'),
    ).toContainText(fr ? '-0,245' : '-0.245');
    await expect(
      lab.locator('.geo-live [data-extrapolation-impossible]'),
    ).toBeVisible();
    await lab
      .getByRole('button', { name: /Réinitialiser l’année|Reset year/ })
      .click();
    await expect(
      lab.locator('.geo-live [data-extrapolation-impossible]'),
    ).toHaveCount(0);
    await expect(page.locator('.katex-error')).toHaveCount(0);
    await page.emulateMedia({ media: 'print' });
    await expect(lab.locator('.geo-print')).toBeVisible();
    await expect(lab.locator('.geo-live').first()).toBeHidden();
  });
}
