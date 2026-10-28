import { test, expect, type Locator, type Page } from '@playwright/test';

async function lab(page: Page, kind: string) {
  const region = page.locator(`[data-lab="${kind}"]`);
  await region.scrollIntoViewIfNeeded();
  await expect(region).toHaveAttribute('data-ready', 'true');
  return region;
}
async function values(region: Locator, bits: string) {
  for (const [index, value] of [...bits].entries()) {
    await region
      .getByRole('combobox', { name: new RegExp(`^${'ABC'[index]} —`) })
      .selectOption(value);
  }
}
const columns: Record<string, string> = {
  nested: '0010',
  'commute-and': '0001',
  'commute-or': '0111',
  'associate-and': '00000001',
  'associate-or': '01111111',
  double: '01',
  excluded: '11',
  contradiction: '00',
  'not-and': '1110',
  'not-or': '1000',
  'and-over-or': '00000111',
  'or-over-and': '00011111',
};
for (const locale of ['fr', 'en']) {
  test(`${locale}: all supported rewrites show independently correct complete tables`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`/${locale}/lessons/L04/`);
    for (const kind of ['rewrite', 'morgan', 'distribute']) {
      const region = await lab(page, kind);
      const choice = region.locator(`#l04-${kind}-law`);
      const ids = await choice
        .locator('option')
        .evaluateAll((options) =>
          options.map((o) => (o as HTMLOptionElement).value),
        );
      for (const id of ids) {
        await choice.selectOption(id);
        const rows = region.locator('.l04-screen tbody tr');
        await expect(rows).toHaveCount(columns[id]!.length);
        expect(
          (await rows.locator('[data-left]').allTextContents()).join(''),
        ).toBe(columns[id]);
        expect(
          (await rows.locator('[data-right]').allTextContents()).join(''),
        ).toBe(columns[id]);
        await expect(region.locator('[data-global]')).toContainText(
          locale === 'fr' ? 'accord sur toutes' : 'agreement on every',
        );
      }
    }
    await expect(page.locator('.katex-error')).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test(`${locale}: both De Morgan laws update every assignment and expose the wrong connective`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L04/`);
    const region = await lab(page, 'morgan');
    for (const id of ['not-and', 'not-or']) {
      await region.locator('#l04-morgan-law').selectOption(id);
      for (let n = 0; n < 4; n++) {
        const bits = n.toString(2).padStart(2, '0');
        await values(region, bits);
        await expect(
          region.locator('.l04-screen [data-current="true"]'),
        ).toHaveAttribute('data-row', bits);
        await expect(region.locator('[data-local]')).toContainText(
          `G = ${columns[id]![n]} ; D = ${columns[id]![n]}`,
        );
      }
      await region.getByRole('checkbox').check();
      await expect(region.locator('[data-global]')).toContainText(
        locale === 'fr' ? 'Pas d’équivalence' : 'Not equivalent',
      );
      await region
        .getByRole('button', {
          name:
            locale === 'fr'
              ? 'Afficher ce contre-exemple'
              : 'Show this counterexample',
        })
        .click();
      await expect(region.locator('[data-local]')).toContainText(
        locale === 'fr' ? 'Valeurs différentes' : 'Different values',
      );
      const current = region.locator('.l04-screen [data-current="true"]');
      expect(await current.locator('[data-left]').textContent()).not.toBe(
        await current.locator('[data-right]').textContent(),
      );
    }
  });

  test(`${locale}: both distributions work in reverse and reset independently`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L04/`);
    const region = await lab(page, 'distribute');
    for (const id of ['and-over-or', 'or-over-and']) {
      await region.locator('#l04-distribute-law').selectOption(id);
      for (let n = 0; n < 8; n++) {
        const bits = n.toString(2).padStart(3, '0');
        await values(region, bits);
        await expect(region.locator('[data-local]')).toContainText(
          `G = ${columns[id]![n]} ; D = ${columns[id]![n]}`,
        );
      }
      const left = await region.locator('[data-expression-left]').textContent();
      const right = await region
        .locator('[data-expression-right]')
        .textContent();
      await region.locator('#l04-distribute-direction').selectOption('reverse');
      await expect(region.locator('[data-expression-left]')).toHaveText(
        `G : ${right!.slice(4)}`,
      );
      await expect(region.locator('[data-expression-right]')).toHaveText(
        `D : ${left!.slice(4)}`,
      );
      await region.getByRole('checkbox').check();
      await expect(region.locator('[data-counterexample]')).toBeVisible();
    }
    await region
      .getByRole('button', {
        name: locale === 'fr' ? 'Réinitialiser' : 'Reset',
        exact: true,
      })
      .click();
    await expect(region.locator('#l04-distribute-law')).toHaveValue(
      'and-over-or',
    );
    await expect(region.locator('#l04-distribute-direction')).toHaveValue(
      'forward',
    );
    await expect(region.getByRole('checkbox')).not.toBeChecked();
    await expect(
      region.locator('.l04-screen [data-current="true"]'),
    ).toHaveAttribute('data-row', '101');
    const morgan = await lab(page, 'morgan');
    await expect(
      morgan.locator('.l04-screen [data-current="true"]'),
    ).toHaveAttribute('data-row', '10');
  });

  test(`${locale}: keyboard, focus and native solution disclosures work`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L04/`);
    const region = await lab(page, 'rewrite');
    const input = region.getByRole('combobox', { name: /^A —/ });
    await input.focus();
    await page.keyboard.press('Home');
    await expect(input).toHaveValue('0');
    await expect(input).toBeFocused();
    expect(
      await input.evaluate((e) => getComputedStyle(e).outlineStyle),
    ).not.toBe('none');
    await page.keyboard.press('End');
    await expect(input).toHaveValue('1');
    const summary = region.locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(region.locator('details')).toHaveAttribute('open', '');
    await page.keyboard.press('Space');
    await expect(region.locator('details')).not.toHaveAttribute('open');
    const table = region.locator('.l04-screen .l04-table-wrap');
    await table.focus();
    await expect(table).toBeFocused();
  });

  test(`${locale}: mobile, themes and print retain readable content and fixed examples`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L04/`);
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value;
        }, theme);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
          `${width}/${theme}`,
        ).toBeLessThanOrEqual(width);
        for (const kind of ['rewrite', 'morgan', 'distribute']) {
          const region = await lab(page, kind);
          for (const control of await region
            .locator('.l04-controls select, .l04-controls button')
            .all()) {
            expect(
              (await control.boundingBox())!.height,
            ).toBeGreaterThanOrEqual(44);
          }
        }
      }
    }
    const region = await lab(page, 'morgan');
    await region.getByRole('checkbox').check();
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.site-header')).toBeHidden();
    await expect(region.locator('.l04-screen')).toBeHidden();
    await expect(region.locator('.l04-print-example')).toBeVisible();
    await expect(region.locator('.l04-print-example')).not.toContainText(
      locale === 'fr' ? 'Pas d’équivalence' : 'Not equivalent',
    );
    const solution = page.locator('article > details.l04-solution').first();
    await expect(solution).not.toHaveAttribute('open');
    expect(
      await solution
        .locator('ol')
        .evaluate((e) => e.getBoundingClientRect().height),
    ).toBeGreaterThan(20);
    await expect(page.locator('.l04-revision')).toBeVisible();
  });

  test(`${locale}: public lesson is useful at 320px with JavaScript disabled`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 900 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L04/`);
      for (const kind of ['rewrite', 'morgan', 'distribute']) {
        const region = page.locator(`[data-lab="${kind}"]`);
        await expect(region.locator('.l04-controls').first()).toBeHidden();
        await expect(region.locator('.l04-screen table')).toBeVisible();
        await region.locator('summary').click();
        await expect(region.locator('details ol')).toBeVisible();
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
    } finally {
      await context.close();
    }
  });
}

test('touch and reduced motion preserve controls, and L03 has no Boolean hydration', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 375, height: 812 },
    reducedMotion: 'reduce',
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/fr/lessons/L04/');
    const region = await lab(page, 'morgan');
    await region.getByRole('checkbox').tap();
    await expect(region.locator('[data-counterexample]')).toBeVisible();
    await region.getByRole('button', { name: 'Réinitialiser' }).tap();
    await expect(region.getByRole('checkbox')).not.toBeChecked();
    await page.goto('http://127.0.0.1:4321/fr/lessons/L03/');
    await expect(page.locator('astro-island')).toHaveCount(0);
    await expect(page.locator('script[src*="BooleanLab"]')).toHaveCount(0);
  } finally {
    await context.close();
  }
});
