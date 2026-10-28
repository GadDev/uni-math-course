import { test, expect, type Page, type Locator } from '@playwright/test';
const ids = ['L21', 'L22', 'L23', 'L24', 'L25', 'L26', 'L27'];
async function lab(page: Page, locale: string, id: string) {
  await page.goto(`/${locale}/lessons/${id}/`);
  const panel = page.locator(
    id === 'L23' ? '[data-fraction-lab]' : '[data-method-lab]',
  );
  await panel.scrollIntoViewIfNeeded();
  const live = panel.locator('.method-live');
  await expect(live.locator('fieldset')).toBeVisible();
  return live;
}
async function slider(live: Locator, index: number, n: number) {
  const input = live.getByRole('slider').nth(index);
  await input.focus();
  await input.press('Home');
  for (let i = Number(await input.getAttribute('min')); i < n; i++)
    await input.press('ArrowRight');
  await expect(input).toHaveValue(String(n));
}
async function fraction(live: Locator, n: number, d: number) {
  await expect(live.locator('[data-fraction-result]')).toHaveAttribute(
    'data-numerator',
    String(n),
  );
  await expect(live.locator('[data-fraction-result]')).toHaveAttribute(
    'data-denominator',
    String(d),
  );
  await expect(live.locator('.katex-error')).toHaveCount(0);
}
for (const locale of ['fr', 'en']) {
  test(`${locale}: four fraction operations expose exact steps, signs and forbidden inputs`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const live = await lab(page, locale, 'L23');
    await fraction(live, 5, 6);
    await expect(live.locator('.method-steps li')).toHaveCount(3);
    await expect(live.locator('svg rect')).toHaveCount(18);
    await live.getByRole('button', { name: '3/4 − 1/6', exact: true }).click();
    await fraction(live, 7, 12);
    await live.getByRole('button', { name: '2/3 × 3/5', exact: true }).click();
    await fraction(live, 2, 5);
    await live.getByRole('button', { name: '3/4 ÷ 9/8', exact: true }).click();
    await fraction(live, 2, 3);
    const inputs = live.getByRole('spinbutton');
    await inputs.nth(2).fill('0');
    await expect(live.locator('[data-fraction-error]')).toContainText(
      locale === 'fr' ? 'diviser par zéro' : 'division by zero',
    );
    await expect(live.locator('[data-fraction-result]')).toHaveCount(0);
    await live.getByRole('combobox').selectOption('multiply');
    await fraction(live, 0, 1);
    await inputs.nth(1).fill('0');
    await expect(inputs.nth(1)).toHaveAttribute('aria-invalid', 'true');
    await expect(live.locator('[data-fraction-result]')).toHaveCount(0);
    await live
      .getByRole('button', {
        name: locale === 'fr' ? 'Réinitialiser' : 'Reset',
        exact: true,
      })
      .click();
    await inputs.nth(1).fill('-2');
    await fraction(live, -1, 6);
    for (const value of ['', '1.5', '13']) {
      await inputs.first().fill(value);
      await expect(inputs.first()).toHaveAttribute('aria-invalid', 'true');
      await expect(live.locator('[data-fraction-result]')).toHaveCount(0);
    }
    await page.emulateMedia({ media: 'print' });
    await expect(
      page.locator('.method-print [data-fraction-result]'),
    ).toHaveAttribute('data-numerator', '5');
    await expect(
      page.locator('.method-print [data-fraction-result]'),
    ).toHaveAttribute('data-denominator', '6');
    await expect(live).toBeHidden();
    await page.emulateMedia({ media: 'screen' });
    await live
      .getByRole('button', {
        name: locale === 'fr' ? 'Réinitialiser' : 'Reset',
        exact: true,
      })
      .click();
    await inputs.first().focus();
    await page.keyboard.press('ArrowUp');
    await fraction(live, 4, 3);
    expect(errors).toEqual([]);
  });
  test(`${locale}: power signs and all three factorisation structures stay correct`, async ({
    page,
  }) => {
    let live = await lab(page, locale, 'L21');
    await expect(live.locator('[data-method-result]')).toContainText(
      '−aⁿ = -9 ; (−a)ⁿ = 9',
    );
    await slider(live, 1, 3);
    await expect(live.locator('[data-method-result]')).toContainText(
      '−aⁿ = -27 ; (−a)ⁿ = -27',
    );
    await live
      .getByRole('button', {
        name: locale === 'fr' ? 'Étape suivante' : 'Next step',
        exact: true,
      })
      .click();
    await expect(live.locator('[data-active-step]')).toContainText('2/3');
    await expect(live.locator('[data-current-math] annotation')).toContainText(
      '(-3)^{3}',
    );
    await expect(live.locator('.method-steps li').nth(1)).toHaveAttribute(
      'data-active',
      'true',
    );
    await slider(live, 0, 0);
    await expect(live.locator('[data-active-step]')).toContainText('1/3');
    await expect(live.locator('[data-method-result]')).toContainText(
      '−aⁿ = 0 ; (−a)ⁿ = 0',
    );
    live = await lab(page, locale, 'L22');
    for (const pattern of ['0', '1', '2']) {
      await live.getByRole('combobox').selectOption(pattern);
      await slider(live, 0, 0);
      await expect(live.locator('[data-method-result]')).toContainText(
        pattern === '0' ? '= 0' : pattern === '1' ? '= -9' : '= 9',
      );
      await expect(live.locator('.katex-error')).toHaveCount(0);
    }
    await live
      .getByRole('button', {
        name: locale === 'fr' ? 'Réinitialiser' : 'Reset',
        exact: true,
      })
      .click();
    await expect(live.getByRole('combobox')).toHaveValue('0');
    await expect(live.getByRole('slider')).toHaveValue('2');
  });
  test(`${locale}: equation and system steps preserve solutions and show coefficient-zero cases`, async ({
    page,
  }) => {
    let live = await lab(page, locale, 'L24');
    await expect(live.locator('[data-method-result]')).toHaveText('x = 2');
    await slider(live, 0, 0);
    await expect(live.locator('[data-method-result]')).toHaveText('S = ∅');
    await slider(live, 2, 5);
    await expect(live.locator('[data-method-result]')).toHaveText('S = ℝ');
    await slider(live, 0, -3);
    await slider(live, 1, 1);
    await slider(live, 2, 3);
    await expect(live.locator('[data-method-result]')).toHaveText('x = -2/3');
    await expect(live.locator('.katex-error')).toHaveCount(0);
    live = await lab(page, locale, 'L25');
    await expect(live.locator('[data-method-result]')).toHaveText(
      '(x ; y) = (4 ; 3)',
    );
    await live.getByRole('combobox').selectOption('1');
    await expect(live.locator('[data-method-result]')).toHaveText(
      '(x ; y) = (4 ; 3)',
    );
    await slider(live, 0, 2);
    await slider(live, 1, 5);
    await expect(live.locator('[data-method-result]')).toHaveText(
      locale === 'fr' ? '(x ; y) = (3,5 ; -1,5)' : '(x ; y) = (3.5 ; -1.5)',
    );
    await expect(live.locator('.katex-error')).toHaveCount(0);
  });
  test(`${locale}: sigma bounds and physical units change the intended quantities`, async ({
    page,
  }) => {
    let live = await lab(page, locale, 'L26');
    await expect(live.locator('[data-method-result]')).toContainText('= 15');
    await slider(live, 0, 5);
    await expect(live.locator('[data-method-error]')).toBeVisible();
    await expect(
      live.getByRole('button', {
        name: locale === 'fr' ? 'Étape suivante' : 'Next step',
        exact: true,
      }),
    ).toBeDisabled();
    await slider(live, 1, 6);
    await expect(live.locator('[data-method-result]')).toContainText('= 20');
    await live.getByRole('combobox').selectOption('1');
    await expect(live.locator('[data-method-result]')).toContainText('= 10');
    await live.getByRole('combobox').selectOption('0');
    await slider(live, 0, 0);
    await slider(live, 1, 0);
    await expect(live.locator('[data-method-result]')).toContainText('= -1');
    await expect(live.locator('.katex-error')).toHaveCount(0);
    live = await lab(page, locale, 'L27');
    await expect(live.locator('[data-method-result]')).toContainText('≈ 5 m');
    await slider(live, 2, 2);
    await expect(live.locator('[data-method-result]')).toContainText(
      locale === 'fr' ? '7,2111' : '7.2111',
    );
    await slider(live, 3, 2);
    await expect(live.locator('[data-method-result]')).toContainText('≈ 10 m');
    await expect(live.locator('svg circle')).toHaveAttribute('cx', '260');
    await expect(live.locator('svg circle')).toHaveAttribute('cy', '80');
    await slider(live, 0, 0);
    await slider(live, 1, 0);
    await expect(live.locator('[data-method-result]')).toContainText('≈ 0 m');
    await expect(live.locator('.katex-error')).toHaveCount(0);
  });
  test(`${locale}: both islands fit mobile/dark and retain a printable reference`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 850 });
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    for (const id of ids) {
      const live = await lab(page, locale, id);
      await expect(page.locator('astro-island')).toHaveCount(2);
      await expect(page.locator('.katex-error')).toHaveCount(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        id,
      ).toBeLessThanOrEqual(320);
      await live
        .getByRole('button', {
          name: locale === 'fr' ? 'Réinitialiser' : 'Reset',
          exact: true,
        })
        .focus();
      expect(
        await page
          .locator(':focus')
          .evaluate((el) => getComputedStyle(el).outlineStyle),
      ).not.toBe('none');
      await page.emulateMedia({ media: 'print' });
      await expect(live).toBeHidden();
      await expect(page.locator('.method-print')).toBeVisible();
      await expect(
        page.locator('.method-print .method-steps li').first(),
      ).toBeVisible();
      await page.emulateMedia({ media: 'screen' });
    }
  });
  test(`${locale}: method explanations and print work without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    for (const id of ids) {
      await page.goto(`/${locale}/lessons/${id}/`);
      const live = page.locator('.method-live');
      await expect(live.locator('fieldset')).toBeHidden();
      await expect(live.locator('.method-steps li').first()).toBeVisible();
      await expect(live.locator('.katex')).not.toHaveCount(0);
      await page.emulateMedia({ media: 'print' });
      await expect(page.locator('.method-print')).toBeVisible();
      await page.emulateMedia({ media: 'screen' });
    }
    await context.close();
  });
}
test('fraction presets respond to touch and extra islands stay off unrelated lessons', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 375, height: 850 },
  });
  const touch = await context.newPage();
  const live = await lab(touch, 'fr', 'L23');
  await live.getByRole('button', { name: '2/3 × 3/5', exact: true }).tap();
  await fraction(live, 2, 5);
  await context.close();
  await page.goto('/fr/lessons/L28/');
  await expect(
    page.locator(
      'astro-island[component-url*="FractionExplorer"],astro-island[component-url*="AlgebraMethodLab"]',
    ),
  ).toHaveCount(0);
});
