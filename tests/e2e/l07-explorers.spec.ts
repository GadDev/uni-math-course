import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  const fr = locale === 'fr';
  test(`${locale}: L07 derives all four biconditional rows and supports the keyboard`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L07/`);
    const lab = page.locator('[data-l07-lab="row"]');
    await lab.scrollIntoViewIfNeeded();
    const live = lab.locator('.l07-live');
    const a = live.getByLabel(fr ? 'Valeur de A' : 'Value of A');
    const b = live.getByLabel(fr ? 'Valeur de B' : 'Value of B');
    await expect(a).toBeVisible();
    for (const [x, y, forward, backward, result] of [
      [0, 0, 1, 1, 1],
      [0, 1, 1, 0, 0],
      [1, 0, 0, 1, 0],
      [1, 1, 1, 1, 1],
    ]) {
      await a.selectOption(String(x));
      await b.selectOption(String(y));
      await expect(live.locator('[data-row-result]')).toContainText(
        `= ${forward} ∧ ${backward} = ${result}`,
      );
      await expect(live.locator('svg title')).toContainText(
        `A ⇔ B = ${result}`,
      );
      await expect(live.locator('tr[aria-current="true"]')).toHaveText(
        `${x}${y}${forward}${backward}${result}`,
      );
    }
    await live
      .getByRole('button', { name: fr ? 'Réinitialiser' : 'Reset' })
      .click();
    await expect(a).toHaveValue('0');
    await expect(b).toHaveValue('0');
    await a.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(a).toHaveValue('1');
    await expect(a).toBeFocused();
    expect(
      await a.evaluate((el) => getComputedStyle(el).outlineWidth),
    ).not.toBe('0px');
    await expect(live.locator('[data-row-result]')).toContainText(
      '= 0 ∧ 1 = 0',
    );
    await expect(page.locator('.katex-error')).toHaveCount(0);
  });

  test(`${locale}: L07 separates incomplete evidence, counterexamples and complete proof`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L07/`);
    const lab = page.locator('[data-l07-lab="equivalence"]');
    await lab.scrollIntoViewIfNeeded();
    const live = lab.locator('.l07-live');
    await expect(live.locator('[data-evidence]')).toHaveAttribute(
      'data-evidence',
      'incomplete',
    );
    await expect(live.locator('[data-evidence]')).toContainText('1/4');
    await expect(live.locator('tbody tr[data-examined="false"]')).toHaveCount(
      3,
    );
    await live.locator('[data-examine="3"]').focus();
    await page.keyboard.press('Enter');
    await expect(live.locator('[data-evidence]')).toHaveAttribute(
      'data-evidence',
      'incomplete',
    );
    await live.locator('[data-examine="1"]').click();
    await expect(live.locator('[data-evidence]')).toHaveAttribute(
      'data-evidence',
      'refuted',
    );
    await expect(live.locator('[data-evidence]')).toContainText(
      'A = 0, B = 1, P = 1',
    );
    const select = live.getByRole('combobox');
    for (const pair of ['implication', 'deMorgan', 'doubleNegation']) {
      await select.selectOption(pair);
      await expect(live.locator('[data-evidence]')).toHaveAttribute(
        'data-evidence',
        'incomplete',
      );
      await expect(live.locator('[data-evidence]')).toContainText('1/4');
      for (const row of [0, 0, 3, 1])
        await live.locator(`[data-examine="${row}"]`).click();
      await expect(live.locator('[data-evidence]')).toContainText('3/4');
      await expect(live.locator('[data-evidence]')).toHaveAttribute(
        'data-evidence',
        'incomplete',
      );
      await live.locator('[data-examine="2"]').click();
      await expect(live.locator('[data-evidence]')).toHaveAttribute(
        'data-evidence',
        'proved',
      );
      await expect(live.locator('tbody tr[data-examined="false"]')).toHaveCount(
        0,
      );
    }
    await select.selectOption('wrongMorgan');
    await live.locator('[data-examine="2"]').click();
    await expect(live.locator('[data-evidence]')).toHaveAttribute(
      'data-evidence',
      'refuted',
    );
    await live
      .getByRole('button', { name: fr ? 'Réinitialiser' : 'Reset' })
      .click();
    await expect(select).toHaveValue('converse');
    await expect(live.locator('[data-evidence]')).toHaveAttribute(
      'data-evidence',
      'incomplete',
    );
    await expect(live.locator('[data-evidence]')).toContainText('1/4');
  });

  test(`${locale}: L07 retains public reading, diagrams and solutions without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 900 },
    });
    const page = await context.newPage();
    try {
      await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L07/`);
      await expect(page.locator('.l07-static')).toHaveCount(2);
      for (const example of await page.locator('.l07-static').all())
        await expect(example).toBeVisible();
      await expect(page.locator('.l07-live:visible')).toHaveCount(0);
      await expect(
        page.locator('[data-l07-lab="row"] .l07-static svg'),
      ).toHaveAccessibleName(/A = 0, B = 0/);
      const solution = page.locator('.l07-exercise').nth(1);
      await solution.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(solution).toHaveAttribute('open', '');
      await expect(solution.locator('p')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
      await page.emulateMedia({ media: 'print' });
      // Closed native details must still print their complete content.
      await expect(
        page.locator('.l07-exercise').nth(3).locator('table'),
      ).toBeVisible();
    } finally {
      await context.close();
    }
  });

  test(`${locale}: L07 fits narrow screens, dark mode and static print after manipulation`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    await page.goto(`/${locale}/lessons/L07/`);
    for (const lab of await page.locator('[data-l07-lab]').all()) {
      await lab.scrollIntoViewIfNeeded();
      await expect(lab.locator('.l07-live')).toBeVisible();
      for (const control of await lab
        .locator('.l07-live')
        .getByRole('button')
        .all()) {
        const box = await control.boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
    await page
      .locator('[data-l07-lab="row"] .l07-live select')
      .first()
      .selectOption('1');
    await page
      .locator('[data-l07-lab="equivalence"] .l07-live select')
      .selectOption('doubleNegation');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.l07-live:visible')).toHaveCount(0);
    await expect(page.locator('.l07-static:visible')).toHaveCount(2);
    await expect(
      page.locator('[data-l07-lab="row"] .l07-static [data-row-result]'),
    ).toContainText('= 1 ∧ 1 = 1');
    await expect(
      page.locator(
        '[data-l07-lab="equivalence"] .l07-static [data-pair-formulas]',
      ),
    ).toHaveText('P = A ⇒ B ; Q = B ⇒ A');
    await expect(page.locator('.l07-prediction:visible')).toHaveCount(0);
    await expect(page.locator('.course-outline')).not.toBeVisible();
    await expect(
      page.locator('.l07-exercise').nth(7).locator('p'),
    ).toBeVisible();
  });

  test(`${locale}: L07 preserves the existing section anchors across language switching`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L07/`);
    await page
      .locator('.section-nav')
      .getByRole('link', {
        name: fr ? 'Deux niveaux différents' : 'Two different levels',
        exact: true,
      })
      .click();
    const other = fr ? 'en' : 'fr';
    await page
      .getByRole('link', { name: other.toUpperCase(), exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${other}/lessons/L07/#`));
    await expect(
      page.getByRole('heading', {
        name: fr ? 'Two different levels' : 'Deux niveaux différents',
        exact: true,
      }),
    ).toBeInViewport();
  });
}
