import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en'] as const) {
  test(`L10 distinguishes membership and inclusion (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L10/`);
    const lab = page.locator('[data-set-explorer]');
    await lab.scrollIntoViewIfNeeded();
    const selects = lab.locator('select');
    const member = lab.locator('[data-member-feedback]');
    const subset = lab.locator('[data-subset-feedback]');
    const yes = locale === 'fr' ? 'Vrai' : 'True';
    const no = locale === 'fr' ? 'Faux' : 'False';
    await expect(selects.first()).toBeVisible();
    await lab
      .locator('fieldset')
      .first()
      .getByRole('button', { name: yes, exact: true })
      .click();
    await expect(member).toContainText('{1} ∉ A');
    await lab
      .locator('fieldset')
      .nth(1)
      .getByRole('button', { name: yes, exact: true })
      .click();
    await expect(subset).toContainText('{1} ⊆ A');
    await selects.first().selectOption('1');
    await selects.nth(1).selectOption('4');
    await expect(member).toBeEmpty();
    await expect(subset).toBeEmpty();
    await lab
      .locator('fieldset')
      .first()
      .getByRole('button', { name: yes, exact: true })
      .click();
    await lab
      .locator('fieldset')
      .nth(1)
      .getByRole('button', { name: yes, exact: true })
      .click();
    await expect(member).toContainText('{0} ∈ A');
    await expect(subset).toContainText('{0} ⊆ A');
    await selects.first().selectOption('4');
    await selects.nth(1).selectOption('3');
    await lab
      .locator('fieldset')
      .first()
      .getByRole('button', { name: no, exact: true })
      .click();
    await lab
      .locator('fieldset')
      .nth(1)
      .getByRole('button', { name: yes, exact: true })
      .click();
    await expect(member).toContainText('∅ ∉ A');
    await expect(subset).toContainText('∅ ⊆ A');
    await selects.nth(1).selectOption('0');
    await expect(lab.locator('[data-not-applicable]')).toBeVisible();
    await expect(subset).toHaveCount(0);
    await lab
      .getByRole('button', {
        name: locale === 'fr' ? 'Réinitialiser' : 'Reset',
      })
      .click();
    await expect(selects.first()).toHaveValue('0');
    await expect(selects.nth(1)).toHaveValue('5');
    await expect(member).toBeEmpty();
    await page.emulateMedia({ media: 'print' });
    await expect(lab.locator('.l10-static')).toBeVisible();
    await expect(selects.first()).not.toBeVisible();
  });
}
