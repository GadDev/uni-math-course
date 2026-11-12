import { test, expect, type Page } from '@playwright/test';

async function lab(page: Page, n: number, locale = 'fr') {
  await page.goto(`/${locale}/lessons/L${n}/`);
  const panel = page.locator('[data-theory-lab]');
  await panel.scrollIntoViewIfNeeded();
  await expect(panel.locator('fieldset')).toBeVisible();
  return panel;
}
for (const locale of ['fr', 'en']) {
  test(`${locale}: expanded chapter links, mobile formulas, labelled controls and paired anchors`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(`/${locale}/chapters/C04/`);
    for (let n = 50; n <= 54; n++)
      await expect(
        page.locator(`a[href="/${locale}/lessons/L${n}/"]`).first(),
      ).toBeVisible();
    for (let n = 50; n <= 54; n++) {
      const panel = await lab(page, n, locale);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('.katex-error')).toHaveCount(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
      expect(
        await panel
          .locator('input,select')
          .evaluateAll((nodes) =>
            nodes.every((n) => (n as HTMLInputElement).labels?.length),
          ),
      ).toBe(true);
      const button = panel.locator('[data-reset]');
      await button.focus();
      await expect(button).toBeFocused();
      await page.keyboard.press('Enter');
      expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      const anchor = await page
        .locator('.lesson-prose h2')
        .first()
        .getAttribute('id');
      await page.goto(`/${locale}/lessons/L${n}/#${anchor}`);
      await page.locator('[data-language-link]').click();
      await expect(page).toHaveURL(
        new RegExp(`/${locale === 'fr' ? 'en' : 'fr'}/lessons/L${n}/#`),
      );
    }
  });
  test(`${locale}: paper reference, complete printed corrections and no-JavaScript reading`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
      for (let n = 50; n <= 54; n++) {
        await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L${n}/`);
        const panel = page.locator('[data-theory-lab]');
        await expect(panel.locator('fieldset')).toBeHidden();
        await expect(panel.locator('.theory-results table')).toBeVisible();
        await page.emulateMedia({ media: 'print' });
        await expect(page.locator('.site-header')).toBeHidden();
        const solution = page.locator('.info-answer');
        expect(
          await solution.evaluateAll((nodes) =>
            nodes.every((n) => {
              const r = document.createRange();
              r.selectNodeContents(n.lastElementChild!);
              return r.getBoundingClientRect().height > 0;
            }),
          ),
        ).toBe(true);
        await expect(panel.locator('fieldset')).toBeHidden();
        await page.emulateMedia({ media: 'screen' });
      }
    } finally {
      await context.close();
    }
  });
}
test('decision tree compares expected costs and responds to keyboard strategy changes', async ({
  page,
}) => {
  const panel = await lab(page, 50);
  await expect(panel.locator('output')).toContainText('L = 1,5');
  await panel.getByLabel('Stratégie').selectOption('balanced');
  await expect(panel.locator('output')).toContainText('L = 1,75');
  await panel.getByLabel('Source', { exact: true }).selectOption('die');
  await panel.getByLabel('Stratégie').selectOption('huffman');
  await expect(panel.locator('tbody tr')).toHaveCount(6);
  await expect(panel.locator('output')).toContainText('2,66667');
  await expect(panel.locator('svg')).toHaveAccessibleName(/Arbre de questions/);
});
test('Kraft rejects impossible lengths, validates input and distinguishes an ambiguous assignment', async ({
  page,
}) => {
  const panel = await lab(page, 51);
  await expect(panel.locator('output')).toHaveText('K = 1/1 = 1');
  for (const input of await panel.locator('input').all()) await input.fill('1');
  await expect(panel.locator('output')).toContainText('K = 2/1 = 2');
  await expect(panel).toContainText('aucun code binaire à décodage unique');
  await panel.locator('input').first().fill('0');
  await expect(panel.getByRole('alert')).toBeVisible();
  await panel.locator('[data-reset]').click();
  await expect(panel.locator('tbody tr')).toHaveCount(4);
  await expect(panel).toContainText('010 code AC et BA');
});
test('Gibbs equality and entropy-bound slack remain distinct', async ({
  page,
}) => {
  let panel = await lab(page, 52);
  await expect(panel.locator('output')).not.toHaveText(/écart = 0$/);
  await panel.getByRole('button', { name: 'Utiliser q = p' }).click();
  await expect(panel.locator('output')).toContainText('écart = 0');
  panel = await lab(page, 53);
  await expect(panel.locator('output')).toHaveText(
    'H = 1,5 ≤ L + log₂ K = 1,5 ≤ L = 1,5',
  );
  const inputs = panel.locator('input');
  await inputs.nth(3).fill('2');
  await inputs.nth(4).fill('3');
  await inputs.nth(5).fill('3');
  await expect(panel.locator('output')).toHaveText(
    'H = 1,5 ≤ L + log₂ K = 1,5 ≤ L = 2,5',
  );
  await inputs.nth(3).fill('1');
  await inputs.nth(4).fill('1');
  await inputs.nth(5).fill('1');
  await expect(panel).toContainText('La chaîne de la preuve ne s’applique pas');
});
test('block coding updates both units, animates manual merges, and respects reduced motion and print', async ({
  page,
}) => {
  const panel = await lab(page, 54);
  await expect(panel.locator('.theory-state > p output').first()).toContainText(
    'Lₙ/n = 0,94444',
  );
  const results = panel.locator('.theory-state');
  expect(
    await results.evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('theory-reveal');
  await panel.locator('[data-merge]').focus();
  await page.keyboard.press('Enter');
  await expect(panel.locator('.theory-merge')).toHaveCount(1);
  await expect(panel.locator('.theory-merge')).toHaveText('1 + 2 = 3');
  await panel.getByLabel('Symboles par bloc n').selectOption('3');
  await expect(panel.locator('tbody tr')).toHaveCount(8);
  await expect(panel.locator('.theory-merge')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await results.evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  await page.emulateMedia({ media: 'print' });
  await expect(panel.locator('fieldset')).toBeHidden();
  await expect(panel.locator('.theory-print-merges')).toBeVisible();
});
test('exam preparation discloses the new-topic coverage gap and new glossary symbols are searchable', async ({
  page,
}) => {
  await page.goto('/fr/training-exams/final/');
  await expect(page.locator('.exam-coverage-note')).toContainText(
    'n’évalue pas encore',
  );
  await page.goto('/fr/glossary/?q=Kraft&category=information#E70');
  await expect(page.locator('#E70')).toBeVisible();
  await expect(page.locator('#E70')).toContainText('45');
});
