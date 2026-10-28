import { test, expect } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  const fr = locale === 'fr';
  const decimal = (value: number) => String(value).replace('.', fr ? ',' : '.');

  test(`L38 secant: both sides, zero, keyboard and reset (${locale})`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`/${locale}/lessons/L38/`);
    const activity = page.locator('[data-l38-explorer="secant"]');
    await activity.scrollIntoViewIfNeeded();
    await activity.locator('[data-h="0.1"]').click();
    await expect(activity.locator('[data-secant-value]')).toHaveText(
      decimal(1.05),
    );
    await activity.locator('[data-h="-0.1"]').click();
    await expect(activity.locator('[data-secant-value]')).toHaveText(
      decimal(0.95),
    );
    await activity.locator('[data-h="0"]').click();
    await expect(activity.locator('[data-secant-value]')).toContainText(
      fr ? 'non définie' : 'undefined',
    );
    await expect(activity.locator('[data-secant]')).toHaveCount(0);
    await expect(activity.locator('[data-tangent]')).toHaveCount(1);
    await expect(activity.locator('[data-zero-explanation]')).toContainText(
      '0/0',
    );
    const slider = activity.locator('[data-control="h"]');
    await slider.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(activity.locator('[data-h-value]')).toHaveText(decimal(-0.01));
    await activity.locator('[data-reset]').click();
    await expect(activity.locator('[data-h-value]')).toHaveText('2');
    expect(errors).toEqual([]);
  });

  test(`L38 tangent anchor and synchronized function/derivative/controls (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L38/`);
    const activity = page.locator('[data-l38-explorer="tangent"]');
    await activity.scrollIntoViewIfNeeded();
    await activity.locator('[data-square]').click();
    await expect(activity.locator('[data-y0]')).toHaveText('1');
    await expect(activity.locator('[data-slope]')).toHaveText('2');
    await expect(activity.locator('[data-tangent-equation]')).toHaveText(
      'y ≈ 2x − 1',
    );
    const derivativePath = await activity
      .locator('[data-plot="derivative"] [data-curve]')
      .getAttribute('d');
    const originalCurve = await activity
      .locator('[data-plot="function"] [data-curve]')
      .getAttribute('d');
    await activity.locator('[data-number="c"]').fill('2');
    await expect(activity.locator('[data-control="c"]')).toHaveValue('2');
    await expect(activity.locator('[data-y0]')).toHaveText('3');
    await expect(activity.locator('[data-slope]')).toHaveText('2');
    await expect(activity.locator('[data-tangent-equation]')).toHaveText(
      'y ≈ 2x + 1',
    );
    expect(
      await activity
        .locator('[data-plot="derivative"] [data-curve]')
        .getAttribute('d'),
    ).toBe(derivativePath);
    expect(
      await activity
        .locator('[data-plot="function"] [data-curve]')
        .getAttribute('d'),
    ).not.toBe(originalCurve);
    await activity.locator('[data-number="b"]').fill('-2');
    await activity.locator('[data-number="x0"]').fill('1');
    await expect(activity.locator('[data-slope]')).toHaveText('0');
    await expect(activity.locator('[data-derivative-formula]')).toHaveText(
      '2x − 2',
    );
    const points = await activity
      .locator('[data-point]')
      .evaluateAll((nodes) =>
        nodes.map((node) => Number(node.getAttribute('cx'))),
      );
    expect(points).toHaveLength(2);
    expect(points[0]).toBe(points[1]);
    await activity.locator('[data-number="a"]').fill('-1');
    await activity.locator('[data-number="x0"]').fill('-1');
    await expect(activity.locator('[data-slope]')).toHaveText('0');
    await activity.locator('[data-number="a"]').fill('0');
    await expect(activity.locator('[data-family]')).toContainText(
      fr ? 'affine' : 'affine',
    );
    await expect(activity.locator('[data-slope]')).toHaveText('-2');
    await activity.locator('[data-number="b"]').fill('0');
    await expect(activity.locator('[data-slope]')).toHaveText('0');
    await expect(activity.locator('[data-tangent-equation]')).toHaveText(
      'y ≈ 2',
    );
    await activity.locator('[data-number="c"]').fill('0');
    await expect(activity.locator('[data-tangent-equation]')).toHaveText(
      'y ≈ 0',
    );
    const overflowingLabels = await activity
      .locator('svg text')
      .evaluateAll((nodes) =>
        nodes
          .map((node) => {
            const bounds = (node as SVGTextElement).getBBox();
            return { text: node.textContent, x: bounds.x, width: bounds.width };
          })
          .filter((label) => label.x < 0 || label.x + label.width > 480),
      );
    expect(overflowingLabels).toEqual([]);
    await activity.locator('[data-reset]').click();
    await expect(activity.locator('[data-y0]')).toHaveText(decimal(0.5));
    await expect(activity.locator('[data-control="a"]')).toHaveValue('0.5');
  });

  test(`L38 keyboard, validation and focus (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/lessons/L38/`);
    const activity = page.locator('[data-l38-explorer="tangent"]');
    await activity.scrollIntoViewIfNeeded();
    const range = activity.locator('[data-control="a"]');
    await expect(range).toBeEnabled();
    await range.focus();
    await expect(range).toBeFocused();
    expect(
      await range.evaluate((el) => getComputedStyle(el).outlineStyle),
    ).toBe('solid');
    await page.keyboard.press('Home');
    await expect(activity.locator('[data-number="a"]')).toHaveValue('-2');
    await page.keyboard.press('End');
    await expect(activity.locator('[data-number="a"]')).toHaveValue('2');
    await page.keyboard.press('ArrowLeft');
    await expect(activity.locator('[data-number="a"]')).toHaveValue('1.9');
    const input = activity.locator('[data-number="a"]');
    await input.fill('99');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(range).toHaveValue('1.9');
    await input.press('Tab');
    await expect(input).toHaveValue('1.9');
    await expect(activity.locator('.l38-values')).not.toContainText('NaN');
    for (const locator of await activity.locator('input').all()) {
      await expect(locator).toHaveAccessibleName(/\S/);
      expect((await locator.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
  });

  test(`L38 mobile widths, readable diagrams and math (${locale})`, async ({
    page,
  }) => {
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/lessons/L38/`);
      for (const activity of await page.locator('[data-l38-explorer]').all()) {
        await activity.scrollIntoViewIfNeeded();
        expect(
          await activity.evaluate((el) => el.scrollWidth <= el.clientWidth),
        ).toBe(true);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await expect(page.locator('.katex-error')).toHaveCount(0);
    }
  });

  test(`L38 works as a static lesson without JavaScript (${locale})`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 375, height: 812 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L38/`);
      await expect(page.locator('[data-plot]')).toHaveCount(3);
      await expect(page.locator('[data-static-note]:visible')).toHaveCount(2);
      await expect(
        page.locator('[data-l38-explorer] fieldset:visible'),
      ).toHaveCount(0);
      await expect(page.locator('.l38-memo')).toHaveCount(4);
      await page.locator('.l38-correction summary').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('.l38-correction')).toHaveAttribute('open', '');
      await expect(page.locator('.l38-correction')).toContainText('2x');
    } finally {
      await context.close();
    }
  });
}

