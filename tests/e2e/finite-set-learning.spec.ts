import { expect, test } from '@playwright/test';
const lessons = ['L11', 'L12', 'L13', 'L14', 'L15'] as const;
const initialTruth = { L11: false, L12: true, L13: true, L14: true, L15: true };
const emptyTruth = {
  L11: true,
  L12: false,
  L13: false,
  L14: false,
  L15: false,
};

for (const locale of ['fr', 'en'] as const) {
  for (const lesson of lessons) {
    test(`${locale}: ${lesson} predicts, changes domain, handles empty sets and resets`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/lessons/${lesson}/`);
      await expect(page.locator('article h2')).toHaveCount(6);
      const lab = page.locator(`[data-finite-lab="${lesson}"]`);
      await lab.scrollIntoViewIfNeeded();
      const prediction = lab.locator(`#${lesson}-prediction`);
      await expect(prediction).toBeVisible();
      const check = lab.getByRole('button', {
        name: locale === 'fr' ? 'Vérifier' : 'Check',
        exact: true,
      });
      await expect(check).toBeDisabled();
      await prediction.selectOption(String(!initialTruth[lesson]));
      await check.click();
      await expect(lab.getByRole('status')).toContainText(
        locale === 'fr' ? 'À revoir' : 'Try again',
      );
      await prediction.selectOption(String(initialTruth[lesson]));
      await check.click();
      await expect(lab.getByRole('status')).toContainText(
        locale === 'fr' ? 'Exact' : 'Correct',
      );
      await expect(lab.locator('[data-finite-results]')).toBeVisible();
      await lab.locator(`#${lesson}-domain`).selectOption('2');
      await expect(lab.getByRole('status')).toBeEmpty();
      await expect(prediction).toHaveValue('');
      await prediction.selectOption(String(emptyTruth[lesson]));
      await check.click();
      await expect(lab.getByRole('status')).toContainText(
        locale === 'fr' ? 'Exact' : 'Correct',
      );
      if (lesson === 'L14')
        await expect(lab.locator('[data-finite-result]')).toContainText(
          '|𝒫(A)| = 1',
        );
      else await expect(lab.locator('tbody tr')).toHaveCount(0);
      if (lesson === 'L11' || lesson === 'L12') {
        await lab.locator(`#${lesson}-quantifier`).selectOption('some');
        await prediction.selectOption(String(lesson === 'L12'));
        await check.click();
        await expect(lab.getByRole('status')).toContainText(
          locale === 'fr' ? 'Exact' : 'Correct',
        );
      }
      await lab
        .getByRole('button', {
          name: locale === 'fr' ? 'Recommencer' : 'Reset',
          exact: true,
        })
        .click();
      await expect(check).toBeDisabled();
      await expect(lab.locator(`#${lesson}-domain`)).toHaveValue('0');
      await expect(lab.getByRole('status')).toBeEmpty();
      await expect(page.locator('.katex-error')).toHaveCount(0);
    });

    test(`${locale}: ${lesson} mobile, dark print and named subsection links`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/lessons/${lesson}/`);
      for (const width of [320, 375, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
      }
      const oldHeading = page.getByRole('heading', {
        name: locale === 'fr' ? 'Votre objectif' : 'Your objective',
        exact: true,
      });
      const slug = await oldHeading.getAttribute('id');
      await page.goto(`/${locale}/lessons/${lesson}/#${slug}`);
      await page
        .getByRole('link', { name: locale === 'fr' ? 'EN' : 'FR', exact: true })
        .click();
      await expect(page).toHaveURL(
        new RegExp(`/${locale === 'fr' ? 'en' : 'fr'}/lessons/${lesson}/#`),
      );
      await page
        .getByRole('button', {
          name: locale === 'fr' ? 'Dark theme' : 'Thème sombre',
          exact: true,
        })
        .click();
      await page.emulateMedia({ media: 'print' });
      expect(
        await page
          .locator('html')
          .evaluate((el) => getComputedStyle(el).backgroundColor),
      ).toBe('rgb(255, 255, 255)');
      await expect(page.locator('.finite-lab fieldset')).toBeHidden();
      await expect(page.locator('.finite-static p').first()).toBeVisible();
      await expect(page.locator('.sets-correction p').first()).toBeVisible();
      await expect(page.locator('.sets-revision h2')).toHaveCount(1);
      expect(
        await page
          .locator('.sets-revision')
          .evaluate((el) => getComputedStyle(el).breakBefore),
      ).toBe('page');
    });

    test(`${locale}: ${lesson} figures and paper corrections work without JavaScript`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width: 320, height: 900 },
      });
      try {
        const page = await context.newPage();
        await page.goto(`http://127.0.0.1:4321/${locale}/lessons/${lesson}/`);
        const lab = page.locator('.finite-lab');
        await expect(lab.locator('fieldset')).toBeHidden();
        await expect(lab.locator('[data-finite-results]')).toBeVisible();
        const solution = page.locator('.sets-correction').first();
        await solution.locator('summary').focus();
        await page.keyboard.press('Enter');
        await expect(solution).toHaveAttribute('open', '');
        for (const img of await page.locator('article img').all()) {
          await expect(img).toHaveAttribute('alt', /.+/);
          expect(
            await img.evaluate((el: HTMLImageElement) => el.naturalWidth),
          ).toBeGreaterThan(0);
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(320);
      } finally {
        await context.close();
      }
    });
  }
  test(`${locale}: ambient-set and operation changes clear predictions and retain relative complements`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L15/`);
    const lab = page.locator('.finite-lab');
    await lab.scrollIntoViewIfNeeded();
    await lab.locator('#L15-domain').selectOption('1');
    await lab.locator('#L15-target').selectOption('4');
    await lab.locator('#L15-prediction').selectOption('true');
    await lab
      .getByRole('button', {
        name: locale === 'fr' ? 'Vérifier' : 'Check',
        exact: true,
      })
      .click();
    await expect(lab.locator('[data-finite-result]')).toContainText(
      'C ∖ (A ∪ B) = {3, 4}',
    );
    await lab.locator('#L15-operation').selectOption('intersection');
    await expect(lab.getByRole('status')).toBeEmpty();
    await lab.locator('#L15-prediction').selectOption('false');
    await lab
      .getByRole('button', {
        name: locale === 'fr' ? 'Vérifier' : 'Check',
        exact: true,
      })
      .click();
    await expect(lab.locator('[data-finite-result]')).toContainText(
      'A ∩ B = {2}',
    );
  });
}
