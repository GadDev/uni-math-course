import { test, expect } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`${locale}: card and negation explorers evaluate all four assignments independently`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`/${locale}/lessons/L05/`);
    const cards = page.locator('[data-logic-lab="cards"]');
    const negation = page.locator('[data-logic-lab="negation"]');
    await expect(cards.locator('[data-a]')).toBeEnabled();
    for (const [a, b, implication, failure, operands] of [
      [0, 0, 1, 0, 1],
      [0, 1, 1, 0, 0],
      [1, 0, 0, 1, 1],
      [1, 1, 1, 0, 1],
    ]) {
      for (const lab of [cards, negation]) {
        await lab.locator('[data-a]').selectOption(String(a));
        await lab.locator('[data-b]').selectOption(String(b));
      }
      await expect(cards.locator('[data-calculation]')).toHaveText(
        `¬A ∨ B = ${1 - a!} ∨ ${b} = ${implication}`,
      );
      await expect(negation.locator('[data-negation]')).toContainText(
        `(${failure})`,
      );
      await expect(negation.locator('[data-operands]')).toContainText(
        `(${operands})`,
      );
      await expect(page.locator('tr[aria-current]')).toHaveCount(1);
      await expect(page.locator('tr[aria-current] td').first()).toHaveText(
        String(a),
      );
      await expect(page.locator('tr[aria-current] td').nth(1)).toHaveText(
        String(b),
      );
    }
    // The two experiments keep their own input state.
    await cards.locator('[data-a]').selectOption('0');
    await expect(negation.locator('[data-a]')).toHaveValue('1');
    expect(errors).toEqual([]);
  });

  test(`${locale}: number explorer includes strict boundaries and every reciprocal counterexample`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L05/`);
    const lab = page.locator('[data-number-lab]');
    const slider = lab.getByRole('slider');
    await expect(slider).toBeEnabled();
    await slider.focus();
    await page.keyboard.press('Home');
    const failures: number[] = [];
    for (let n = 0; n <= 15; n++) {
      await expect(slider).toHaveValue(String(n));
      const result = lab.locator('[data-number-result]');
      await expect(result).toContainText(`n = ${n}`);
      await expect(result).toContainText(
        `A ⇒ B ${locale === 'fr' ? 'vaut' : 'is'} 1`,
      );
      const converseFails = n >= 6 && n <= 10;
      await expect(result).toContainText(
        `B ⇒ A ${locale === 'fr' ? 'vaut' : 'is'} ${converseFails ? 0 : 1}`,
      );
      if (converseFails) failures.push(n);
      await expect(lab.locator('[data-marker]')).toHaveAttribute(
        'x1',
        String(30 + n * 28),
      );
      if (n < 15) await page.keyboard.press('ArrowRight');
    }
    expect(failures).toEqual([6, 7, 8, 9, 10]);
    await page.keyboard.press('End');
    await expect(slider).toHaveValue('15');
    await page.keyboard.press('Home');
    await expect(lab.locator('output')).toHaveText('0');
  });

  test(`${locale}: controls and step reveals support keyboard, labels and visible focus`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L05/`);
    const select = page.locator('[data-logic-lab="cards"] [data-a]');
    await expect(select).toHaveAccessibleName(
      locale === 'fr' ? 'Couleur — valeur de A' : 'Colour — value of A',
    );
    await expect(select).toBeEnabled();
    await select.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(select).toHaveValue('1');
    expect(
      await select.evaluate(
        (element) => getComputedStyle(element).outlineWidth,
      ),
    ).not.toBe('0px');
    const step = page.locator('.implication-lab details').nth(1);
    await step.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(step).toHaveAttribute('open', '');
    await page.keyboard.press('Space');
    await expect(step).not.toHaveAttribute('open');
    await expect(step.locator('summary')).toBeFocused();
  });

  test(`${locale}: diagrams and controls fit mobile and both colour schemes`, async ({
    page,
  }) => {
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme });
      for (const width of [320, 375, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/${locale}/lessons/L05/`);
        await expect(page.locator('[data-number-lab] input')).toBeEnabled();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
        await expect(page.locator('.katex-error')).toHaveCount(0);
        const diagram = page.locator('img[src*="L05-cards"]');
        expect(
          await diagram.evaluate(
            (element) => (element as HTMLImageElement).naturalWidth,
          ),
        ).toBeGreaterThan(0);
        for (const control of await page
          .locator('.implication-lab :is(select,input,summary)')
          .all()) {
          const box = await control.boundingBox();
          expect(box!.height).toBeGreaterThanOrEqual(44);
          expect(box!.x).toBeGreaterThanOrEqual(0);
          expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        }
      }
    }
  });

  test(`${locale}: complete explanations and native steps remain available without JavaScript`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 900 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L05/`);
      await expect(page.locator('.lesson-prose tbody tr')).toHaveCount(4);
      await expect(page.locator('[data-number-lab] output')).toHaveText('8');
      await expect(page.locator('[data-number-lab] input')).toBeDisabled();
      const step = page.locator('.implication-lab details').first();
      await step.locator('summary').click();
      await expect(step.locator('p')).toBeVisible();
      await expect(page.locator('noscript').first()).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
    } finally {
      await context.close();
    }
  });
}

test('only L05 loads its exploration script; no React hydration is added to reading', async ({
  page,
}) => {
  for (const lesson of ['L05', 'L04']) {
    await page.goto(`/fr/lessons/${lesson}/`);
    await expect(page.locator('astro-island')).toHaveCount(0);
    // Astro can inline small modules; inspect both inline and external code.
    const scripts = await page.locator('script').evaluateAll((elements) =>
      elements.map((element) => ({
        src: (element as HTMLScriptElement).src,
        text: element.textContent ?? '',
      })),
    );
    const bodies = await Promise.all(
      scripts.map(async (script) =>
        script.src ? (await page.request.get(script.src)).text() : script.text,
      ),
    );
    expect(
      bodies.filter((body) => body.includes('data-logic-lab')),
    ).toHaveLength(lesson === 'L05' ? 1 : 0);
  }
});
