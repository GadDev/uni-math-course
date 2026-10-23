import { test, expect } from '@playwright/test';

test('public glossary searches both languages and glyphs, filters categories and resets by keyboard', async ({
  page,
}) => {
  await page.goto('/fr/');
  await page
    .locator('.primary-nav')
    .getByRole('link', { name: 'Glossaire' })
    .click();
  await expect(page).toHaveURL('/fr/glossary/');
  await expect(page.locator('[data-entry]')).toHaveCount(145);
  const search = page.getByLabel('Rechercher un symbole ou un mot');
  await search.fill('∧');
  await expect(page.locator('#E08')).toBeVisible();
  await expect(page.locator('#E08 .katex-mathml math').first()).toBeAttached();
  await search.fill('subset');
  await expect(page.locator('#E32')).toBeVisible();
  await page.getByLabel('Famille', { exact: true }).selectOption('sets');
  await expect(page.locator('[data-entry]:not([hidden])')).not.toHaveCount(0);
  await search.fill('no-match-xyz');
  await expect(page.locator('[data-empty]')).toBeVisible();
  await page.getByRole('button', { name: 'Effacer les filtres' }).focus();
  await page.keyboard.press('Enter');
  await expect(search).toBeFocused();
  await expect(page.locator('[data-entry]:not([hidden])')).toHaveCount(145);
  await page.locator('#E13 summary').click();
  await expect(page.locator('#E13 [lang="en"]')).toBeVisible();
});

test('language switching preserves glossary entry and search; deep links reveal filtered entries', async ({
  page,
}) => {
  await page.goto('/fr/glossary/?q=implication&category=logic#E13');
  await expect(page.locator('#E13')).toBeInViewport();
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(
    '/en/glossary/?q=implication&category=logic#E13',
  );
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByLabel('Search for a symbol or word')).toHaveValue(
    'implication',
  );
  await expect(page.locator('#E13')).toBeInViewport();
  await page.goto('/en/glossary/?q=no-match-xyz#E38');
  await expect(page.locator('#E38')).toBeInViewport();
  await expect(page.getByLabel('Search for a symbol or word')).toHaveValue('');
});

test('without JavaScript all entries, translations and the source correction remain readable', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/en/glossary/');
  await expect(page.locator('[data-entry]')).toHaveCount(145);
  await expect(page.locator('.glossary-filters')).toBeHidden();
  await page
    .getByText('Logic, page 48: an example needing correction', { exact: true })
    .click();
  await expect(
    page.getByText('The course marks “there exists a human'),
  ).toBeVisible();
  await page.locator('#E38 summary').click();
  await expect(page.locator('#E38 [lang="fr"]')).toBeVisible();
  await context.close();
});

for (const locale of ['fr', 'en']) {
  for (const width of [320, 375, 768, 1280]) {
    test(`glossary fits ${locale} at ${width}px with keyboard-accessible formula scrolling`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/glossary/`);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.locator('#E28 .glossary-formula').focus();
      await expect(page.locator('#E28 .glossary-formula')).toBeFocused();
      await expect(
        page.locator('.primary-nav [aria-current="page"]'),
      ).toHaveText(locale === 'fr' ? 'Glossaire' : 'Glossary');
      await expect(page.locator('.katex-error')).toHaveCount(0);
    });
  }
}

for (const locale of ['fr', 'en']) {
  test(`Droites terms preserve source, notation and location across languages (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/glossary/?q=∑&category=sums#D034`);
    await expect(page.locator('#D034')).toBeVisible();
    await expect(page.locator('#D034 .glossary-provenance')).toContainText(
      locale === 'fr' ? 'Droites et régression' : 'Lines and regression',
    );
    await expect(page.locator('#D034 .glossary-provenance')).toContainText(
      '25, 26, 69, 70',
    );
    await expect(
      page.locator('#D034 .katex-mathml math').first(),
    ).toBeAttached();
    const other = locale === 'fr' ? 'EN' : 'FR';
    await page.getByRole('link', { name: other, exact: true }).click();
    await expect(page.locator('#D034')).toBeInViewport();
    expect(new URL(page.url()).searchParams.get('category')).toBe('sums');
    expect(new URL(page.url()).searchParams.get('q')).toBe('∑');
    const input = page.locator('#glossary-search');
    await page.locator('#glossary-category').selectOption('regression');
    await input.fill('résidu');
    await expect(page.locator('#D074')).toBeVisible();
    await input.fill('√');
    await expect(page.locator('#D083')).toBeVisible();
    await input.fill('no-match-xyz');
    await expect(page.locator('[data-empty]')).toBeVisible();
  });
}
