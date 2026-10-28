import { expect, test, type Locator } from '@playwright/test';
const routes = [
  [28, 'circle'],
  [31, 'triangle'],
  [32, 'rounding'],
  [34, 'centering'],
] as const;
const inputs = (lab: Locator) => lab.locator('input[type="number"]');
async function values(lab: Locator, values: number[]) {
  for (const [i, n] of values.entries())
    await inputs(lab).nth(i).fill(String(n));
}
for (const locale of ['fr', 'en'])
  for (const [lesson, kind] of routes)
    test(`${locale}: ${kind} links controls, graph, calculations and feedback`, async ({
      page,
    }) => {
      const fr = locale === 'fr',
        errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`/${locale}/lessons/L${lesson}/`);
      const lab = page.locator(`[data-geometry-lab="${kind}"]`),
        result = lab.locator('.geo-live [data-results]');
      await lab.scrollIntoViewIfNeeded();
      await expect(lab.locator('fieldset')).toBeVisible();
      const old = await result.textContent();
      await inputs(lab).first().fill('');
      await expect(inputs(lab).first()).toHaveAttribute('aria-invalid', 'true');
      await expect(result).toHaveText(old!);
      await lab.getByRole('button', { name: /Réinitialiser|Reset/ }).click();
      await lab.locator('input[type="range"]').first().focus();
      await page.keyboard.press('ArrowRight');
      expect(
        await lab
          .locator('input[type="range"]')
          .first()
          .evaluate((el) => getComputedStyle(el).outlineWidth),
      ).not.toBe('0px');
      await lab.getByRole('button', { name: /Réinitialiser|Reset/ }).click();
      if (kind === 'circle') {
        await inputs(lab).nth(2).fill('0');
        await values(lab, [2, -1, 0, 2, -1]);
        await expect(result).toContainText(
          fr ? 'se réduit au seul centre' : 'reduces to centre',
        );
        await expect(result).toContainText(fr ? 'P satisfait' : 'P satisfies');
        await values(lab, [2, -1, 3, 2, -1]);
        await expect(result).toContainText(
          fr ? 'intérieur du disque' : 'inside the disk',
        );
        await values(lab, [2, -1, 3, 5, -1]);
      }
      if (kind === 'triangle') {
        const before = await result
          .locator('[data-triangle-result]')
          .textContent();
        await lab.getByRole('button', { name: /Inverser B|Swap B/ }).click();
        await expect(result.locator('[data-triangle-result]')).toHaveText(
          before!,
        );
        await lab.getByRole('button', { name: /Réinitialiser|Reset/ }).click();
        await values(lab, [0, 0, 3, 2]);
        await expect(result).toContainText(fr ? 'exclu' : 'excluded');
        await inputs(lab).nth(2).fill('4');
        await inputs(lab).nth(3).fill('0');
        await expect(result).toContainText(
          fr ? 'trois contraintes' : 'all three constraints',
        );
        await lab.locator('select').selectOption('2');
        await inputs(lab).nth(0).fill('2');
        await inputs(lab).nth(1).fill('0');
        await expect(result).toContainText(fr ? 'dégénéré' : 'degenerate');
        await expect(lab.locator('.geo-live .geo-region')).toHaveCount(0);
      }
      if (kind === 'rounding') {
        await values(lab, [2.3, 0, 2, 2]);
        await expect(result).toContainText(
          fr
            ? 'position continue était pourtant'
            : 'continuous position was inside',
        );
        await expect(result).toContainText(
          fr ? 'Indice arrondi hors image' : 'Rounded index outside',
        );
        await values(lab, [0.25, 0.25, 2, 2]);
        await expect(result.locator('[data-quantization]')).toContainText(
          '(5 ; 4)',
        );
        await values(lab, [0.12, 0.12, 2, 2]);
        await expect(result).toContainText(
          fr ? 'Même indice pour deux points' : 'Same index for two',
        );
        await expect(result.locator('[data-roundtrip]')).toContainText(
          '(0 ; 0)',
        );
      }
      if (kind === 'centering') {
        await expect(lab.locator('.geo-live tbody tr')).toHaveCount(3);
        const table = lab.locator('.geo-live .geo-table');
        await table.focus();
        await page.keyboard.press('ArrowRight');
        await expect(table).toBeFocused();
        await lab
          .getByRole('button', {
            name: /Afficher les coordonnées centrées|Show centred/,
          })
          .click();
        await expect(result).toContainText(fr ? 'Vue centrée' : 'Centred view');
        await lab.getByRole('button', { name: /Essayer Sxx|Try Sxx/ }).click();
        await expect(result).toContainText(
          fr ? 'Toutes les abscisses' : 'All horizontal',
        );
        await lab
          .getByRole('button', { name: /Essayer Sxy|Try negative/ })
          .click();
        await expect(result.locator('[data-centered-products]')).toContainText(
          'Sxy ≈ -2',
        );
        await expect(result.locator('[data-centered-sums]')).toContainText(
          '≈ 0',
        );
      }
      await lab
        .getByRole('button', { name: /Vérifier le défi|Check challenge/ })
        .click();
      await expect(lab.locator('[data-feedback]')).toContainText(
        fr ? 'Défi réussi' : 'Challenge complete',
      );
      await lab.getByRole('button', { name: /Réinitialiser|Reset/ }).click();
      await expect(lab.locator('[data-feedback]')).toBeEmpty();
      expect(errors).toEqual([]);
    });
