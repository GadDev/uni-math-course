import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`${locale}: L21 six-stage reading and power expansion`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(`/${locale}/lessons/L21/`);
    await expect(page.locator('.algebra-study h2').filter({ hasText: /^[1-6]\. / })).toHaveCount(6);
    for (const image of await page.locator('.teaching-figure img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    }
    const lab = page.locator('[data-method-lab="powers"]');
    await lab.scrollIntoViewIfNeeded();
    const live = lab.locator('.method-live');
    await expect(live.locator('fieldset')).toBeVisible();
    await expect(live.locator('[data-current-math] annotation')).toContainText('3\\times3');
    await live.getByRole('slider').nth(1).press('ArrowRight');
    await expect(live.locator('[data-current-math] annotation')).toContainText('3\\times3\\times3');
    await expect(live.locator('[data-method-result]')).toContainText('−aⁿ = -27 ; (−a)ⁿ = -27');
    await expect(page.locator('.katex-error')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await page.emulateMedia({ media: 'print' });
    await expect(lab.locator('.method-print')).toBeVisible();
    await expect(live).toBeHidden();
  });
}
