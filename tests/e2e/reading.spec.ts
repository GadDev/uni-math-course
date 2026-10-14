import { test, expect } from '@playwright/test';

test('read the bilingual pilot and preserve lesson/anchor on language switching', async ({
  page,
}) => {
  await page.goto('/fr/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await page.getByRole('link', { name: 'Lire la leçon' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'implication',
  );
  await expect(page.locator('.katex-mathml math').first()).toBeAttached();
  await expect(page.locator('table tr')).toHaveCount(5);
  await page.goto('/fr/lessons/L05/#main');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL('/en/lessons/L05/#main');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Implication',
  );
  await expect(
    page.getByRole('link', { name: 'FR', exact: true }),
  ).toHaveAttribute('href', '/fr/lessons/L05/');
});

test('Radix island hydrates and the reading disclosure works by keyboard', async ({
  page,
}) => {
  await page.goto('/en/');
  const button = page.getByRole('button', { name: 'How to use this notebook' });
  await expect(button).toBeVisible();
  await expect(button).toBeEnabled();
  await expect(
    page.getByText('Read an example, then explain the rule'),
  ).not.toBeVisible();
  const frame = await page.locator('.reading-notice-theme').boundingBox();
  const notice = await page.locator('.reading-notice').boundingBox();
  expect(frame!.height).toBeLessThanOrEqual(notice!.height + 4);
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('button', { name: 'Hide the tip' }),
  ).toHaveAttribute('aria-expanded', 'true');
  await expect(
    page.getByText('Read an example, then explain the rule'),
  ).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(
    page.getByText('Read an example, then explain the rule'),
  ).not.toBeVisible();
});

for (const width of [320, 375, 768, 1280]) {
  test('French reading fits at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/fr/lessons/L05/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    const brand = await page.locator('.brand').boundingBox();
    const language = await page.locator('.language-switch').boundingBox();
    expect(brand).not.toBeNull();
    expect(language).not.toBeNull();
    expect(brand!.x + brand!.width).toBeLessThanOrEqual(language!.x);
  });
}

test('English/French shell reports development state without fake sign-in', async ({
  page,
}) => {
  await page.goto('/en/');
  await expect(
    page.getByText('Accounts, interactive exercises and progress tracking'),
  ).toBeVisible();
  await expect(page.locator('main input')).toHaveCount(0);
  await page.goto('/en/lessons/missing/');
  await expect(
    page.getByRole('heading', { name: 'Page introuvable' }),
  ).toBeVisible();
});