for (const locale of ['fr', 'en'])
  test(`${locale}: slope increments, guided elimination and hidden Bresenham answer`, async ({
    page,
  }) => {
    const fr = locale === 'fr';
    await page.goto(`/${locale}/lessons/L29/`);
    let lab = page.locator('[data-geometry-lab="slope"]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset')).toBeVisible();
    await inputs(lab).nth(2).fill('-2');
    await expect(lab.locator('.geo-live [data-results]')).toContainText(
      'Δx = -2',
    );
    await expect(lab.locator('.geo-live [data-results]')).toContainText(
      'Δy = -4',
    );
    await inputs(lab).nth(2).fill('0');
    await expect(lab.locator('.geo-live [data-results]')).toContainText(
      fr ? '0/0 est indéfini' : '0/0 is undefined',
    );
    await expect(lab.locator('.geo-live [data-results]')).not.toContainText(
      /NaN|Infinity/,
    );
    await page.goto(`/${locale}/lessons/L30/`);
    lab = page.locator('[data-geometry-lab="intersection"]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset')).toBeVisible();
    const solution = lab.locator('.geo-live [data-solution]');
    await expect(solution).toBeHidden();
    await lab
      .getByRole('button', { name: /Étape suivante|Next step/, exact: true })
      .click();
    await expect(lab.locator('.geo-live [data-equating]')).toBeVisible();
    await expect(lab.locator('.geo-live [data-elimination]')).toBeHidden();
    await lab
      .getByRole('button', { name: /Étape suivante|Next step/, exact: true })
      .click();
    await expect(lab.locator('.geo-live [data-elimination]')).toBeVisible();
    await expect(solution).toBeHidden();
    await lab
      .getByRole('button', { name: /Étape suivante|Next step/, exact: true })
      .click();
    await expect(solution).toContainText('(1 ; 3)');
    await inputs(lab).first().fill('2');
    await expect(solution).toBeHidden();
    await page.goto(`/${locale}/lessons/L33/`);
    lab = page.locator('[data-geometry-lab="raster"]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset')).toBeVisible();
    await values(lab, [2, 1, 0]);
    const decision = lab.locator('.geo-live [data-decision]');
    await expect(decision).toContainText('d = 0');
    await expect(decision).not.toContainText('E (d ≤ 0)');
    await expect(
      lab.getByRole('button', { name: /Vérifier le défi|Check challenge/ }),
    ).toBeDisabled();
    await lab.locator('select').selectOption('NE');
    await lab
      .getByRole('button', { name: /Vérifier le défi|Check challenge/ })
      .click();
    await expect(lab.locator('[data-feedback]')).toContainText(
      fr ? 'À reprendre' : 'Try again',
    );
    await expect(decision).toContainText('E (d ≤ 0)');
    await lab.locator('select').selectOption('E');
    await lab
      .getByRole('button', { name: /Vérifier le défi|Check challenge/ })
      .click();
    await expect(lab.locator('[data-feedback]')).toContainText(
      fr ? 'Défi réussi' : 'Challenge complete',
    );
    await lab
      .getByRole('button', { name: /Passer au pixel suivant|Advance to/ })
      .click();
    await expect(inputs(lab).nth(2)).toHaveValue('1');
    await expect(lab.locator('select')).toHaveValue('');
    await expect(decision).not.toContainText('prochain pas :');
  });
for (const width of [320, 375, 1440])
  test(`new islands: mobile/touch, dark and static print at ${width}px`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      hasTouch: width < 500,
      colorScheme: 'dark',
    });
    const page = await context.newPage();
    for (const [lesson, kind] of routes) {
      await page.goto(`/fr/lessons/L${lesson}/`);
      const lab = page.locator(`[data-geometry-lab="${kind}"]`);
      await lab.scrollIntoViewIfNeeded();
      await expect(lab.locator('fieldset')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await lab.getByRole('button', { name: 'Réinitialiser' }).click();
      await page.emulateMedia({ media: 'print' });
      await expect(lab.locator('.geo-live')).toBeHidden();
      await expect(lab.locator('.geo-print figure')).toBeVisible();
      await expect(lab.locator('.geo-print [data-results]')).toBeVisible();
      await page.emulateMedia({ media: 'screen' });
    }
    await context.close();
  });
test('all four additional islands are readable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const [lesson, kind] of routes) {
    await page.goto(`/fr/lessons/L${lesson}/`);
    const lab = page.locator(`[data-geometry-lab="${kind}"]`);
    await expect(lab.locator('[data-static-note]')).toBeVisible();
    await expect(lab.locator('.geo-live figure')).toBeVisible();
    await expect(lab.locator('fieldset')).toBeHidden();
  }
  await context.close();
});
