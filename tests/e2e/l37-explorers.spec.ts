import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  const fr = locale === 'fr';
  test(`${locale}: mapping distinguishes shared outputs from ambiguous inputs`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L37/`);
    const activity = page.locator('[data-l37-activity="mapping"]');
    await activity.scrollIntoViewIfNeeded();
    await expect(activity.locator('fieldset')).toBeVisible();
    const select = activity.getByRole('combobox');
    await expect(select).toBeEnabled();
    await expect(activity.locator('output')).toContainText(
      fr ? 'C’est une fonction' : 'This is a function',
    );
    await select.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(activity.locator('output')).toContainText(
      fr ? 'Pas une fonction' : 'Not a function',
    );
    await expect(activity.locator('img')).toHaveAttribute(
      'src',
      new RegExp(`mapping-ambiguous-${locale}\\.svg$`),
    );
    await expect(activity.locator('img')).toHaveAttribute('alt', /−1.*1.*2/);
    await select.selectOption('square');
    await expect(activity.locator('output')).toContainText(
      fr ? 'partagent l’image 1' : 'share the output 1',
    );
  });

  test(`${locale}: domain explorer handles both forbidden inputs and finite neighbours`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L37/`);
    const activity = page.locator('[data-l37-activity="domain"]');
    await activity.scrollIntoViewIfNeeded();
    await expect(activity.locator('fieldset')).toBeVisible();
    for (const x of [0, 2]) {
      await activity.locator(`[data-input="${x}"]`).click();
      await expect(activity.locator('output')).toContainText(
        fr ? 'n’est pas défini' : 'is undefined',
      );
      await expect(activity.locator('output')).not.toContainText(
        /NaN|Infinity|∞/,
      );
      await expect(activity.locator('[data-moving-point]')).toHaveAttribute(
        'fill',
        '#fffdf8',
      );
    }
    const slider = activity.getByRole('slider');
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveValue('2.25');
    await expect(activity.locator('output')).toContainText(
      fr ? 'autorisée' : 'allowed',
    );
    await expect(slider).toHaveAttribute('aria-valuetext', /2[,.]25/);
    await activity.locator('[data-input="-1"]').click();
    await expect(activity.locator('output')).toContainText(
      fr ? '1,666667' : '1.666667',
    );
    await activity.locator('[data-input="1"]').click();
    await expect(slider).toHaveValue('1');
    await expect(activity.locator('output')).toContainText('≈ -1');
  });

  test(`${locale}: graph, calculations, table and keyboard selection stay aligned`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L37/`);
    const activity = page.locator('[data-l37-activity="graph"]');
    await activity.scrollIntoViewIfNeeded();
    await expect(activity.locator('fieldset')).toBeVisible();
    for (const [x, y, cx, cy] of [
      [-1, 0, 140, 185],
      [2, 15, 365, 72.5],
      [0, 3, 215, 162.5],
    ]) {
      await activity.locator(`[data-input="${x}"]`).click();
      await expect(activity.locator('[data-current-y]')).toHaveText(String(y));
      await expect(activity.locator('[data-moving-point]')).toHaveAttribute(
        'cx',
        String(cx),
      );
      await expect(activity.locator('[data-moving-point]')).toHaveAttribute(
        'cy',
        String(cy),
      );
      await expect(activity.locator(`[data-sample-x="${x}"]`)).toHaveAttribute(
        'data-active',
        'true',
      );
    }
    const slider = activity.getByRole('slider');
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(activity.locator('[data-current-y]')).toHaveText(
      fr ? '3,515625' : '3.515625',
    );
    await expect(slider).toBeFocused();
    expect(
      await slider.evaluate((el) => getComputedStyle(el).outlineWidth),
    ).not.toBe('0px');
    await page.keyboard.press('Home');
    await expect(slider).toHaveValue('-2');
    await expect(activity.locator('[data-current-y]')).toHaveText('-9');
    await page.keyboard.press('End');
    await expect(slider).toHaveValue('2');
    await expect(activity.locator('[data-current-y]')).toHaveText('15');
    await expect(page.locator('.katex-error')).toHaveCount(0);
    const summary = page.locator('.l37-correction summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.l37-correction')).toHaveAttribute('open', '');
  });

  test(`${locale}: activities fit mobile and larger viewports`, async ({
    page,
  }) => {
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/lessons/L37/`);
      await expect(page.locator('[data-l37-activity] fieldset')).toHaveCount(3);
      await page
        .locator('[data-l37-activity="graph"]')
        .scrollIntoViewIfNeeded();
      await expect(page.locator('#l37-graph-x')).toBeEnabled();
      await expect(page.locator('.content-provenance')).toContainText(
        'Version 2',
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      for (const img of await page.locator('article img').all()) {
        expect(
          await img.evaluate((el: HTMLImageElement) => el.naturalWidth),
        ).toBeGreaterThan(0);
      }
    }
  });

  test(`${locale}: static teaching and answers work without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 900 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L37/`);
      for (const activity of await page.locator('[data-l37-activity]').all()) {
        await expect(activity.locator('img')).toBeVisible();
        await expect(activity.locator('fieldset')).toBeHidden();
        await expect(activity.locator('[data-static-note]')).toBeVisible();
      }
      const correction = page.locator('.l37-correction');
      await expect(correction).not.toHaveAttribute('open');
      await correction.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(correction).toHaveAttribute('open', '');
      await expect(correction.locator('.katex').first()).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
    } finally {
      await context.close();
    }
  });

  test(`${locale}: React animation pauses and changing the rule updates every representation`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`/${locale}/lessons/L37/`);
    const activity = page.locator('[data-l37-activity="graph"]');
    await activity.scrollIntoViewIfNeeded();
    const play = activity.locator('[data-play]');
    await play.click();
    await expect(play).toHaveAttribute('aria-pressed', 'true');
    await expect(activity.locator('#l37-graph-x')).not.toHaveValue('-2');
    await play.click();
    await expect(play).toHaveAttribute('aria-pressed', 'false');
    const paused = await activity.locator('#l37-graph-x').inputValue();
    await page.waitForTimeout(700);
    await expect(activity.locator('#l37-graph-x')).toHaveValue(paused);
    await activity.locator('[data-input="0"]').click();
    await activity.locator('.l37-theory summary').click();
    const constant = activity.locator('#l37-constant');
    await constant.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(constant).toHaveValue('5');
    await expect(activity.locator('[data-current-y]')).toHaveText('5');
    await expect(activity.locator('thead')).toContainText('F_c(x)');
    await expect(activity.locator('[data-sample-x="2"] td')).toHaveText('17');
    await expect(activity.locator('[data-moving-point]')).toHaveAttribute(
      'cy',
      '147.5',
    );
    await expect(activity.locator('output')).toContainText('F_c(0)');
    await activity.locator('[data-reset-rule]').click();
    await expect(constant).toHaveValue('3');
    await expect(activity.locator('[data-current-y]')).toHaveText('3');
    await expect(activity.locator('thead')).toContainText('f(x)');
    await expect(page.locator('astro-island')).toHaveCount(3);
    expect(errors).toEqual([]);
  });
}

