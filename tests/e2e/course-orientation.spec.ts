import { test, expect } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`${locale}: course pathways, access requirements and real resource destinations`, async ({
    page,
    request,
  }) => {
    await page.goto(`/${locale}/`);
    await expect(page.locator('.hero .primary-link')).toHaveAttribute(
      'href',
      `/${locale}/lessons/L01/`,
    );
    const cards = page.locator('.course-cards > li');
    await expect(cards).toHaveCount(4);
    expect(
      await page
        .locator('#course')
        .evaluate((el) =>
          Boolean(
            el.compareDocumentPosition(
              document.querySelector('#revision-pdfs')!,
            ) & Node.DOCUMENT_POSITION_FOLLOWING,
          ),
        ),
    ).toBe(true);
    expect(
      await page
        .locator('#chapter-01')
        .evaluate((el) =>
          Boolean(
            el.compareDocumentPosition(
              document.querySelector('.lesson-feature')!,
            ) & Node.DOCUMENT_POSITION_FOLLOWING,
          ),
        ),
    ).toBe(true);
    for (const id of ['C01', 'C02', 'C03', 'C04']) {
      // Scope the card by chapter, rather than a hidden chapter-picker link.
      await expect(
        page.locator(`.course-cards [data-chapter="${id}"] h3 a`),
      ).toBeVisible();
    }
    const routes = await page
      .locator('.course-cards a, .study-destinations a')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')!));
    for (const route of routes) {
      const [path, hash] = route.split('#');
      const response = await request.get(path || `/${locale}/`);
      expect(response.ok(), route).toBe(true);
      if (hash) expect(await response.text()).toContain(`id="${hash}"`);
    }
    await page
      .locator('.primary-nav')
      .getByRole('link', {
        name: locale === 'fr' ? 'S’entraîner' : 'Practise',
        exact: true,
      })
      .click();
    await expect(
      page.locator('.primary-nav [aria-current="page"]'),
    ).toHaveAttribute('href', `/${locale}/practise/`);
    await expect(page.locator('main')).toContainText(
      locale === 'fr' ? 'Sans compte' : 'No account needed',
    );
    await expect(page.locator('main')).toContainText(
      locale === 'fr' ? 'compte invité requis' : 'invited account required',
    );
    await expect(page.locator('.practice-chapter')).toHaveCount(4);
    await page.locator('.practice-chapter summary').first().click();
    await page
      .locator('.practice-chapter')
      .first()
      .getByRole('link')
      .first()
      .click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/sign-in/.*next=`));
    for (const hub of ['practise/', 'revise/']) {
      await page.goto(`/${locale}/${hub}`);
      const links = await page
        .locator('main a')
        .evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')!));
      for (const href of links.filter((href) => !href.includes('/practice/'))) {
        expect(href.startsWith(`/${locale}/`)).toBe(true);
        const response = await request.get(href);
        expect(response.ok(), href).toBe(true);
        if (href.includes('#'))
          expect(await response.text()).toContain(`id="${href.split('#')[1]}"`);
      }
      await page.locator('[data-language-link]').click();
      await expect(page).toHaveURL(`/${locale === 'fr' ? 'en' : 'fr'}/${hub}`);
    }
  });

  for (const width of [320, 768, 1440]) {
    test(`${locale}: full navigation labels, themes and keyboard at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of ['light', 'dark']) {
        await page.goto(`/${locale}/`);
        await page.evaluate((theme) => {
          document.documentElement.dataset.theme = theme;
        }, theme);
        if (width <= 900) {
          const trigger = page.locator('.course-menu > summary');
          await trigger.focus();
          await page.keyboard.press('Enter');
          await page.keyboard.press('Tab');
          await expect(page.locator('.primary-nav a').first()).toBeFocused();
        }
        const labels = await page.locator('.primary-nav > a').allTextContents();
        expect(labels).toEqual(
          locale === 'fr'
            ? [
                'Cours',
                'S’entraîner',
                'Réviser',
                'Examens blancs',
                'Ma progression',
              ]
            : ['Course', 'Practise', 'Revise', 'Practice exams', 'My progress'],
        );
        for (const link of await page.locator('.primary-nav > a').all()) {
          await expect(link).toBeVisible();
          const box = (await link.boundingBox())!;
          expect(box.height).toBeGreaterThanOrEqual(44);
          expect(box.x + box.width).toBeLessThanOrEqual(width);
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
        await page.screenshot({
          path: `test-results/course-${locale}-${theme}-${width}.png`,
          fullPage: true,
        });
        if (width <= 900) {
          await page.keyboard.press('Escape');
          await expect(page.locator('.course-menu > summary')).toBeFocused();
          await expect(page.locator('.primary-nav')).toBeHidden();
        }
      }
    });
  }
}

test('course navigation and chapter links work without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 900 },
  });
  const page = await context.newPage();
  await page.goto('/en/');
  await page
    .locator('.primary-nav')
    .getByRole('link', { name: 'Revise', exact: true })
    .click();
  await expect(page).toHaveURL('/en/revise/');
  await page.locator('.chapter-picker summary').click();
  await page.locator('.chapter-option[data-chapter="C04"]').click();
  await expect(page).toHaveURL('/en/chapters/C04/');
  await context.close();
});
