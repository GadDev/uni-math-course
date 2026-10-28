import { expect, test, type Locator } from '@playwright/test';

async function setRange(input: Locator, value: string) {
  await input.evaluate((element, next) => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )!.set!;
    setter.call(element, next);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

for (const locale of ['fr', 'en']) {
  test(`${locale}: loop boundaries, playback, pause and reset stay aligned`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`/${locale}/lessons/L42/`);
    const lab = page.locator('[data-l42="halving"]');
    await lab.scrollIntoViewIfNeeded();
    const n = lab.locator('input');
    await expect(n).toBeEnabled();
    for (const [value, count] of [
      [1, 0],
      [63, 5],
      [64, 6],
      [65, 6],
    ]) {
      await n.fill(String(value));
      await expect(lab.locator('output')).toContainText(
        `${count} = ⌊log₂(${value})⌋`,
      );
      await expect(lab.locator('tbody tr')).toHaveCount(count! + 1);
    }
    await lab.locator('[data-step]').click();
    await expect(lab.locator('output')).toContainText('m = 32');
    await expect(lab.locator('tr[data-active="true"]')).toContainText('32');
    await lab.locator('[data-play]').click();
    await expect(lab.locator('[data-play]')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(lab.locator('output')).toContainText('m = 16');
    await lab.locator('[data-play]').click();
    const paused = await lab.locator('output').textContent();
    await page.waitForTimeout(950);
    await expect(lab.locator('output')).toHaveText(paused!);
    await n.fill('0');
    await expect(n).toHaveAttribute('aria-invalid', 'true');
    await expect(lab.locator('[data-step]')).toBeDisabled();
    await lab.locator('[data-reset]').click();
    await expect(n).toHaveValue('64');
    expect(errors).toEqual([]);
  });

  test(`${locale}: logarithms handle decreasing bases, domains and invalid input recovery`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L42/`);
    const lab = page.locator('[data-l42="log"]');
    await lab.scrollIntoViewIfNeeded();
    const a = lab.locator('#l42-log-a');
    await expect(a).toBeEnabled();
    await a.fill('0.5');
    await expect(lab.locator('output')).toContainText('≈ -3');
    await expect(lab.locator('tbody tr').last()).toContainText('-3');
    const point = lab.locator('[data-point="P"]');
    await expect(point).toHaveCount(1);
    for (const value of ['1', '0', '-2', '']) {
      await a.fill(value);
      await expect(a).toHaveAttribute('aria-invalid', 'true');
      await expect(lab.locator('.l42-figure')).toHaveCount(0);
      await expect(lab.locator('output')).not.toContainText(/NaN|Infinity/);
    }
    await a.fill('2');
    await lab.locator('#l42-log-x').fill('0');
    await expect(lab.locator('#l42-log-x')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await lab.locator('[data-reset]').click();
    await expect(lab.locator('output')).toContainText('≈ 3');
  });

  test(`${locale}: cost selection, scales, integer endpoints and table agree`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L42/`);
    const lab = page.locator('[data-l42="complexity"]');
    await lab.scrollIntoViewIfNeeded();
    const slider = lab.locator('#l42-cost-n');
    await expect(slider).toBeEnabled();
    await expect(lab.locator('[data-cost="exp"] td')).toHaveText('256');
    await lab.locator('#l42-cost-scale').selectOption('linear');
    await expect(lab.locator('[data-scale-note]')).toContainText(
      locale === 'fr' ? 'linéaire' : 'Linear',
    );
    await slider.focus();
    await page.keyboard.press('Home');
    await expect(slider).toHaveValue('1');
    await expect(lab.locator('[data-cost="log"] td')).toHaveText('0');
    await lab.locator('#l42-cost-scale').selectOption('log');
    await page.getByLabel('n!', { exact: true }).check();
    await slider.focus();
    await page.keyboard.press('End');
    await expect(slider).toHaveValue('64');
    await expect(lab.locator('[data-cost="factorial"] td')).toContainText(
      'E89',
    );
    for (const path of await lab.locator('[data-series]').all()) {
      expect(await path.getAttribute('d')).not.toMatch(/NaN|Infinity/);
    }
    for (const box of await lab.getByRole('checkbox').all())
      await box.uncheck();
    await expect(lab.locator('[data-series]')).toHaveCount(0);
    await expect(lab.locator('output')).toContainText(
      locale === 'fr' ? 'Sélectionnez' : 'Select',
    );
    await lab.locator('[data-reset]').click();
    await expect(slider).toHaveValue('8');
    await expect(lab.locator('[data-series]')).toHaveCount(6);
  });

  test(`${locale}: tangent handles both sides, horizontal slope, zero and domain exclusions`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L42/`);
    const lab = page.locator('[data-l42="tangent"]');
    await lab.scrollIntoViewIfNeeded();
    const h = lab.locator('#l42-h');
    await expect(h).toBeEnabled();
    await setRange(h, '-0.1');
    await expect(lab.locator('output')).toContainText(
      locale === 'fr' ? '≈ 1,9' : '≈ 1.9',
    );
    await setRange(h, '0');
    await expect(lab.locator('output')).toContainText(
      locale === 'fr' ? 'quotient est indéfini' : 'quotient is undefined',
    );
    await expect(lab.locator('[data-point="Q"]')).toHaveCount(0);
    await expect(lab.locator('[data-series]')).toHaveCount(2);
    await setRange(lab.locator('#l42-x0'), '0');
    await expect(lab.locator('output')).toContainText('f′(0) ≈ 0');
    await lab.locator('#l42-function').selectOption('log');
    await setRange(lab.locator('#l42-x0'), '0.5');
    await setRange(h, '-1');
    await expect(lab.locator('[data-point="Q"]')).toHaveCount(0);
    await expect(lab.locator('output')).toContainText(
      locale === 'fr' ? 'hors du domaine' : 'outside the domain',
    );
    await expect(lab.locator('output')).not.toContainText(/NaN|Infinity/);
    await lab.locator('#l42-function').selectOption('exp');
    await lab.locator('[data-play]').click();
    await expect(h).toHaveValue('0.5');
    await lab.locator('[data-play]').click();
    await lab.locator('[data-reset]').click();
    await expect(h).toHaveValue('1');
    await expect(lab.locator('#l42-function')).toHaveValue('square');
    await expect(page.locator('.katex-error')).toHaveCount(0);
  });
}

test('L42 keyboard, touch targets, mobile layout and reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/fr/lessons/L42/');
    for (const lab of await page.locator('[data-l42]').all()) {
      await lab.scrollIntoViewIfNeeded();
      await expect(lab.locator('fieldset')).toBeVisible();
      for (const button of await lab.getByRole('button').all()) {
        const size = await button.boundingBox();
        expect(size!.height).toBeGreaterThanOrEqual(44);
        expect(size!.width).toBeGreaterThanOrEqual(44);
      }
      for (const button of await lab.locator('[data-play]').all())
        await expect(button).toBeDisabled();
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  }
  const input = page.locator('#l42-cost-n');
  await input.focus();
  await page.keyboard.press('ArrowRight');
  await expect(input).toHaveValue('9');
  await expect(input).toBeFocused();
  expect(
    await input.evaluate((el) => getComputedStyle(el).outlineWidth),
  ).not.toBe('0px');
  const solution = page.locator('.l42-answer').first();
  await solution.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(solution).toHaveAttribute('open', '');
});

test('L42 SSR examples and printed corrections survive without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/fr/lessons/L42/');
    await expect(page.locator('astro-island')).toHaveCount(4);
    for (const lab of await page.locator('[data-l42]').all()) {
      await expect(lab.locator('.l42-figure')).toBeVisible();
      await expect(lab.locator('fieldset')).toBeHidden();
      await expect(lab.locator('table')).toBeVisible();
      await expect(lab.locator('.l42-static-note')).toBeVisible();
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(375);
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.site-header')).toBeHidden();
    await expect(page.locator('.course-outline')).toBeHidden();
    for (const solution of await page.locator('.l42-answer').all())
      await expect(solution.locator('p,ol').first()).toBeVisible();
  } finally {
    await context.close();
  }
});

test('L42 browser print opens solutions and restores their reading state', async ({
  page,
}) => {
  await page.goto('/fr/lessons/L42/');
  const first = page.locator('.l42-answer').first();
  const second = page.locator('.l42-answer').nth(1);
  await second.locator('summary').click();
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  await expect(page.locator('.l42-answer:not([open])')).toHaveCount(0);
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'dark';
  });
  expect(
    await page
      .locator('html')
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe('rgb(255, 255, 255)');
  expect(
    await page
      .locator('article pre')
      .evaluate((el) => getComputedStyle(el).breakInside),
  ).toBe('avoid');
  await expect(page.locator('.l42-controls').first()).toBeHidden();
  await expect(page.locator('.l42-figure').first()).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
  await expect(first).not.toHaveAttribute('open');
  await expect(second).toHaveAttribute('open', '');
});

test('L42 preset buttons work with touch and playback stops when leaving the panel', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 375, height: 812 },
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/fr/lessons/L42/');
    const loop = page.locator('[data-l42="halving"]');
    await loop.scrollIntoViewIfNeeded();
    await loop.getByRole('button', { name: 'n = 65', exact: true }).tap();
    await loop.locator('[data-step]').tap();
    await expect(loop.locator('output')).toContainText('m = 32');
    await loop.locator('[data-play]').tap();
    await expect(loop.locator('[data-play]')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.locator('article h1').scrollIntoViewIfNeeded();
    await expect(loop.locator('[data-play]')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    const paused = await loop.locator('output').textContent();
    await page.waitForTimeout(950);
    await expect(loop.locator('output')).toHaveText(paused!);
  } finally {
    await context.close();
  }
});

test('L42 language anchors stay paired and adjacent lessons do not load its islands', async ({
  page,
}) => {
  await page.goto('/fr/lessons/L42/#comprendre-une-boucle-qui-divise-par-deux');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(
    '/en/lessons/L42/#understanding-repeated-halving',
  );
  await page.goto('/fr/lessons/L41/');
  await expect(page.locator('[data-l42]')).toHaveCount(0);
  await expect(
    page.locator('astro-island[component-url*="L42Explorer"]'),
  ).toHaveCount(0);
  await expect(page.locator('[data-l41-lab]')).toHaveCount(2);
});
