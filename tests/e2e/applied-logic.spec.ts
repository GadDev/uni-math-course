import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en'] as const) {
  test(`applied logic workshops (${locale})`, async ({ page }) => {
    const yes = locale === 'fr' ? 'Vrai' : 'True';
    const no = locale === 'fr' ? 'Faux' : 'False';
    const correct = locale === 'fr' ? 'Bonne réponse' : 'Correct';

    await page.goto(`/${locale}/lessons/L17/`);
    let lab = page.locator('[data-applied-lab="relation"]');
    await lab.scrollIntoViewIfNeeded();
    await lab.getByRole('button', { name: 'cleo, math', exact: true }).click();
    await lab
      .locator('fieldset')
      .first()
      .getByRole('button', { name: yes, exact: true })
      .click();
    await expect(
      lab.locator('fieldset').first().getByRole('status'),
    ).toContainText(correct);
    await lab
      .locator('fieldset')
      .nth(1)
      .getByRole('button', { name: no, exact: true })
      .click();
    await expect(
      lab.locator('fieldset').nth(1).getByRole('status'),
    ).toContainText(correct);

    await page.goto(`/${locale}/lessons/L18/`);
    lab = page.locator('[data-applied-lab="sql"]');
    await lab.scrollIntoViewIfNeeded();
    await lab
      .getByRole('button', {
        name:
          locale === 'fr' ? 'Afficher / masquer la trace' : 'Show / hide trace',
      })
      .click();
    await expect(
      lab.locator('[data-sql-result]').getByRole('status'),
    ).toContainText('{ana, ben}');
    await lab.locator('select').selectOption('none');
    await lab
      .getByRole('button', {
        name:
          locale === 'fr' ? 'Afficher / masquer la trace' : 'Show / hide trace',
      })
      .click();
    await expect(
      lab.locator('[data-sql-result]').getByRole('status'),
    ).toContainText('{cleo}');

    await page.goto(`/${locale}/lessons/L19/`);
    lab = page.locator('[data-applied-lab="python"]');
    await lab.scrollIntoViewIfNeeded();
    const trace = lab.locator('[data-python-trace]');
    const next = trace.getByRole('button', {
      name: locale === 'fr' ? 'Étape suivante' : 'Next step',
    });
    await next.click();
    await next.click();
    await expect(next).toBeDisabled();
    await expect(trace.getByRole('status')).toContainText('False');
    await lab.locator('select').selectOption('0');
    await expect(trace.getByRole('status')).toContainText('True');
    await expect(next).toBeDisabled();

    await page.goto(`/${locale}/lessons/L20/`);
    lab = page.locator('[data-applied-lab="access"]');
    await lab.scrollIntoViewIfNeeded();
    await lab
      .locator('fieldset')
      .nth(1)
      .getByRole('button', { name: no, exact: true })
      .click();
    await expect(
      lab.locator('fieldset').nth(1).getByRole('status'),
    ).toContainText('(ben, f2)');
    await lab.getByRole('button', { name: 'ben, f2', exact: true }).click();
    await lab
      .locator('fieldset')
      .nth(1)
      .getByRole('button', { name: yes, exact: true })
      .click();
    await expect(
      lab.locator('fieldset').nth(1).getByRole('status'),
    ).toContainText(correct);
    await page.emulateMedia({ media: 'print' });
    await expect(lab.locator('.applied-static')).toBeVisible();
  });
}
