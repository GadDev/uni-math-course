import { expect, test, type Locator } from '@playwright/test';
const routes = [
  [28, 'membership'],
  [29, 'slope'],
  [30, 'points'],
  [30, 'intersection'],
  [31, 'region'],
  [32, 'screen'],
  [33, 'sampling'],
  [33, 'raster'],
  [34, 'residuals'],
] as const;
const numbers = (lab: Locator) => lab.locator('input[type="number"]');
async function revealIntersection(lab: Locator) {
  for (let i = 0; i < 3; i++)
    await lab
      .getByRole('button', { name: /Étape suivante|Next step/, exact: true })
      .click();
}
async function values(lab: Locator, values: number[]) {
  for (const [i, v] of values.entries())
    await numbers(lab).nth(i).fill(String(v));
}
for (const locale of ['fr', 'en']) {
  const fr = locale === 'fr';
  for (const [lesson, kind] of routes)
    test(`${locale}: ${kind} calculations, challenge, validation and keyboard reset`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`/${locale}/lessons/L${lesson}/`);
      const lab = page.locator(`[data-geometry-lab="${kind}"]`),
        result = lab.locator('.geo-live [data-results]');
      await lab.scrollIntoViewIfNeeded();
      await expect(lab.locator('fieldset')).toBeVisible();
      const first = numbers(lab).first(),
        slider = lab.locator('input[type="range"]').first();
      const before = await result.textContent();
      await first.fill('');
      await expect(first).toHaveAttribute('aria-invalid', 'true');
      await expect(result).toHaveText(before!);
      await lab.getByRole('button', { name: /Réinitialiser|Reset/ }).click();
      await expect(first).toHaveAttribute('aria-invalid', 'false');
      await slider.focus();
      await page.keyboard.press('ArrowRight');
      expect(
        await slider.evaluate((el) => getComputedStyle(el).outlineWidth),
      ).not.toBe('0px');
      await lab.getByRole('button', { name: /Réinitialiser|Reset/ }).click();
      switch (kind) {
        case 'membership':
          await lab.locator('select').selectOption('squared');
          await values(lab, [1, -1]);
          await expect(result).toContainText(
            fr ? 'Égalité vraie' : 'True equality',
          );
          break;
        case 'slope':
          await values(lab, [-0.5, 2]);
          await expect(result).toContainText('Δy = -1');
          break;
        case 'points':
          await values(lab, [1, 1, 1, 1]);
          await expect(result).toContainText(
            fr ? 'un seul point' : 'one point',
          );
          await values(lab, [1, 1, 1, 4]);
          await expect(result).toContainText(fr ? 'indéfinie' : 'undefined');
          break;
        case 'intersection':
          await values(lab, [2, 1]);
          await revealIntersection(lab);
          await expect(lab.locator('.geo-live [data-solution]')).toContainText(
            fr ? 'confondues' : 'coincident',
          );
          await lab.locator('select').selectOption('vertical');
          await values(lab, [2]);
          await revealIntersection(lab);
          await expect(result).toContainText('(2 ; 5)');
          await lab.locator('select').selectOption('affine');
          await values(lab, [1.75, 6]);
          await revealIntersection(lab);
          await expect(result).toContainText(
            fr ? 'hors de la fenêtre' : 'outside the window',
          );
          await values(lab, [2, 3]);
          break;
        case 'region':
          await values(lab, [2, 2]);
          await lab.locator('select').selectOption('open');
          await expect(result).toContainText(fr ? 'exclu' : 'excluded');
          await lab.locator('select').selectOption('closed');
          await expect(result).toContainText(fr ? 'accepté' : 'accepted');
          await lab.locator('select').selectOption('triangle');
          await values(lab, [3, 2]);
          await expect(result).toContainText(fr ? 'exclu' : 'excluded');
          await values(lab, [4, 0]);
          break;
        case 'screen':
          await values(lab, [6, 6, 60, 60]);
          await expect(result).toContainText(
            fr ? 'hors image' : 'outside the image',
          );
          await values(lab, [2, 1, 50, 50]);
          await expect(result).toContainText('= 300');
          await expect(result).toContainText('= 100');
          break;
        case 'sampling':
          await values(lab, [0, 0]);
          await expect(result).toContainText('1 pixel');
          await values(lab, [0, 5]);
          await expect(result).toContainText(
            fr ? 'ne varie pas' : 'does not change',
          );
          await values(lab, [3, 8]);
          await lab.locator('select').selectOption('y');
          await expect(result).toContainText('9 pixels');
          break;
        case 'raster':
          await values(lab, [3, 8]);
          await expect(result).toContainText(
            fr ? 'Octant non autorisé' : 'Unsupported octant',
          );
          await values(lab, [2, 1, 0]);
          await expect(result).toContainText('d = 0');
          await expect(
            lab.locator('.geo-live [data-decision]'),
          ).not.toContainText('prochain pas : E');
          await expect(
            lab.locator('.geo-live .geo-midpoint svg'),
          ).toBeVisible();
          await numbers(lab).nth(2).fill('2');
          await expect(result).toContainText(
            fr ? 'extrémité atteinte' : 'endpoint reached',
          );
          await numbers(lab).nth(2).fill('0');
          await lab.locator('select').selectOption('E');
          break;
        case 'residuals':
          await lab.getByRole('button', { name: /Essayer m|Try m/ }).click();
          await expect(result).toContainText('Σe ≈ 0');
          await expect(result).toContainText(fr ? 'S ≈ 0,1667' : 'S ≈ 0.1667');
          await expect(lab.locator('.geo-live tbody tr')).toHaveCount(3);
          break;
      }
      await lab
        .getByRole('button', { name: /Vérifier le défi|Check challenge/ })
        .click();
      await expect(lab.locator('[data-feedback]')).toContainText(
        fr ? 'Défi réussi' : 'Challenge complete',
      );
      await lab.getByRole('button', { name: /Réinitialiser|Reset/ }).click();
      await expect(lab.locator('[data-feedback]')).toBeEmpty();
      await expect(page.locator('.katex-error')).toHaveCount(0);
      expect(errors).toEqual([]);
    });
}
for (let lesson = 28; lesson <= 34; lesson++)
  test(`L${lesson}: 320px mobile, print and JavaScript-free reading`, async ({
    page,
    browser,
  }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(`/fr/lessons/L${lesson}/`);
    const labs = page.locator('.geo-lab');
    for (const lab of await labs.all()) {
      await lab.scrollIntoViewIfNeeded();
      await expect(lab.locator('fieldset')).toBeVisible();
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(321);
    await expect(page.locator('.geometry-revision')).toBeVisible();
    for (const detail of await page.locator('article details').all())
      await expect(detail).not.toHaveAttribute('open');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.geo-live').first()).toBeHidden();
    await expect(page.locator('.geo-print').first()).toBeVisible();
    for (const solution of await page.locator('article details > p').all())
      await expect(solution).toBeVisible();
    await expect(page.locator('.course-outline')).toBeHidden();
    for (const svg of await page.locator('.geo-print svg').all())
      await expect(svg).toBeVisible();
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 375, height: 800 },
    });
    const staticPage = await context.newPage();
    await staticPage.goto(`/fr/lessons/L${lesson}/`);
    await expect(staticPage.locator('.geo-live figure').first()).toBeVisible();
    await expect(
      staticPage.locator('[data-static-note]').first(),
    ).toBeVisible();
    await expect(staticPage.locator('.geo-lab fieldset').first()).toBeHidden();
    await staticPage.locator('article details summary').first().click();
    await expect(
      staticPage.locator('article details').first().locator('p'),
    ).toBeVisible();
    for (const img of await staticPage.locator('article img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty('complete', true);
      expect(
        await img.evaluate((el) => (el as HTMLImageElement).naturalWidth),
      ).toBeGreaterThan(0);
    }
    await context.close();
  });

