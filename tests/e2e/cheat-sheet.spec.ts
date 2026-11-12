import { test, expect } from '@playwright/test';

for (const locale of ['fr', 'en'] as const) {
  test(`cheat sheet is reachable and complete (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/`);
    const nav = page.locator('.primary-nav');
    const label = locale === 'fr' ? 'Fiche mémo' : 'Cheat sheet';
    const link = nav.getByRole('link', { name: label, exact: true });
    await expect(link).toHaveAttribute('href', `/${locale}/cheat-sheet/`);
    await link.click();
    await expect(page).toHaveURL(`/${locale}/cheat-sheet/`);
    await expect(link).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('.cheat-sheet-table')).toHaveCount(6);
    await expect(page.locator('#logic tbody tr')).toHaveCount(8);
    await expect(page.locator('#sets tbody tr')).toHaveCount(11);
    await expect(page.locator('#truth-table tbody tr')).toHaveCount(4);
    await expect(page.locator('#functions tbody tr')).toHaveCount(3);
    await expect(
      page.locator('#sigma .sigma-parts-table tbody tr'),
    ).toHaveCount(5);
    await expect(
      page.locator('#sigma .sigma-patterns-table tbody tr'),
    ).toHaveCount(5);
    await expect(page.locator('#sigma .sigma-rules li')).toHaveCount(5);
    await expect(page.locator('#functions svg')).toHaveCount(3);
    await expect(page.locator('#functions .katex-mathml math')).toHaveCount(3);
    await expect(page.getByText('𝒫(A)', { exact: true })).toBeVisible();
    await expect(page.getByText('Card(A)', { exact: true })).toBeVisible();
    await expect(
      page.locator('#sigma .katex-mathml math').first(),
    ).toBeAttached();
  });

  for (const width of [320, 375, 650, 768, 1051, 1280]) {
    test(`cheat sheet and navigation avoid page overflow (${locale}, ${width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/cheat-sheet/`);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      await expect(
        page.locator('.cheat-sheet-table-scroll').first(),
      ).toBeVisible();
      const nav = await page.locator('.primary-nav').boundingBox();
      expect(nav).not.toBeNull();
      expect(nav!.x + nav!.width).toBeLessThanOrEqual(width);
    });
  }
}

test('language switching retains the set-theory anchor', async ({ page }) => {
  await page.goto('/fr/cheat-sheet/#sets');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL('/en/cheat-sheet/#sets');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#sets')).toBeVisible();
});

test('print stylesheet removes site chrome but retains all six reference tables', async ({
  page,
}) => {
  await page.goto('/fr/cheat-sheet/');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.site-footer')).toBeHidden();
  await expect(page.locator('.cheat-sheet-table')).toHaveCount(6);
  await expect(page.locator('.cheat-sheet-table').first()).toBeVisible();
});

test('Sigma section is reachable using an anchor and preserves language', async ({
  page,
}) => {
  await page.goto('/fr/cheat-sheet/');
  await page
    .locator('.cheat-sheet-toc')
    .getByRole('link', { name: /sigma/i })
    .click();
  await expect(page).toHaveURL('/fr/cheat-sheet/#sigma');
  await expect(page.locator('#sigma')).toBeVisible();
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL('/en/cheat-sheet/#sigma');
  await expect(page.locator('#sigma .sigma-parts-table tbody tr')).toHaveCount(
    5,
  );
});
