import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  const fr = locale === 'fr';
  test(`${locale}: L39 secants approach from both sides without h=0`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`/${locale}/lessons/L39/`);
    const lab = page.locator('[data-l39-panel="secant"]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset')).toBeVisible();
    await expect(lab.locator('[data-quotient]')).toContainText('3');
    await lab.locator('#l39-secant-sign').selectOption('-1');
    await expect(lab.locator('[data-quotient]')).toContainText('≈ 1');
    await lab
      .getByRole('button', {
        name: `|h| = ${fr ? '0,001' : '0.001'}`,
        exact: true,
      })
      .click();
    await expect(lab.locator('[data-quotient]')).toContainText(
      fr ? '1,999' : '1.999',
    );
    await lab.locator('#l39-secant-sign').selectOption('1');
    await expect(lab.locator('[data-quotient]')).toContainText(
      fr ? '2,001' : '2.001',
    );
    await lab.locator('#l39-secant-h').focus();
    await page.keyboard.press('Home');
    await expect(lab.locator('#l39-secant-h')).toHaveValue('0.001');
    await expect(lab.locator('[data-derivative]')).toHaveText('f′(a) ≈ 2');
    await lab.getByRole('button', { name: 'a = -1', exact: true }).click();
    await expect(lab.locator('[data-derivative]')).toHaveText('f′(a) ≈ -2');
    await expect(lab.locator('tbody tr').last()).toContainText(
      fr ? '-1,999' : '-1.999',
    );
    await lab
      .getByRole('button', { name: fr ? 'Réinitialiser' : 'Reset' })
      .click();
    await expect(lab.locator('#l39-secant-a')).toHaveValue('1');
    await expect(lab.locator('#l39-secant-h')).toHaveValue('1');
    await expect(lab.locator('#l39-secant-sign')).toHaveValue('1');
    await expect(lab.locator('[data-b-coordinates]')).toHaveText('B = (2 ; 4)');
    await expect(lab.locator('output')).not.toContainText(
      /NaN|Infinity|undefined/,
    );
    await expect(page.locator('.katex-error')).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test(`${locale}: L39 function, derivative, equation and challenge stay linked`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L39/`);
    const lab = page.locator('[data-l39-panel="tangent"]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset').first()).toBeVisible();
    await expect(lab.locator('[data-equation]')).toContainText(
      'y = (1) + (2) × (x − (1))',
    );
    await lab.locator('#l39-tangent-challenge').selectOption('height');
    await expect(
      lab.locator('fieldset').last().getByRole('status'),
    ).toContainText(fr ? 'hauteur, pas la pente' : 'height, not slope');
    await lab.locator('#l39-tangent-challenge').selectOption('zero');
    await expect(
      lab.locator('fieldset').last().getByRole('status'),
    ).toContainText(fr ? 'Exact' : 'Correct');
    await lab.locator('#l39-tangent-curve').selectOption('cubic');
    await expect(lab.locator('[data-value]')).toHaveText('f(a) ≈ -2');
    await expect(lab.locator('[data-derivative]')).toHaveText('f′(a) ≈ 0');
    await expect(lab.locator('[data-challenge-state]')).toContainText(
      fr ? 'Vous avez trouvé' : 'You found',
    );
    await expect(lab.locator('svg').last().locator('title')).toHaveText(
      'f′(x) = 3x² − 3',
    );
    await lab.getByRole('button', { name: 'a = 0', exact: true }).click();
    await expect(lab.locator('[data-derivative]')).toHaveText('f′(a) ≈ -3');
    await expect(lab.locator('[data-slope-description]')).toContainText(
      fr ? 'négative' : 'Negative',
    );
    await lab
      .getByRole('button', { name: fr ? 'Réinitialiser' : 'Reset' })
      .click();
    await expect(lab.locator('#l39-tangent-curve')).toHaveValue('square');
    await expect(lab.locator('[data-derivative]')).toHaveText('f′(a) ≈ 2');
  });

  test(`${locale}: L39 point and native controls support keyboard and direct dragging`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L39/`);
    const lab = page.locator('[data-l39-panel="tangent"]');
    await lab.scrollIntoViewIfNeeded();
    const handle = lab.locator('[data-point-a]');
    await expect(handle).toHaveAttribute('role', 'slider');
    await handle.focus();
    await page.keyboard.press('Home');
    await expect(lab.locator('#l39-tangent-a')).toHaveValue('-2');
    await page.keyboard.press('End');
    await expect(lab.locator('#l39-tangent-a')).toHaveValue('2');
    await page.keyboard.press('ArrowLeft');
    await expect(lab.locator('#l39-tangent-a')).toHaveValue('1.95');
    await expect(handle).toBeFocused();
    expect(
      await handle.evaluate((el) => getComputedStyle(el).strokeWidth),
    ).toBe('5px');
    const slider = lab.locator('#l39-tangent-a');
    await slider.focus();
    await page.keyboard.press('Home');
    await page.keyboard.press('ArrowRight');
    await expect(handle).toHaveAttribute('aria-valuenow', '-1.95');
    const svg = lab.locator('svg').first();
    await svg.scrollIntoViewIfNeeded();
    const bounds = (await svg.boundingBox())!;
    const point = (await handle.boundingBox())!;
    await page.mouse.move(
      point.x + point.width / 2,
      point.y + point.height / 2,
    );
    await page.mouse.down();
    // Independent conversion from the labelled [-3.4, 3.4] plotting window.
    await page.mouse.move(
      bounds.x + (bounds.width * (45 + (430 * 4.9) / 6.8)) / 520,
      point.y + point.height / 2,
      { steps: 8 },
    );
    await page.mouse.up();
    await expect(slider).toHaveValue('1.5');
    await expect(lab.locator('[data-derivative]')).toHaveText('f′(a) ≈ 3');
    await expect(lab.locator('[data-value]')).toHaveText(
      fr ? 'f(a) ≈ 2,25' : 'f(a) ≈ 2.25',
    );
  });

  test(`${locale}: L39 remains usable at narrow widths and in dark mode`, async ({
    page,
  }) => {
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/lessons/L39/`);
      await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
      const lab = page.locator('[data-l39-panel="tangent"]');
      await lab.scrollIntoViewIfNeeded();
      await expect(lab.locator('#l39-tangent-a')).toBeVisible();
      await lab.getByRole('button', { name: 'a = 0', exact: true }).click();
      await expect(lab.locator('[data-derivative]')).toHaveText('f′(a) ≈ 0');
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      for (const panel of await page.locator('[data-l39-panel]').all()) {
        expect(
          await panel.evaluate((el) => el.scrollWidth <= el.clientWidth),
        ).toBe(true);
      }
    }
  });

  test(`${locale}: L39 static graphs, definitions and corrections work without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 900 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L39/`);
      for (const panel of await page.locator('[data-l39-panel]').all()) {
        await expect(panel.locator('svg').first()).toBeVisible();
        await expect(panel.locator('fieldset').first()).toBeHidden();
        await expect(panel.locator('[data-static-note]')).toBeVisible();
        await expect(panel.locator('[data-point-a]')).not.toHaveAttribute(
          'role',
        );
      }
      const correction = page.locator('.l39-correction');
      await correction.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(correction).toHaveAttribute('open', '');
      await expect(correction.locator('.katex').first()).toBeVisible();
      await expect(
        page.locator('.l39-callout[data-kind="essential"]'),
      ).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
    } finally {
      await context.close();
    }
  });
}

test('L39 touch controls, scroll surface and reading isolation', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 375, height: 812 },
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/fr/lessons/L39/');
    const lab = page.locator('[data-l39-panel="tangent"]');
    await lab.scrollIntoViewIfNeeded();
    const zero = lab.getByRole('button', { name: 'a = 0', exact: true });
    await zero.tap();
    await expect(lab.locator('[data-derivative]')).toHaveText('f′(a) ≈ 0');
    expect((await zero.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    expect(
      await lab
        .locator('svg')
        .first()
        .evaluate((el) => getComputedStyle(el).touchAction),
    ).toBe('auto');
    expect(
      await lab
        .locator('[data-point-a]')
        .evaluate((el) => getComputedStyle(el).touchAction),
    ).toBe('pan-y');
    await page.goto('http://127.0.0.1:4321/fr/lessons/L38/');
    await expect(page.locator('[data-l39-panel]')).toHaveCount(0);
    await expect(
      page.locator('astro-island[component-url*="DerivativePanel"]'),
    ).toHaveCount(0);
    await expect(page.locator('[data-l38-explorer]')).toHaveCount(2);
  } finally {
    await context.close();
  }
});

test('L39 section language anchors stay paired', async ({ page }) => {
  await page.goto('/fr/lessons/L39/#la-règle-de-la-chaîne');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL('/en/lessons/L39/#the-chain-rule');
});
