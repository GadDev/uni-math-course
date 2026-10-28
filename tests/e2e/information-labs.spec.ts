import { expect, test, type Page } from '@playwright/test';

async function open(page: Page, lesson: number, locale: string) {
  await page.goto(`/${locale}/lessons/L${lesson}/`);
  const lab = page.locator(`[data-info-lesson="${lesson}"]`);
  await lab.scrollIntoViewIfNeeded();
  await expect(lab).toHaveAttribute('data-ready', 'true');
  return lab.locator('.info-screen');
}

for (const locale of ['fr', 'en']) {
  test(`${locale}: binary capacity, minimum and empty word`, async ({
    page,
  }) => {
    const lab = await open(page, 43, locale);
    const [n, m] = [lab.locator('input').nth(0), lab.locator('input').nth(1)];
    await expect(lab.locator('output')).toContainText('M = 9');
    await expect(lab.locator('output')).toContainText('4 bit(s)');
    await n.fill('4');
    await expect(lab.locator('output')).toContainText('7');
    await m.fill('256');
    await n.fill('8');
    await expect(lab.locator('output')).toContainText('256');
    await expect(lab.locator('.info-words code')).toHaveCount(16);
    await n.fill('0');
    await m.fill('1');
    await expect(lab.locator('.info-words code')).toHaveText('ε');
    await expect(lab.locator('output')).toContainText('0 bit(s)');
    await n.fill('-1');
    await expect(n).toHaveAttribute('aria-invalid', 'true');
    await expect(lab.locator('.info-words')).toHaveCount(0);
    await lab.locator('[data-reset]').click();
    await expect(n).toHaveValue('3');
    await expect(m).toHaveValue('9');
    await n.focus();
    await page.keyboard.press('ArrowUp');
    await expect(n).toHaveValue('4');
    await expect(n).toBeFocused();
    expect(await n.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe(
      'solid',
    );
  });

  test(`${locale}: substitution traces, invalid symbols and epsilon`, async ({
    page,
  }) => {
    const lab = await open(page, 44, locale);
    const input = lab.locator('input');
    await expect(lab.locator('output')).toContainText('0010110');
    await expect(lab.locator('tbody tr')).toHaveCount(4);
    await input.fill('zyx');
    await expect(lab.locator('output')).toContainText('011010');
    await lab.locator('select').selectOption('d');
    await expect(lab.locator('output')).toContainText('11100');
    await input.fill('x y');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(lab.locator('table')).toHaveCount(0);
    await input.fill('');
    await expect(lab.locator('output')).toContainText('ε');
    await expect(lab.locator('output')).toContainText('0 bits');
    await lab.locator('[data-reset]').click();
    await expect(input).toHaveValue('xyzx');
    await expect(lab.locator('select')).toHaveValue('c2');
  });

  test(`${locale}: complete parsings distinguish ambiguity and invalid streams`, async ({
    page,
  }) => {
    const lab = await open(page, 45, locale);
    const input = lab.locator('input');
    await expect(lab.locator('tbody tr')).toHaveCount(2);
    await expect(lab.locator('tbody')).toContainText('zy');
    await lab.locator('select').selectOption('d');
    await input.fill('1');
    await expect(lab.locator('output')).toContainText('0');
    await expect(lab.locator('table')).toHaveCount(0);
    await input.fill('01011');
    await expect(lab.locator('tbody tr')).toHaveCount(1);
    await expect(lab.locator('tbody')).toContainText('xyz');
    await lab.locator('select').selectOption('c2');
    await input.fill('0010110');
    await expect(lab.locator('tbody')).toContainText('xyzx');
    await input.fill('2');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await input.fill('');
    await expect(lab.locator('tbody')).toContainText('ε');
    await lab.locator('[data-reset]').click();
    await expect(lab.locator('tbody tr')).toHaveCount(2);
  });

  test(`${locale}: frequencies recompute the common denominator and reject an empty sample`, async ({
    page,
  }) => {
    const lab = await open(page, 46, locale);
    const inputs = lab.locator('input');
    await inputs.nth(0).fill('7');
    await expect(lab.locator('tbody')).toContainText('3/11');
    await inputs.nth(0).fill('0');
    await expect(lab.locator('tbody')).toContainText('0/4');
    await inputs.nth(1).fill('0');
    await inputs.nth(2).fill('0');
    await expect(lab.locator('output')).toContainText('N = 0');
    await expect(lab.locator('table')).toHaveCount(0);
    await inputs.nth(0).fill('0.5');
    await expect(inputs.nth(0)).toHaveAttribute('aria-invalid', 'true');
    await lab.locator('[data-reset]').click();
    await expect(lab.locator('tbody')).toContainText('6/10');
    await expect(lab.locator('svg rect')).toHaveCount(3);
  });

  test(`${locale}: mean compares identical distributions and retains the ambiguity warning`, async ({
    page,
  }) => {
    const lab = await open(page, 47, locale);
    await expect(lab.locator('output')).toContainText('7/4');
    await lab.locator('select').selectOption('d');
    await expect(lab.locator('output')).toContainText('6/4');
    await lab.locator('select').selectOption('c1');
    await expect(lab.locator('output')).toContainText('9/4');
    await expect(lab.locator('output')).toContainText(
      locale === 'fr' ? 'ambigu' : 'ambiguous',
    );
    await lab.locator('input').first().fill('0');
    await expect(lab.locator('table')).toHaveCount(0);
    await lab.locator('[data-reset]').click();
    await expect(lab.locator('output')).toContainText('7/4');
  });

  test(`${locale}: entropy keyboard control, symmetry and zero endpoints`, async ({
    page,
  }) => {
    const lab = await open(page, 48, locale);
    const slider = lab.locator('input');
    await expect(lab.locator('output')).toContainText(
      locale === 'fr' ? '0,8113' : '0.8113',
    );
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveValue('0.26');
    await lab.getByRole('button', { name: 'p = 1/2', exact: true }).click();
    await expect(slider).toHaveValue('0.5');
    await expect(lab.locator('svg circle')).toHaveAttribute('cx', '220');
    for (const value of ['0', '1']) {
      await lab
        .getByRole('button', { name: `p = ${value}`, exact: true })
        .click();
      await expect(lab.locator('output')).toContainText('≈ 0');
      await expect(lab.locator('tbody')).toContainText(
        locale === 'fr' ? 'non définie' : 'undefined',
      );
      await expect(lab.locator('tbody')).not.toContainText('NaN');
    }
    await lab.locator('[data-reset]').click();
    await expect(slider).toHaveValue('0.25');
  });

  test(`${locale}: Huffman merge order, final code, equal weights, invalid input and reset`, async ({
    page,
  }) => {
    const lab = await open(page, 49, locale);
    const next = lab.locator('[data-step]');
    await expect(lab.locator('output')).toContainText('0/3');
    await next.click();
    await expect(lab.locator('output')).toContainText('C (2) + D (2) = 4');
    await next.click();
    await expect(lab.locator('output')).toContainText('B (4) + CD (4) = 8');
    await next.click();
    await expect(lab.locator('output')).toContainText('A (8) + BCD (8) = 16');
    await expect(lab.locator('tbody')).toContainText('110');
    await expect(lab.locator('p').last()).toContainText('28');
    await expect(next).toBeDisabled();
    await lab.locator('input').first().fill('0');
    await expect(next).toBeDisabled();
    await expect(lab.locator('svg')).toHaveCount(0);
    await lab
      .getByRole('button', {
        name: locale === 'fr' ? 'Poids égaux' : 'Equal weights',
      })
      .click();
    for (let i = 0; i < 3; i++) await next.click();
    await expect(lab.locator('tbody')).toContainText('00');
    await expect(lab.locator('p').last()).toContainText('L ≈ 2');
    await lab.locator('[data-reset]').click();
    await expect(lab.locator('input').first()).toHaveValue('8');
    await expect(lab.locator('output')).toContainText('0/3');
  });

  test(`${locale}: all seven lessons fit phones, label controls and preserve paired anchors`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (let n = 43; n <= 49; n++) {
      const lab = await open(page, n, locale);
      await page.evaluate(() => document.fonts.ready);
      await expect(
        page.locator('astro-island[component-url*="InformationExplorer"]'),
      ).toHaveCount(1);
      await expect(page.locator('.katex-error')).toHaveCount(0);
      if (n === 47) {
        const comparison = page.locator('.lesson-prose > table');
        await expect(comparison).toHaveCount(1);
        await expect(comparison.locator('th')).toHaveCount(4);
        await expect(comparison.locator('tbody tr')).toHaveCount(3);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        `L${n}`,
      ).toBeLessThanOrEqual(320);
      const badLabels = await lab
        .locator('input, select')
        .evaluateAll(
          (controls) =>
            controls.filter(
              (node) => !(node as HTMLInputElement).labels?.length,
            ).length,
        );
      expect(badLabels).toBe(0);
      await expect(lab.locator('[data-reset]')).toBeVisible();
      const resetSize = await lab.locator('[data-reset]').boundingBox();
      expect(resetSize!.height).toBeGreaterThanOrEqual(44);
      const heading = page.locator('.lesson-prose h2').filter({
        hasText: locale === 'fr' ? 'Comment s’en servir' : 'How to use it',
      });
      const anchor = await heading.getAttribute('id');
      await page.goto(`/${locale}/lessons/L${n}/#${anchor}`);
      await page.locator('[data-language-link]').click();
      await expect(page).toHaveURL(
        new RegExp(`/${locale === 'fr' ? 'en' : 'fr'}/lessons/L${n}/#`),
      );
    }
    expect(errors).toEqual([]);
  });

  test(`${locale}: all paper references and corrections work without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
      for (let n = 43; n <= 49; n++) {
        await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L${n}/`);
        const lab = page.locator('.info-lab');
        await expect(lab.locator('.info-static-note')).toBeVisible();
        await expect(lab.locator('fieldset').first()).toBeHidden();
        await page.emulateMedia({ media: 'print', colorScheme: 'dark' });
        await expect(lab.locator('.info-print')).toBeVisible();
        await expect(lab.locator('.info-screen')).toBeHidden();
        for (const detail of await page.locator('.info-answer').all()) {
          const visible = await detail.evaluate((el) => {
            const range = document.createRange();
            range.selectNodeContents(el.lastElementChild!);
            return range.getBoundingClientRect().height > 0;
          });
          expect(visible, `L${n} printed solution`).toBe(true);
        }
        await expect(page.locator('.site-header')).toBeHidden();
        expect(
          await page
            .locator('body')
            .evaluate((el) => getComputedStyle(el).backgroundColor),
        ).toBe('rgb(255, 255, 255)');
        if (n === 49)
          await expect(lab.locator('.info-print tbody')).toContainText('110');
        await page.emulateMedia({ media: 'screen' });
      }
    } finally {
      await context.close();
    }
  });
}