test('touch controls, dark theme and paired section anchors', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    hasTouch: true,
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  await page.goto('/fr/lessons/L29/');
  const lab = page.locator('[data-geometry-lab="slope"]');
  await lab.scrollIntoViewIfNeeded();
  await expect(lab.locator('fieldset')).toBeVisible();
  await numbers(lab).first().fill('-0.5');
  await numbers(lab).nth(1).fill('2');
  await lab.getByRole('button', { name: 'Vérifier le défi' }).tap();
  await expect(lab.locator('[data-feedback]')).toContainText('Défi réussi');
  await lab.getByRole('button', { name: 'Réinitialiser' }).tap();
  await expect(numbers(lab).first()).toHaveValue('2');
  const heading = page.getByRole('heading', {
    name: '3. Calculer — Une opération à la fois',
    exact: true,
  });
  const id = await heading.getAttribute('id');
  await page.goto(`/fr/lessons/L29/#${id}`);
  await page.locator('a[hreflang="en"]').click();
  await expect(page).toHaveURL(/\/en\/lessons\/L29\/#.+/);
  const englishHeading = page.getByRole('heading', {
    name: '3. Calculate — One operation at a time',
    exact: true,
  });
  const englishId = await englishHeading.getAttribute('id');
  expect(decodeURIComponent(new URL(page.url()).hash.slice(1))).toBe(
    englishId,
  );
  await context.close();
});