test('reduced motion disables playback and removes transitions, with controls still usable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/fr/lessons/L37/');
  const activity = page.locator('[data-l37-activity="graph"]');
  await activity.scrollIntoViewIfNeeded();
  await expect(activity.locator('[data-play]')).toBeDisabled();
  await activity.locator('[data-input="2"]').click();
  await expect(activity.locator('[data-current-y]')).toHaveText('15');
  expect(
    await activity
      .locator('[data-moving-point]')
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe('0s');
});

test('other reading lessons do not hydrate the L37 panels', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/fr/lessons/L38/');
  await expect(page.locator('astro-island')).toHaveCount(0);
  expect(
    requests.some((url) => /FunctionPanel|react-dom|client\..*\.js/.test(url)),
  ).toBe(false);
});

test('L37 controls support touch and do not intercept page scrolling', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 375, height: 812 },
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/fr/lessons/L37/');
    const activity = page.locator('[data-l37-activity="graph"]');
    await activity.scrollIntoViewIfNeeded();
    await expect(activity.locator('fieldset')).toBeVisible();
    const button = activity.locator('[data-input="2"]');
    await button.tap();
    await expect(activity.locator('[data-current-y]')).toHaveText('15');
    const size = await button.boundingBox();
    expect(size!.height).toBeGreaterThanOrEqual(44);
    expect(size!.width).toBeGreaterThanOrEqual(44);
    expect(
      await activity
        .locator('.l37-plot')
        .evaluate((el) => getComputedStyle(el).touchAction),
    ).toBe('auto');
  } finally {
    await context.close();
  }
});

test('L37 section language switch stays aligned', async ({ page }) => {
  await page.goto('/fr/lessons/L37/#du-calcul-au-graphique');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL('/en/lessons/L37/#from-formulas-to-graphs');
});
