import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(crypto, 'randomUUID', { value: () => 'abc123' });
  });
});

test('French mobile session advances to completion and retries only the missed item', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/fr/logic-workshop/');
  await expect(
    page.getByRole('heading', { name: 'Atelier de logique propositionnelle.' }),
  ).toBeVisible();
  await page.getByLabel('Thème', { exact: true }).selectOption('implication');
  await page.getByLabel('Niveau', { exact: true }).selectOption('challenge');
  await page.getByRole('button', { name: 'Démarrer une série' }).press('Enter');
  await expect(page.getByText('Question 1 / 3')).toBeVisible();

  const formula = page.getByLabel('Votre formule', { exact: true });
  await formula.fill('C -> (A & B)');
  await formula.press('Enter');
  await expect(
    page.getByRole('status').getByText(/ne traduit pas/),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Afficher la solution' }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Voir un indice' }).press('Enter');
  await expect(
    page.getByRole('button', { name: 'Afficher la solution' }),
  ).toBeVisible();
  await formula.fill('C <-> (A & B)');
  await formula.press('Enter');
  await expect(
    page.getByRole('button', { name: 'Question suivante' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');

  await page.getByRole('radio', { name: '¬A ⇒ ¬B' }).press('Space');
  await page.getByRole('button', { name: 'Vérifier' }).press('Enter');
  await page.getByRole('button', { name: 'Question suivante' }).press('Enter');
  await expect(page.getByText('Question 3 / 3')).toBeVisible();

  await formula.fill('!(A <-> B)');
  await formula.press('Enter');
  const complete = page.getByRole('heading', { name: 'Série terminée !' });
  await expect(complete).toBeFocused();
  await expect(page.getByText('2 / 3', { exact: true })).toBeVisible();
  await expect(page.getByText('3 / 3', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Continuer avec une leçon/ }),
  ).toHaveAttribute('href', '/fr/lessons/L06/');
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(360);

  await page
    .getByRole('button', { name: 'Reprendre les questions à revoir' })
    .press('Enter');
  await expect(page.getByText('Question 1 / 1')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /le mot de passe correct/ }),
  ).toBeFocused();
});

test('English truth table retains input and exposes a downloadable A4 reference', async ({
  page,
}) => {
  await page.goto('/en/logic-workshop/');
  await expect(
    page.getByRole('heading', { name: 'Propositional logic workshop.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'FR', exact: true }),
  ).toHaveAttribute('href', '/fr/logic-workshop/');
  const downloadLink = page.getByRole('link', {
    name: 'Download the exam reference (French PDF)',
  });
  const downloadReady = page.waitForEvent('download');
  await downloadLink.click();
  const download = await downloadReady;
  expect(download.suggestedFilename()).toBe(
    'fiche-logique-propositionnelle-fr.pdf',
  );
  const reference = await page.request.get(
    (await downloadLink.getAttribute('href'))!,
  );
  expect(reference.headers()['content-type']).toContain('application/pdf');
  expect((await reference.body()).subarray(0, 4).toString()).toBe('%PDF');

  await page.getByLabel('Topic', { exact: true }).selectOption('truth');
  await page.getByLabel('Level', { exact: true }).selectOption('challenge');
  await page.getByRole('button', { name: 'Start a session' }).click();
  const firstCell = page.getByLabel('Row 1, value of the formula', {
    exact: true,
  });
  await expect(firstCell).toBeVisible();
  for (const cell of await page
    .getByLabel(/Row \d, value of the formula/)
    .all()) {
    await cell.selectOption('0');
  }
  await page.getByRole('button', { name: 'Check answer' }).click();
  const fifthCell = page.getByLabel('Row 5, value of the formula', {
    exact: true,
  });
  const seventhCell = page.getByLabel('Row 7, value of the formula', {
    exact: true,
  });
  await expect(seventhCell).toHaveAttribute('aria-invalid', 'true');
  await expect(seventhCell).toHaveValue('0');
  await expect(fifthCell).not.toHaveAttribute('aria-invalid', 'true');
  await seventhCell.selectOption('1');
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('Well done!')).toBeVisible();
  await page.getByText('Check with a truth table').click();
  await expect(page.getByRole('table').last()).toBeVisible();
});
