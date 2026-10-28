import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en'] as const) {
  test(
    'printable exercise library provides four chapters and valid PDFs (' +
      locale +
      ')',
    async ({ page }) => {
      await page.goto('/' + locale + '/exercises/');

      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('.printable-chapter')).toHaveCount(4);
      const documents = page.locator('.printable-document');
      await expect(documents).toHaveCount(locale === 'fr' ? 14 : 6);
      await expect(
        page.locator('.printable-chapter-count strong').first(),
      ).toHaveText('300');
      await expect(
        page.locator('.printable-chapter-count strong').last(),
      ).toHaveText('700');
      await expect(page.locator('.printable-language-note')).toBeVisible();
      await expect(page.locator('#chapter-03 .printable-document')).toHaveCount(
        4,
      );
      await expect(page.locator('#chapter-04 a[download]')).toHaveCount(2);
      const chapterDownloads = page.locator('#chapter-03 a[download]');
      await expect(chapterDownloads).toHaveCount(4);
      for (const link of await chapterDownloads.all()) {
        await expect(link).toHaveAttribute(
          'href',
          new RegExp('-' + locale + '\\.pdf$'),
        );
        const href = await link.getAttribute('href');
        const response = await page.request.get(href!);
        expect(response.status(), href!).toBe(200);
        const bytes = await response.body();
        expect(bytes.subarray(0, 5).toString(), href!).toBe('%PDF-');
      }

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

  for (const width of [320, 375, 501, 650, 768, 1280]) {
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
  await page.goto('/fr/exercises/#chapter-03');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL('/en/exercises/#chapter-03');
  await expect(page.locator('#chapter-03')).toBeAttached();
});
