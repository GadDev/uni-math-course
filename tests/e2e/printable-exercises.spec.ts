import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en'] as const) {
  test(
    'printable exercise library is a public bilingual reference (' +
      locale +
      ')',
    async ({ page }) => {
      await page.goto('/' + locale + '/exercises/');

      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('.printable-chapter')).toHaveCount(2);
      await expect(page.locator('.printable-document')).toHaveCount(4);
      await expect(
        page.locator('.printable-chapter-count strong').first(),
      ).toHaveText('300');
      await expect(
        page.locator('.printable-chapter-count strong').last(),
      ).toHaveText('640');
      await expect(page.locator('.printable-language-note')).toBeVisible();
      const documents = page.locator('.printable-document');
      for (const document of await documents.all()) {
        const download = document.locator('a[download]');
        if ((await download.count()) > 0) {
          await expect(download).toHaveAttribute(
            'href',
            /^\/pdfs\/exercises\/.*\.pdf$/,
          );
        } else {
          await expect(document.locator('.printable-pending')).toBeVisible();
        }
      }
      await expect(
        page.locator('.primary-nav > a[aria-current="page"]'),
      ).toHaveAttribute('href', '/' + locale + '/exercises/');
    },
  );

  for (const width of [320, 375, 768, 1280]) {
    test(
      'printable library fits at ' + width + 'px (' + locale + ')',
      async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto('/' + locale + '/exercises/');
        await page.evaluate(() => document.fonts.ready);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
      },
    );
  }
}

test('printable exercise links preserve section on language switch', async ({
  page,
}) => {
  await page.goto('/fr/exercises/#chapter-02');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL('/en/exercises/#chapter-02');
  await expect(page.locator('#chapter-02')).toBeAttached();
});
