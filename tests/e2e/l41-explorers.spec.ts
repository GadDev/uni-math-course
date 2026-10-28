import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  const fr = locale === 'fr';
  test(`${locale}: L41 secants, coordinates and keyboard controls agree`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`/${locale}/lessons/L41/`);
    const lab = page.locator('[data-l41-lab="secant"]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset')).toBeVisible();
    const h = lab.locator('#l41-secant-h-number');
    for (const [increment, slope] of [
      ['0.1', fr ? '0,953102' : '0.953102'],
      ['-0.1', fr ? '1,053605' : '1.053605'],
      ['0.001', fr ? '0,9995' : '0.9995'],
      ['-0.001', fr ? '1,0005' : '1.0005'],
    ]) {
      await h.fill(increment!);
      await expect(lab.locator('[data-secant-value]')).toHaveText(slope!);
    }
    const slider = lab.locator('#l41-secant-a');
    await slider.focus();
    await page.keyboard.press('End');
    await expect(slider).toHaveValue('4');
    await expect(lab.locator('[data-slope-value]')).toHaveText(
      fr ? '0,25' : '0.25',
    );
    expect(
      await slider.evaluate((el) => getComputedStyle(el).outlineWidth),
    ).not.toBe('0px');
    const point = lab.locator('.l41-live [data-point-a]');
    expect(Number(await point.getAttribute('cx'))).toBeCloseTo(
      54 + (4.5 * 510) / 6.7,
    );
    expect(Number(await point.getAttribute('cy'))).toBeCloseTo(
      32 + (4 - Math.log(4)) * 42,
    );
    const before = await lab.locator('[data-secant-value]').textContent();
    for (const invalid of ['0', '-4', '-0.0001']) {
      await h.fill(invalid);
      await expect(h).toHaveAttribute('aria-invalid', 'true');
      await expect(lab.getByRole('alert')).not.toBeEmpty();
      await expect(lab.locator('[data-secant-value]')).toHaveText(before!);
    }
    await lab.locator('#l41-secant-a-number').fill('0');
    await expect(lab.locator('#l41-secant-a-number')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await lab.getByRole('button', { name: /Réinitialiser|Reset/ }).click();
    await expect(h).toHaveValue('1');
    await expect(lab.getByRole('alert')).toBeEmpty();
    await h.fill('-0.001');
    await lab.locator('#l41-secant-h').focus();
    await page.keyboard.press('ArrowRight');
    expect(Number(await h.inputValue())).toBeGreaterThan(0);
    await expect(h).toHaveAttribute('aria-invalid', 'false');
    await lab.locator('#l41-secant-a-number').fill('0.25');
    await h.fill('-0.249999');
    await expect(lab.locator('[data-outside-window]')).toBeVisible();
    await expect(lab.locator('[data-results]')).not.toContainText(
      /NaN|Infinity/,
    );
    await lab.locator('#l41-secant-a-number').fill('1.2345');
    await expect(slider).toHaveValue('1.2345');
    await expect(lab.locator('#l41-secant-h')).toHaveValue('-0.249999');
    await expect(page.locator('.katex-error')).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test(`${locale}: L41 tangent predictions expose positive, negative and zero slopes`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L41/`);
    const lab = page.locator('[data-l41-lab="tangent"]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset')).toBeVisible();
    const check = lab.getByRole('button', {
      name: /Vérifier ma prévision|Check my prediction/,
    });
    await expect(check).toBeDisabled();
    await expect(lab.locator('.l41-live [data-tangent]')).toHaveCount(0);
    for (const [curve, prediction, slope] of [
      ['ln', 'positive', '1'],
      ['negative', 'negative', '-1'],
      ['square', 'zero', '0'],
    ]) {
      await lab.locator('select').first().selectOption(curve!);
      await lab.locator('#l41-tangent-prediction').selectOption(prediction!);
      await check.click();
      await expect(lab.locator('[data-results]')).toContainText(
        fr ? 'Prévision correcte' : 'Correct prediction',
      );
      await expect(lab.locator('[data-slope-value]')).toHaveText(slope!);
      await expect(lab.locator('.l41-live [data-tangent]')).toHaveCount(1);
      await expect(lab.locator('[data-equation]')).toContainText(`(${slope})`);
    }
    await lab.locator('#l41-tangent-a-number').fill('0.5');
    await expect(lab.locator('.l41-live [data-tangent]')).toHaveCount(0);
    await lab.locator('#l41-tangent-prediction').selectOption('positive');
    await check.click();
    await expect(lab.locator('[data-results]')).toContainText(
      fr ? 'À revoir' : 'Try again',
    );
    await expect(lab.locator('[data-slope-value]')).toHaveText(
      fr ? '-2,772589' : '-2.772589',
    );
    await lab.locator('#l41-tangent-a-number').fill('2');
    await lab.locator('#l41-tangent-prediction').selectOption('positive');
    await check.click();
    await expect(lab.locator('[data-slope-value]')).toHaveText(
      fr ? '0,693147' : '0.693147',
    );
  });

  test(`${locale}: L41 fits small screens and prints static graphs, answers and revision sheet`, async ({
    page,
  }) => {
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/lessons/L41/`);
      for (const lab of await page.locator('[data-l41-lab]').all()) {
        await lab.scrollIntoViewIfNeeded();
        await expect(lab.locator('fieldset')).toBeVisible();
        expect((await lab.boundingBox())!.width).toBeLessThanOrEqual(width);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
    const correction = page.locator('.l41-correction').last();
    await expect(correction).not.toHaveAttribute('open');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.l41-live').first()).toBeHidden();
    await expect(page.locator('.l41-print-only').first()).toBeVisible();
    await expect(correction.locator('ol')).toBeVisible();
    await expect(page.locator('.l41-revision')).toBeVisible();
    expect(
      await page
        .locator('.l41-revision')
        .evaluate((el) => getComputedStyle(el).breakBefore),
    ).toBe('page');
    expect(
      await page
        .locator('.l41-revision')
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
  });

  test(`${locale}: L41 works without JavaScript and keeps section translation aligned`, async ({
    browser,
    page,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 900 },
    });
    try {
      const offlinePage = await context.newPage();
      await offlinePage.goto(`http://127.0.0.1:4321/${locale}/lessons/L41/`);
      for (const lab of await offlinePage.locator('[data-l41-lab]').all()) {
        await expect(lab.locator('.l41-live svg')).toBeVisible();
        await expect(lab.locator('fieldset')).toBeHidden();
        await expect(lab.locator('[data-static-note]')).toBeVisible();
      }
      const correction = offlinePage.locator('.l41-correction').last();
      await correction.locator('summary').focus();
      await offlinePage.keyboard.press('Enter');
      await expect(correction.locator('ol')).toBeVisible();
    } finally {
      await context.close();
    }
    await page.goto(
      `/${locale}/lessons/L41/#${fr ? 'méthode--déterminer-une-tangente' : 'method-determine-a-tangent'}`,
    );
    await page
      .getByRole('link', { name: fr ? 'EN' : 'FR', exact: true })
      .click();
    await expect(page).toHaveURL(
      `/${fr ? 'en' : 'fr'}/lessons/L41/#${fr ? 'method-determine-a-tangent' : 'méthode--déterminer-une-tangente'}`,
    );
  });
}

test('L41 touch controls work in dark mode and do not capture page scrolling', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    colorScheme: 'dark',
    viewport: { width: 375, height: 812 },
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/fr/lessons/L41/');
    const lab = page.locator('[data-l41-lab="secant"]');
    await lab.scrollIntoViewIfNeeded();
    const preset = lab.getByRole('button', { name: 'h = -0,001', exact: true });
    await preset.tap();
    await expect(lab.locator('[data-secant-value]')).toHaveText('1,0005');
    expect((await preset.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    expect(
      await lab
        .locator('.l41-live svg')
        .evaluate((el) => getComputedStyle(el).touchAction),
    ).toBe('auto');
  } finally {
    await context.close();
  }
});