for (const locale of ['fr', 'en']) {
  test(`${locale}: L28 substitutions and added solutions are explicit`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L28/`);
    const lab = page.locator('[data-geometry-lab="membership"]');
    const live = lab.locator('.geo-live');
    const comparison = live.locator('[data-membership-comparison]');
    const original = live.locator('[data-original-comparison]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset')).toBeVisible();
    await expect(comparison).toHaveText('3 = 3');
    await values(lab, [2, 4]);
    await expect(comparison).toHaveText('4 ≠ 5');
    await expect(live.locator('[data-membership-substitution]')).toContainText(
      '2 × (2) + 1 = 5',
    );
    await lab.locator('select').selectOption('squared');
    await values(lab, [1, -1]);
    await expect(comparison).toHaveText('1 = 1');
    await expect(original).toContainText('-1 ≠ 1');
    await expect(original).toContainText(
      locale === 'fr' ? 'solution ajoutée' : 'added solution',
    );
    await values(lab, [1, 1]);
    await expect(original).not.toContainText(
      locale === 'fr' ? 'solution ajoutée' : 'added solution',
    );
    await lab.locator('select').selectOption('multiplied');
    await values(lab, [0, 2]);
    await expect(comparison).toHaveText('0 = 0');
    await expect(original).toContainText('2 ≠ 0');
    await expect(original).toContainText(
      locale === 'fr' ? 'solution ajoutée' : 'added solution',
    );
    await lab.getByRole('button', { name: /Réinitialiser|Reset/ }).click();
    await expect(comparison).toHaveText('3 = 3');
  });
}

for (const locale of ['fr', 'en']) {
  test(`${locale}: L29 separates slope, intercept and signed displacement`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L29/`);
    const lab = page.locator('[data-geometry-lab="slope"]');
    const live = lab.locator('.geo-live');
    const reference = live.locator('[data-slope-reference]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset')).toBeVisible();
    await lab
      .getByRole('button', { name: /Changer seulement m|Change only m/ })
      .click();
    await expect(reference).toContainText(
      locale === 'fr' ? 'Même départ' : 'Same start',
    );
    await expect(live.locator('[data-slope-change]')).toContainText('= -1');
    await lab
      .getByRole('button', { name: /Changer seulement p|Change only p/ })
      .click();
    await expect(reference).toContainText(
      locale === 'fr' ? 'parallèles distinctes' : 'distinct parallel lines',
    );
    await expect(live.locator('[data-slope-intercept]')).toContainText('(0 ; 3)');
    await values(lab, [-0.5, 2, -2]);
    await expect(live.locator('[data-slope-change]')).toContainText('= 1');
    await values(lab, [0, 2, 2]);
    await expect(live.locator('[data-slope-change]')).toContainText('= 0');
    await values(lab, [2, 1, 0]);
    await expect(live.locator('[data-results]')).toContainText('0/0');
    await lab.getByRole('button', { name: /Réinitialiser|Reset/ }).click();
    await expect(reference).toHaveCount(0);
    await expect(numbers(lab).first()).toHaveValue('2');
  });
}
