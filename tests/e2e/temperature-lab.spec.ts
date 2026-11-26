import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`${locale}: L30 conversion works in both directions with keyboard controls`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L30/`);
    const lab = page.locator('[data-temperature-lab="interactive"]');
    await lab.scrollIntoViewIfNeeded();
    const slider = lab.getByRole('slider');
    await expect(slider).toBeVisible();
    await expect(lab.getByRole('status')).toHaveText('C = 20 °C ; F = 68 °F');
    await expect(lab).toContainText(locale === 'fr' ? '1,8 ×' : '1.8 ×');
    await lab.getByRole('button', { name: '100 °C', exact: true }).click();
    await expect(lab.getByRole('status')).toHaveText('C = 100 °C ; F = 212 °F');
    await lab.getByRole('button', { name: '°F → °C', exact: true }).click();
    await expect(
      lab.getByRole('button', { name: '°F → °C', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(slider).toHaveAccessibleName('F (°F)');
    await slider.focus();
    await page.keyboard.press('Home');
    await expect(lab.getByRole('status')).toHaveText('C = -40 °C ; F = -40 °F');
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveValue('-39.8');
    await expect(slider).toHaveAttribute(
      'aria-valuetext',
      locale === 'fr' ? '-39,8 °F' : '-39.8 °F',
    );
    await lab.getByRole('button', { name: '0 °C', exact: true }).click();
    await expect(lab.getByRole('status')).toHaveText('C = 0 °C ; F = 32 °F');
    await lab.getByRole('button', { name: '°C → °F', exact: true }).click();
    await expect(slider).toHaveAccessibleName('C (°C)');
    await expect(slider).toHaveValue('0');
    await expect(page.locator('.katex-error')).toHaveCount(0);
  });

  test(`${locale}: L30 diagrams and worked solutions survive mobile, print and no JavaScript`, async ({
    page,
    browser,
  }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(`/${locale}/lessons/L30/`);
    const lab = page.locator('[data-temperature-lab="interactive"]');
    await lab.scrollIntoViewIfNeeded();
    await expect(lab.getByRole('slider')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
    await page.emulateMedia({ media: 'print' });
    await expect(lab.locator('fieldset')).toBeHidden();
    await expect(
      page.locator('[data-temperature-lab="static"] svg'),
    ).toBeVisible();
    for (const solution of await page.locator('article details > p').all())
      await expect(solution).toBeVisible();

    const context = await browser.newContext({ javaScriptEnabled: false });
    const staticPage = await context.newPage();
    await staticPage.goto(`/${locale}/lessons/L30/`);
    await expect(
      staticPage.locator('[data-temperature-lab="static"] svg'),
    ).toBeVisible();
    await expect(
      staticPage.locator('[data-temperature-lab="interactive"] fieldset'),
    ).toBeHidden();
    const solution = staticPage.locator('article details').first();
    await solution.locator('summary').click();
    await expect(solution.locator('p')).toContainText('86');
    await context.close();
  });
}
