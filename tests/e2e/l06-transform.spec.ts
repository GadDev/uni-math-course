import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en'] as const) {
  test(`L06 transforms and checks equivalence evidence (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L06/`);
    await expect(page.locator('.lesson-prose h2')).toHaveCount(6);
    const lab = page.locator('[data-transform-lab]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.locator('fieldset')).toBeVisible();
    const task = lab.locator('[data-transform-task]');
    const formula = lab.locator('[data-transform-formula]');
    const check = lab.locator('[data-transform-check]');
    const row = lab.locator('[data-transform-row]');
    const prediction = lab.locator('[data-transform-prediction]');
    const checkRow = lab.locator('[data-transform-check-row]');
    const evidence = lab.locator('[data-transform-evidence]');
    const feedback = lab.locator('[data-transform-feedback]');
    await formula.selectOption('inverse');
    await check.click();
    await expect(feedback).toContainText(
      locale === 'fr' ? 'À revoir' : 'Try again',
    );
    await expect(row).toHaveCount(0);
    await formula.selectOption('contrapositive');
    await check.click();
    await prediction.selectOption('0');
    await checkRow.click();
    await expect(evidence).toContainText('0/4');
    for (const [i, value] of [...'1101'].entries()) {
      await row.selectOption(String(i));
      await prediction.selectOption(value);
      await checkRow.focus();
      await page.keyboard.press('Enter');
      await expect(evidence).toContainText(`${i + 1}/4`);
    }
    await expect(evidence).toContainText(
      locale === 'fr' ? 'Équivalence démontrée' : 'Equivalence proved',
    );
    for (const [key, index, value] of [
      ['converse', '1', '0'],
      ['inverse', '2', '1'],
      ['negation', '0', '0'],
    ] as const) {
      await task.selectOption(key);
      await formula.selectOption(key);
      await check.click();
      await row.selectOption(index);
      await prediction.selectOption(value);
      await checkRow.click();
      await expect(evidence).toContainText(
        locale === 'fr' ? 'Équivalence réfutée' : 'Equivalence refuted',
      );
    }
    await lab.locator('[data-transform-reset]').click();
    await expect(row).toHaveCount(0);
    await page.emulateMedia({ media: 'print' });
    await expect(lab.locator('fieldset')).toBeHidden();
    await expect(lab.locator('[data-transform-static]')).toBeVisible();
    await expect(page.locator('.transform-revision')).toBeVisible();
  });

  test(`L06 static diagrams and memo without JS (${locale})`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 900 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4321/${locale}/lessons/L06/`);
      await expect(page.locator('[data-transform-static]')).toBeVisible();
      const images = page.locator('.lesson-prose img');
      await expect(images).toHaveCount(2);
      for (const image of await images.all()) {
        await expect(image).toHaveAttribute('alt', /.+/);
        await expect
          .poll(() =>
            image.evaluate((img) => (img as HTMLImageElement).naturalWidth),
          )
          .toBeGreaterThan(0);
      }
      await expect(page.locator('.katex-error')).toHaveCount(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
    } finally {
      await context.close();
    }
  });
}