test('print keeps a fixed reference after manipulation without opening screen answers', async ({
  page,
}) => {
  const screen = await open(page, 47, 'fr');
  await screen.locator('input').first().fill('20');
  const before = await screen.locator('output').textContent();
  const detail = page.locator('.info-answer').first();
  await expect(detail).not.toHaveAttribute('open');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.info-print output')).toContainText('7/4');
  await page.emulateMedia({ media: 'screen' });
  await expect(screen.locator('output')).toHaveText(before!);
  await expect(detail).not.toHaveAttribute('open');
});

test('Huffman touch controls and leaf labels remain usable on a dark phone', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 900 },
    isMobile: true,
    hasTouch: true,
    colorScheme: 'dark',
  });
  try {
    const page = await context.newPage();
    const lab = await open(page, 49, 'fr');
    for (let i = 0; i < 3; i++) await lab.locator('[data-step]').tap();
    await expect(lab.locator('output')).toContainText('3/3');
    const overlap = await lab.locator('svg rect').evaluateAll((nodes) => {
      const boxes = nodes.map((node) => node.getBoundingClientRect());
      return boxes.some((a, i) =>
        boxes.some(
          (b, j) =>
            i !== j &&
            Math.abs(a.y - b.y) < 1 &&
            a.x < b.right &&
            b.x < a.right,
        ),
      );
    });
    expect(overlap).toBe(false);
    await lab.locator('[data-reset]').tap();
    await expect(lab.locator('output')).toContainText('0/3');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(375);
  } finally {
    await context.close();
  }
});
