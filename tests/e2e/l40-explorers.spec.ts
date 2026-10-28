import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  const fr = locale === 'fr';
  test(`${locale}: L40 secants handle both sides, zero, keyboard limits and reset`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`/${locale}/lessons/L40/`);
    const activity = page.locator('[data-l40-activity="secant"]');
    await activity.scrollIntoViewIfNeeded();
    const a = activity.locator('#l40-secant-a');
    await expect(a).toBeEnabled();
    for (const [h, slope] of [
      [0.1, fr ? '1,051709' : '1.051709'],
      [-0.1, fr ? '0,951626' : '0.951626'],
    ] as const) {
      await activity.locator(`[data-h-preset="${h}"]`).click();
      await expect(activity.locator('[data-slope]')).toContainText(slope);
      await expect(activity.locator('[data-secant]')).toHaveCount(1);
    }
    await activity.locator('[data-h-preset="0"]').click();
    await expect(activity.locator('[data-slope]')).toContainText(
      fr ? 'Indéfinie' : 'Undefined',
    );
    await expect(activity.locator('[data-secant]')).toHaveCount(0);
    await expect(activity.locator('[data-tangent]')).toHaveCount(1);
    await expect(activity.locator('[data-feedback]')).toContainText('0/0');
    await expect(activity.locator('[data-derivative]')).toContainText('≈ 1');
    await a.focus();
    await page.keyboard.press('End');
    await expect(a).toHaveValue('1');
    await expect(activity.locator('[data-derivative]')).toContainText(
      fr ? '2,718282' : '2.718282',
    );
    const point = activity.locator('[data-point-a]');
    expect(Number(await point.getAttribute('cx'))).toBeCloseTo(
      55 + (3.2 / 4.4) * 510,
      8,
    );
    expect(Number(await point.getAttribute('cy'))).toBeCloseTo(
      365 - ((Math.E + 5) / 14) * 330,
      8,
    );
    expect(
      await a.evaluate((el) => getComputedStyle(el).outlineWidth),
    ).not.toBe('0px');
    await page.keyboard.press('Home');
    await expect(a).toHaveValue('-1');
    await page.keyboard.press('ArrowRight');
    await expect(a).toHaveValue('-0.9');
    await activity
      .getByRole('button', {
        name: fr ? 'Réinitialiser' : 'Reset',
        exact: true,
      })
      .click();
    await expect(a).toHaveValue('0');
    await expect(activity.locator('#l40-secant-h')).toHaveValue('1');
    await expect(activity.locator('[data-slope]')).toContainText(
      fr ? '1,718282' : '1.718282',
    );
    await expect(activity.locator('.l40-readings')).not.toContainText(
      /NaN|Infinity/,
    );
    expect(errors).toEqual([]);
  });

  test(`${locale}: L40 prediction reveals a live tangent with positive, negative and zero slopes`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L40/`);
    const activity = page.locator('[data-l40-activity="tangent"]');
    await activity.scrollIntoViewIfNeeded();
    const select = activity.getByRole('combobox');
    await expect(select).toBeEnabled();
    await expect(activity.locator('[data-tangent]')).toHaveCount(0);
    await activity
      .getByRole('button', {
        name: fr
          ? 'Vérifier : afficher la tangente'
          : 'Check: reveal the tangent',
      })
      .click();
    await expect(activity.locator('[data-derivative]')).toContainText('≈ 1');
    await select.selectOption('decay');
    await expect(activity.locator('[data-derivative]')).toContainText('≈ -1');
    await expect(activity.locator('[data-feedback]')).toContainText(
      fr ? 'décroissante' : 'decreasing',
    );
    await select.selectOption('square');
    await expect(activity.locator('[data-derivative]')).toContainText('≈ 0');
    const line = activity.locator('[data-tangent]');
    expect(await line.getAttribute('y1')).toBe(await line.getAttribute('y2'));
    const a = activity.getByRole('slider');
    await a.focus();
    await page.keyboard.press('End');
    await expect(activity.locator('[data-derivative]')).toContainText(
      'f′(1) ≈ 2',
    );
    await expect(activity.locator('[data-equation]')).toContainText(
      'y ≈ 1 + (2) × (x − (1))',
    );
    await activity
      .getByRole('button', {
        name: fr ? 'Réinitialiser' : 'Reset',
        exact: true,
      })
      .click();
    await expect(select).toHaveValue('exp');
    await expect(a).toHaveValue('0');
    await expect(activity.locator('[data-tangent]')).toHaveCount(0);
  });

  test(`${locale}: L40 linked graph makes derivative values into ordinates`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L40/`);
    const activity = page.locator('[data-l40-activity="linked"]');
    await activity.scrollIntoViewIfNeeded();
    await expect(activity.getByRole('combobox')).toBeEnabled();
    const details = activity.locator('details');
    await details.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(details).toHaveAttribute('open', '');
    await activity.getByRole('combobox').selectOption('square');
    const a = activity.getByRole('slider');
    await a.focus();
    await page.keyboard.press('Home');
    await expect(activity.locator('[data-linked-point]')).toHaveText(
      'M ≈ (-1 ; -2)',
    );
    const points = activity.locator('[data-point-a]');
    expect(await points.nth(0).getAttribute('cx')).toBe(
      await points.nth(1).getAttribute('cx'),
    );
    expect(Number(await points.nth(0).getAttribute('cy'))).toBeCloseTo(
      365 - (6 / 14) * 330,
      8,
    );
    expect(Number(await points.nth(1).getAttribute('cy'))).toBeCloseTo(
      365 - (3 / 14) * 330,
      8,
    );
    await activity.getByRole('combobox').selectOption('exp');
    expect(await points.nth(0).getAttribute('cy')).toBe(
      await points.nth(1).getAttribute('cy'),
    );
    await activity.getByRole('combobox').selectOption('decay');
    expect(Number(await points.nth(1).getAttribute('cy'))).toBeGreaterThan(
      365 - (5 / 14) * 330,
    );
  });

  test(`${locale}: L40 mobile, desktop, equations and disclosures remain readable`, async ({
    page,
  }) => {
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/lessons/L40/`);
      await expect(page.locator('astro-island')).toHaveCount(3);
      await expect(page.locator('.katex-error')).toHaveCount(0);
      if (fr && (width === 320 || width === 1440)) {
        await page.locator('#l40-secant-a').scrollIntoViewIfNeeded();
        await expect(page.locator('#l40-secant-a')).toBeEnabled();
        await page
          .locator('[data-l40-activity="secant"]')
          .screenshot({ path: test.info().outputPath(`secant-${width}.png`) });
      }
      const activity = page.locator('[data-l40-activity="linked"]');
      await activity.scrollIntoViewIfNeeded();
      await expect(activity.getByRole('combobox')).toBeEnabled();
      await activity.locator('summary').click();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await expect(page.locator('.content-provenance')).toContainText(
        'Version 2',
      );
    }
    const correction = page.locator('.l40-correction');
    await correction.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(correction).toHaveAttribute('open', '');
    await expect(correction.locator('.katex').first()).toBeVisible();
    if (fr) {
      await page.locator('[data-theme-toggle]').click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await page
        .locator('[data-l40-activity="secant"]')
        .screenshot({ path: test.info().outputPath('secant-dark.png') });
    }
  });

  test(`${locale}: L40 static graphs, explanations and solutions work without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 900 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L40/`);
      for (const activity of await page.locator('[data-l40-activity]').all()) {
        await expect(activity.locator('figure > svg').first()).toBeVisible();
        await expect(activity.getByRole('slider').first()).toBeDisabled();
        await expect(activity.locator('.l40-static-note')).toBeVisible();
      }
      const linked = page.locator('.l40-linked');
      await linked.locator('summary').click();
      await expect(linked.locator('svg')).toBeVisible();
      await page.locator('.l40-correction summary').click();
      await expect(
        page.locator('.l40-correction .katex').first(),
      ).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
    } finally {
      await context.close();
    }
  });
}

test('L40 touch controls and reduced motion preserve native scrolling', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
    viewport: { width: 375, height: 812 },
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/fr/lessons/L40/');
    const activity = page.locator('[data-l40-activity="secant"]');
    await activity.scrollIntoViewIfNeeded();
    const button = activity.locator('[data-h-preset="-0.01"]');
    await button.tap();
    await expect(activity.locator('#l40-secant-h')).toHaveValue('-0.01');
    const box = await button.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(
      await activity
        .locator('svg')
        .evaluate((el) => getComputedStyle(el).touchAction),
    ).toBe('auto');
    expect(
      await activity
        .locator('[data-point-a]')
        .evaluate((el) => getComputedStyle(el).transitionDuration),
    ).toBe('0s');
  } finally {
    await context.close();
  }
});

test('L40 section language links stay aligned and L39 does not hydrate these activities', async ({
  page,
}) => {
  await page.goto('/fr/lessons/L40/');
  const heading = page
    .locator('h2')
    .filter({ hasText: 'Construire l’équation de la tangente' });
  const slug = await heading.getAttribute('id');
  await page.goto(`/fr/lessons/L40/#${slug}`);
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(
    '/en/lessons/L40/#constructing-the-tangent-equation',
  );
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/fr/lessons/L39/');
  await expect(page.locator('astro-island')).toHaveCount(0);
  expect(requests.some((url) => /DerivativeExplorer/.test(url))).toBe(false);
});
