import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`${locale}: L22 recognises factorisation methods and resets feedback`, async ({
    page,
  }) => {
    const fr = locale === 'fr';
    await page.goto(`/${locale}/lessons/L22/`);
    await expect(
      page.locator('.algebra-study h2').filter({ hasText: /^[1-6]\. / }),
    ).toHaveCount(6);
    const lab = page.locator('[data-method-lab="factor"] .method-live');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset')).toBeVisible();
    const feedback = lab.locator('[data-factor-feedback]');
    const common = lab.getByRole('button', {
      name: fr ? 'Facteur commun' : 'Common factor',
      exact: true,
    });
    const difference = lab.getByRole('button', {
      name: fr ? 'Différence de carrés' : 'Difference of squares',
      exact: true,
    });
    await difference.click();
    await expect(feedback).toContainText(fr ? 'Réessayez' : 'Try again');
    await common.click();
    await expect(feedback).toContainText(
      fr ? 'Bonne méthode' : 'Correct method',
    );
    await lab.getByRole('combobox').selectOption('1');
    await expect(common).toHaveAttribute('aria-pressed', 'false');
    await difference.click();
    await expect(feedback).toContainText(
      fr ? 'Bonne méthode' : 'Correct method',
    );
    await lab.getByRole('combobox').selectOption('2');
    await lab
      .getByRole('button', {
        name: fr ? 'Carré parfait' : 'Perfect square',
        exact: true,
      })
      .click();
    await expect(feedback).toContainText(
      fr ? 'Bonne méthode' : 'Correct method',
    );
    await lab
      .getByRole('button', {
        name: fr ? 'Réinitialiser' : 'Reset',
        exact: true,
      })
      .click();
    await expect(feedback).toContainText(fr ? 'Choisissez' : 'Choose');
    await expect(page.locator('.katex-error')).toHaveCount(0);
  });
}