test('L38 matching language anchors and isolated hydration', async ({
  page,
}) => {
  await page.goto('/fr/lessons/L38/');
  await expect(page.locator('astro-island')).toHaveCount(2);
  const frHeadings = await page.locator('.lesson-prose h2').count();
  const anchor = await page
    .locator('.lesson-prose h2')
    .nth(5)
    .getAttribute('id');
  await page.goto(`/fr/lessons/L38/#${anchor}`);
  await page.locator('a[hreflang="en"]').click();
  await expect(page).toHaveURL(/\/en\/lessons\/L38\/#/);
  await expect(page.locator('.lesson-prose h2')).toHaveCount(frHeadings);
  await page.goto('/fr/lessons/L39/');
  await expect(page.locator('[data-l38-explorer]')).toHaveCount(0);
  await expect(
    page.locator('astro-island[component-url*="DerivativeExplorer"]'),
  ).toHaveCount(0);
  await expect(page.locator('[data-l39-panel]')).toHaveCount(2);
});

test('L38 touch controls and dark theme preserve interaction', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 375, height: 812 },
    colorScheme: 'dark',
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/fr/lessons/L38/');
    const activity = page.locator('[data-l38-explorer="tangent"]');
    await activity.scrollIntoViewIfNeeded();
    await activity.locator('[data-square]').tap();
    await expect(activity.locator('[data-slope]')).toHaveText('2');
    await activity.locator('[data-reset]').tap();
    await expect(activity.locator('[data-slope]')).toHaveText('1');
    expect(
      await activity
        .locator('svg')
        .first()
        .evaluate((el) => getComputedStyle(el).touchAction),
    ).toBe('auto');
  } finally {
    await context.close();
  }
});
