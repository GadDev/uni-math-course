import { test, expect, type Page, type Locator } from '@playwright/test';

const ids = ['L21', 'L22', 'L23', 'L24', 'L25', 'L26', 'L27'];
const kinds = [
  'precedence',
  'area',
  'domain',
  'inequality',
  'system',
  'mean',
  'distance',
];
async function open(page: Page, locale: string, id: string) {
  const response = await page.goto(`/${locale}/lessons/${id}/`);
  expect(response?.status()).toBe(200);
  const lab = page.locator('.algebra-live');
  await lab.scrollIntoViewIfNeeded();
  await expect(lab.locator('fieldset')).toBeVisible();
  return lab;
}
async function slide(lab: Locator, index: number, value: number) {
  const control = lab.getByRole('slider').nth(index);
  await control.focus();
  await expect(control).toBeFocused();
  await control.press('Home');
  const min = Number(await control.getAttribute('min'));
  for (let i = min; i < value; i++) await control.press('ArrowRight');
  await expect(control).toHaveValue(String(value));
}
for (const locale of ['fr', 'en']) {
  test(`${locale}: parentheses, areas and domain conditions respond and reset`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    let lab = await open(page, locale, 'L21');
    await expect(lab.locator('[data-result]')).toHaveText('14');
    await lab.getByRole('checkbox').check();
    await expect(lab.locator('[data-result]')).toHaveText('20');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.algebra-print [data-result]')).toHaveText('14');
    await expect(lab).toBeHidden();
    await page.emulateMedia({ media: 'screen' });
    await lab.getByRole('button').click();
    await expect(lab.locator('[data-result]')).toHaveText('14');
    lab = await open(page, locale, 'L22');
    await slide(lab, 0, 4);
    await expect(lab.locator('[data-result]')).toContainText('49');
    await expect(lab.locator('.algebra-area-cross')).toHaveCount(2);
    await lab.getByRole('button').click();
    await expect(lab.locator('[data-result]')).toContainText('25');
    lab = await open(page, locale, 'L23');
    const input = lab.getByRole('spinbutton');
    await input.fill('3');
    await expect(lab.locator('[data-quotient]')).toHaveText(
      locale === 'fr' ? 'Non défini' : 'Undefined',
    );
    await expect(lab.locator('.algebra-point')).toHaveCount(0);
    await input.fill('-2');
    await expect(lab.locator('[data-root]')).toHaveText(
      locale === 'fr' ? 'Non défini' : 'Undefined',
    );
    await expect(lab.locator('tbody tr').nth(2)).toContainText('≈ 2');
    await input.fill('0');
    await expect(lab.locator('tbody tr').nth(3)).toContainText(
      locale === 'fr' ? 'Non défini' : 'Undefined',
    );
    for (const bad of ['', '6', '-6']) {
      await input.fill(bad);
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(lab.locator('table')).toHaveCount(0);
      await expect(lab.getByRole('status')).not.toBeEmpty();
    }
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.algebra-print [data-quotient]')).toHaveText(
      '≈ 5',
    );
    await expect(page.locator('.algebra-print table')).toBeVisible();
    await page.emulateMedia({ media: 'screen' });
    await input.fill('1e-320');
    await expect(lab.locator('tbody tr').nth(3)).toContainText(
      locale === 'fr' ? 'hors précision' : 'beyond numerical',
    );
    await lab.getByRole('button').click();
    await expect(input).toHaveValue('2');
    await expect(lab.locator('[data-quotient]')).toHaveText('≈ 5');
    expect(errors).toEqual([]);
  });
  test(`${locale}: inequalities handle negative, positive, zero and inclusive boundaries`, async ({
    page,
  }) => {
    const lab = await open(page, locale, 'L24');
    await expect(lab.locator('[data-solution]')).toContainText('x < 2');
    await slide(lab, 2, 2);
    await expect(lab.locator('[data-test]')).toContainText(
      locale === 'fr' ? 'ne convient pas' : 'does not satisfy',
    );
    await lab.getByRole('checkbox').check();
    await expect(lab.locator('[data-solution]')).toContainText('x ≤ 2');
    await expect(lab.locator('[data-test]')).toContainText(
      locale === 'fr' ? '→ convient' : '→ satisfies',
    );
    await expect(lab.locator('circle')).toHaveClass('algebra-point');
    await slide(lab, 0, 2);
    await expect(lab.locator('[data-solution]')).toContainText('x ≥ -2');
    await slide(lab, 0, 0);
    await expect(lab.locator('[data-solution]')).toHaveText('S = ℝ');
    await slide(lab, 1, 0);
    await lab.getByRole('checkbox').uncheck();
    await expect(lab.locator('[data-solution]')).toHaveText('S = ∅');
    await lab.getByRole('checkbox').check();
    await expect(lab.locator('[data-solution]')).toHaveText('S = ℝ');
    await lab.getByRole('button').click();
    await expect(lab.locator('[data-solution]')).toContainText('x < 2');
  });
  test(`${locale}: systems, means and distances connect algebra and geometry`, async ({
    page,
  }) => {
    let lab = await open(page, locale, 'L25');
    await expect(lab.locator('[data-solution]')).toContainText('(1 ; 2)');
    await slide(lab, 0, 1);
    await expect(lab.locator('[data-solution]')).toContainText(
      locale === 'fr' ? 'Aucune solution' : 'No solution',
    );
    await slide(lab, 1, 1);
    await expect(lab.locator('[data-solution]')).toContainText(
      locale === 'fr' ? 'Infinité' : 'Infinitely',
    );
    await lab.getByRole('button').click();
    await expect(lab.locator('[data-solution]')).toContainText('(1 ; 2)');
    lab = await open(page, locale, 'L26');
    await expect(lab.locator('[data-mean]')).toContainText('≈ 5');
    await slide(lab, 3, 9);
    await expect(lab.locator('[data-mean]')).toContainText(
      locale === 'fr' ? '5,3333' : '5.3333',
    );
    await expect(lab.locator('[data-centered]')).toContainText('= 0');
    await slide(lab, 0, 1);
    await expect(lab.locator('tbody tr')).toHaveCount(1);
    await expect(lab.locator('[data-mean]')).toContainText('≈ 2');
    await lab.getByRole('button').click();
    await expect(lab.locator('tbody tr')).toHaveCount(3);
    lab = await open(page, locale, 'L27');
    await expect(lab.locator('[data-distance]')).toContainText('d ≈ 5');
    await slide(lab, 2, -3);
    await expect(lab.locator('[data-distance]')).toContainText('d ≈ 5');
    await expect(lab.locator('[data-displacement]')).toContainText('= -3');
    await slide(lab, 2, 0);
    await slide(lab, 3, 0);
    await expect(lab.locator('[data-distance]')).toContainText('d ≈ 0');
    await lab.getByRole('button').click();
    await expect(lab.locator('[data-distance]')).toContainText('d ≈ 5');
  });
  test(`${locale}: all seven routes fit mobile/dark and preserve paired anchors and useful print states`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 850 });
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    for (const [index, id] of ids.entries()) {
      const lab = await open(page, locale, id);
      await expect(page.locator('[data-algebra-lab]')).toHaveAttribute(
        'data-algebra-lab',
        kinds[index]!,
      );
      await expect(page.locator('.katex-error')).toHaveCount(0);
      await expect(page.locator('.algebra-study h3')).toHaveCount(3);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        id,
      ).toBeLessThanOrEqual(320);
      await lab.getByRole('button').focus();
      expect(
        await lab
          .getByRole('button')
          .evaluate((el) => getComputedStyle(el).outlineStyle),
      ).not.toBe('none');
      const heading = page.locator('.algebra-study h2').nth(2);
      const anchor = await heading.getAttribute('id');
      await page.goto(`/${locale}/lessons/${id}/#${anchor}`);
      const other = locale === 'fr' ? 'en' : 'fr';
      await page.locator(`.language-switch a[lang="${other}"]`).click();
      await expect(page).toHaveURL(new RegExp(`/${other}/lessons/${id}/#.+`));
      const target = await page.evaluate(() =>
        decodeURIComponent(location.hash.slice(1)),
      );
      await expect(page.locator(`[id="${target}"]`)).toHaveCount(1);
      await page.emulateMedia({ media: 'print' });
      await expect(page.locator('.algebra-live')).toBeHidden();
      await expect(page.locator('.algebra-print')).toBeVisible();
      await expect(
        page.locator('.algebra-study details').first().locator('p'),
      ).toBeVisible();
      await expect(page.locator('.algebra-revision')).toBeVisible();
      await page.emulateMedia({ media: 'screen' });
    }
  });
  test(`${locale}: all seven lessons remain useful without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    for (const id of ids) {
      await page.goto(`/${locale}/lessons/${id}/`);
      const lab = page.locator('.algebra-live');
      await expect(lab.locator('fieldset')).toBeHidden();
      await expect(lab).toContainText(
        locale === 'fr' ? 'Exemple fixe' : 'Fixed example',
      );
      const solution = page.locator('.algebra-study details').nth(1);
      await solution.locator('summary').click();
      await expect(solution.locator('p')).toBeVisible();
      await page.emulateMedia({ media: 'print' });
      await expect(page.locator('.algebra-print')).toBeVisible();
      await page.emulateMedia({ media: 'screen' });
    }
    await context.close();
  });
}

test('touch controls work at 375px and the explorer island is absent from unrelated lessons', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 375, height: 850 },
  });
  const touch = await context.newPage();
  const lab = await open(touch, 'fr', 'L27');
  const range = lab.getByRole('slider').nth(2);
  const before = await range.inputValue();
  await range.tap({ position: { x: 8, y: 22 } });
  expect(await range.inputValue()).not.toBe(before);
  await expect(lab.locator('[data-displacement]')).not.toContainText('= 3 ;');
  await context.close();
  await page.goto('/fr/lessons/L28/');
  await expect(
    page.locator('astro-island[component-url*="AlgebraExplorer"]'),
  ).toHaveCount(0);
});
