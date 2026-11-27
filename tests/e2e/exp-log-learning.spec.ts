import { expect, test } from '@playwright/test';
import { equationTasks } from '../../src/lib/exp-log-practice';

for (const locale of ['fr', 'en'] as const) {
  for (const lesson of ['L40', 'L41', 'L42'] as const) {
    test(`${locale}: ${lesson} equations explain mistakes, verify and reset`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/lessons/${lesson}/`);
      await expect(page.locator('article h2')).toHaveCount(6);
      const practice = page.locator(`[data-equation-practice="${lesson}"]`);
      await practice.scrollIntoViewIfNeeded();
      for (const task of equationTasks[lesson]) {
        const card = practice.locator(`[data-equation-task="${task.id}"]`);
        const radios = card.getByRole('radio');
        await expect(radios.first()).toBeVisible();
        const check = card.getByRole('button', {
          name: locale === 'fr' ? 'Vérifier' : 'Check',
          exact: true,
        });
        await expect(check).toBeDisabled();
        const wrong = task.choices.findIndex((choice) => !choice.correct);
        await radios.nth(wrong).check();
        await check.click();
        await expect(card.getByRole('status')).toHaveText(
          task.choices[wrong]!.feedback[locale],
        );
        await expect(card.getByRole('status')).toHaveAttribute(
          'data-correct',
          'false',
        );
        const correct = task.choices.findIndex((choice) => choice.correct);
        await radios.nth(correct).focus();
        await page.keyboard.press('Space');
        await check.click();
        await expect(card.getByRole('status')).toHaveAttribute(
          'data-correct',
          'true',
        );
        await card.locator('summary').click();
        await expect(card.locator('details')).toHaveAttribute('open', '');
        await card
          .getByRole('button', {
            name: locale === 'fr' ? 'Recommencer' : 'Reset',
            exact: true,
          })
          .click();
        await expect(check).toBeDisabled();
        await expect(card.locator('details')).not.toHaveAttribute('open');
        await expect(card.getByRole('status')).toBeEmpty();
      }
      await expect(page.locator('.katex-error')).toHaveCount(0);
    });

    test(`${locale}: ${lesson} mobile, optional refreshers and white print`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/lessons/${lesson}/`);
      await expect(page.locator('.c03-refresher')).not.toHaveAttribute('open');
      for (const width of [320, 375, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
      }
      const toggle = page.getByRole('button', {
        name: locale === 'fr' ? 'Thème sombre' : 'Dark theme',
        exact: true,
      });
      await toggle.click();
      await page.emulateMedia({ media: 'print' });
      expect(
        await page.evaluate(
          () => getComputedStyle(document.documentElement).backgroundColor,
        ),
      ).toBe('rgb(255, 255, 255)');
      await expect(
        page.locator('.equation-correction p').first(),
      ).toBeVisible();
      await expect(
        page.locator('.equation-task fieldset').first(),
      ).toBeHidden();
      await expect(page.locator('.c03-revision h2')).toHaveCount(1);
      expect(
        await page
          .locator('.c03-revision')
          .evaluate((el) => getComputedStyle(el).breakBefore),
      ).toBe('page');
    });

    test(`${locale}: ${lesson} equations remain readable without JavaScript`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width: 375, height: 900 },
      });
      try {
        const page = await context.newPage();
        await page.goto(`http://127.0.0.1:4321/${locale}/lessons/${lesson}/`);
        const task = page.locator('.equation-task').first();
        await expect(task.locator('fieldset')).toBeHidden();
        await task.locator('summary').click();
        await expect(task.locator('details p')).toBeVisible();
        await expect(page.locator('.katex-error')).toHaveCount(0);
      } finally {
        await context.close();
      }
    });
  }
  test(`${locale}: L41 shares the reference reflection and L42 retains optional curves`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L41/`);
    const curve = await page
      .locator('.function-inverse-plot .function-curve')
      .getAttribute('d');
    await expect(page.locator('#l41-inverse-title')).toHaveCount(1);
    await page.goto(`/${locale}/cheat-sheet/#functions-explog`);
    await expect(
      page.locator('.function-inverse-plot .function-curve'),
    ).toHaveAttribute('d', curve!);
    await page.goto(`/${locale}/lessons/L42/`);
    const lab = page.locator('[data-l42="complexity"]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('[data-series]')).toHaveCount(4);
    await lab.getByRole('checkbox', { name: '1', exact: true }).check();
    await expect(lab.locator('[data-series]')).toHaveCount(5);
    await expect(
      page.getByRole('heading', {
        name:
          locale === 'fr'
            ? 'Bilan du chapitre — Mélange sans nom de méthode'
            : 'Chapter review — Mixed methods without method labels',
      }),
    ).toBeVisible();
  });
}
