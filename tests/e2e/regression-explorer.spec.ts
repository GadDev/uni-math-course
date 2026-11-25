import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`${locale}: regression anchors then minimises loss`, async ({
    page,
  }) => {
    const fr = locale === 'fr';
    await page.goto(`/${locale}/lessons/L35/`);
    const lab = page.locator('[data-regression-explorer]');
    const live = lab.locator('.geo-live');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset')).toBeVisible();
    await expect(live.locator('[data-regression-loss]')).toContainText('S ≈ 1');
    await lab
      .getByRole('button', { name: /Choisir le meilleur p|Choose best p/ })
      .click();
    await expect(live.locator('[data-regression-loss]')).toContainText(
      fr ? 'S ≈ 0,6667' : 'S ≈ 0.6667',
    );
    await expect(live.locator('[data-regression-mean]')).toContainText(
      fr ? 'La droite passe par G.' : 'The line passes through G.',
    );
    await lab.locator('input[type="number"]').first().fill('0');
    await expect(live.locator('[data-regression-loss]')).toContainText(
      fr ? 'S ≈ 0,6667' : 'S ≈ 0.6667',
    );
    await lab
      .getByRole('button', {
        name: /Afficher la droite optimale|Show the optimal line/,
      })
      .click();
    await expect(live.locator('[data-regression-loss]')).toContainText(
      fr ? 'S ≈ 0,1667' : 'S ≈ 0.1667',
    );
    await expect(live.locator('[data-regression-gap]')).toContainText('≈ 0');
    await lab.getByRole('button', { name: /Réinitialiser|Reset/ }).click();
    await expect(live.locator('[data-regression-loss]')).toContainText('S ≈ 1');
    await expect(page.locator('.katex-error')).toHaveCount(0);
    await page.setViewportSize({ width: 320, height: 740 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
    await page.emulateMedia({ media: 'print' });
    await expect(lab.locator('.geo-live')).toBeHidden();
    await expect(lab.locator('.geo-print')).toBeVisible();
  });
}
