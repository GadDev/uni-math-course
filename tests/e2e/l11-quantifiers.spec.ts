import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en'] as const) {
  test(`L11 quantifier laboratory evidence (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/lessons/L11/`);
    const lab = page.locator('[data-quantifier-lab]');
    await lab.scrollIntoViewIfNeeded();
    const domain = lab.locator('[data-domain]');
    const all = lab.locator('[data-quantifier="all"]');
    const some = lab.locator('[data-quantifier="some"]');
    const witness = lab.locator('[data-evidence="witness"]');
    const counter = lab.locator('[data-evidence="counterexample"]');
    const yes = locale === 'fr' ? 'Vrai' : 'True';
    const no = locale === 'fr' ? 'Faux' : 'False';
    const check = locale === 'fr' ? 'Vérifier' : 'Check';
    const correct = locale === 'fr' ? 'Bonne réponse' : 'Correct';
    await expect(domain).toHaveText('X = {1, 2, 4}');
    await lab.getByRole('button', { name: locale === 'fr' ? 'Tester 1' : 'Test 1', exact: true }).click();
    await expect(lab.locator('tbody tr').first()).toContainText(no);
    await all.getByRole('button', { name: no, exact: true }).click();
    await some.getByRole('button', { name: yes, exact: true }).click();
    await expect(all.getByRole('status')).toContainText(correct);
    await expect(some.getByRole('status')).toContainText(correct);
    await witness.locator('select').selectOption('6');
    await witness.getByRole('button', { name: check }).click();
    await expect(witness.getByRole('status')).toContainText(
      locale === 'fr' ? 'Hors du domaine' : 'Outside the domain',
    );
    await witness.locator('select').selectOption('2');
    await witness.getByRole('button', { name: check }).click();
    await expect(witness.getByRole('status')).toContainText(correct);
    await counter.locator('select').selectOption('1');
    await counter.getByRole('button', { name: check }).click();
    await expect(counter.getByRole('status')).toContainText(correct);
    await lab.getByRole('checkbox', { name: '1', exact: true }).uncheck();
    await expect(domain).toHaveText('X = {2, 4}');
    await expect(all.getByRole('status')).toBeEmpty();
    await expect(witness.locator('select')).toHaveValue('');
    await all.getByRole('button', { name: yes, exact: true }).click();
    await expect(all.getByRole('status')).toContainText(correct);
    await lab.getByRole('button', { name: locale === 'fr' ? 'Vider X' : 'Empty X' }).click();
    await expect(domain).toHaveText('X = ∅');
    await all.getByRole('button', { name: yes, exact: true }).click();
    await some.getByRole('button', { name: no, exact: true }).click();
    await expect(all.getByRole('status')).toContainText(correct);
    await expect(some.getByRole('status')).toContainText(correct);
    await witness.locator('select').selectOption('none');
    await witness.getByRole('button', { name: check }).click();
    await expect(witness.getByRole('status')).toContainText(correct);
    await counter.locator('select').selectOption('none');
    await counter.getByRole('button', { name: check }).click();
    await expect(counter.getByRole('status')).toContainText(correct);
    await lab.getByRole('button', { name: locale === 'fr' ? 'Réinitialiser' : 'Reset' }).click();
    await expect(domain).toHaveText('X = {1, 2, 4}');
    await lab.locator('select').first().selectOption('greater');
    await expect(all.getByRole('status')).toBeEmpty();
    await page.emulateMedia({ media: 'print' });
    await expect(lab.locator('.l11-static')).toBeVisible();
    await expect(lab.locator('.l11-live')).not.toBeVisible();
  });
}
