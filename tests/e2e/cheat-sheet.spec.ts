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
    await expect(page.locator('.cheat-sheet-table')).toHaveCount(16);
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
    await expect(
      page.locator('#geometry .geometry-formula-table tbody tr'),
    ).toHaveCount(5);
    await expect(page.locator('#geometry .geometry-method')).toHaveCount(5);
    await expect(
      page.locator('#regression .advanced-procedure li'),
    ).toHaveCount(3);
    await expect(
      page.locator('#regression .geometry-formula-reading'),
    ).toHaveCount(4);
    await expect(page.locator('#geometry svg[role="img"]')).toHaveCount(2);
    await expect(
      page.locator('#geometry .line-case-table tbody tr'),
    ).toHaveCount(3);
    await expect(
      page.locator('#pixels .bres-trace-table tbody tr'),
    ).toHaveCount(6);
    await expect(
      page.locator(
        '#regression .regression-hand-table:not(.regression-blank-table) tbody tr',
      ),
    ).toHaveCount(3);
    await expect(
      page.locator('#regression .regression-limits-table tbody tr'),
    ).toHaveCount(4);
    await expect(page.locator('#pixels svg[role="img"]')).toHaveCount(2);
    await expect(page.locator('#regression svg[role="img"]')).toHaveCount(1);
    await expect(
      page.locator('#chapter-functions .function-domain-table tbody tr'),
    ).toHaveCount(3);
    await expect(
      page.locator('#chapter-functions .function-derivative-table tbody tr'),
    ).toHaveCount(8);
    await expect(
      page.locator('#chapter-functions .function-law-table tbody tr'),
    ).toHaveCount(7);
    await expect(
      page.locator('#chapter-functions .function-growth-table tbody tr'),
    ).toHaveCount(6);
    await expect(
      page.locator('#chapter-functions svg[role="img"]'),
    ).toHaveCount(2);
    await expect(page.locator('#functions svg')).toHaveCount(3);
    await expect(page.locator('#functions .katex-mathml math')).toHaveCount(3);
    await expect(page.getByText('𝒫(A)', { exact: true })).toBeVisible();
    await expect(page.getByText('Card(A)', { exact: true })).toBeVisible();
    await expect(
      page.locator('#sigma .katex-mathml math').first(),
    ).toBeAttached();
  });

  for (const width of [320, 375, 650, 768, 1051, 1280]) {
    test.only(`cheat sheet and navigation avoid page overflow (${locale}, ${width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/cheat-sheet/`);
      await page.evaluate(() => document.fonts.ready);
      const overflowReport = await page.evaluate(() => {
        const viewport = window.innerWidth;
        const pageWidth = document.documentElement.scrollWidth;
        const wrappers = Array.from(
          document.querySelectorAll('.cheat-sheet-table-scroll'),
        ).map((element) => ({
          width: element.clientWidth,
          scrollWidth: element.scrollWidth,
          right: Math.round(element.getBoundingClientRect().right),
          overflowX: window.getComputedStyle(element).overflowX,
          parent: element.parentElement?.id ?? '',
        }));
        const leakers = Array.from(document.querySelectorAll('body *'))
          .filter((element) => {
            if (element.getBoundingClientRect().right <= viewport + 2) {
              return false;
            }
            let parent = element.parentElement;
            while (parent && parent !== document.body) {
              const overflowX = window.getComputedStyle(parent).overflowX;
              if (/auto|scroll|hidden|clip/.test(overflowX)) return false;
              parent = parent.parentElement;
            }
            return true;
          })
          .map((element) => ({
            node: element.tagName.toLowerCase(),
            selector: element.getAttribute('class')?.slice(0, 90) ?? '',
            right: Math.round(element.getBoundingClientRect().right),
            width: Math.round(element.getBoundingClientRect().width),
          }))
          .slice(0, 25);
        return { viewport, pageWidth, wrappers, leakers };
      });
      expect(
        overflowReport.pageWidth <= overflowReport.viewport,
        JSON.stringify(overflowReport, null, 2),
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

test('print stylesheet removes site chrome but retains all sixteen reference tables', async ({
  page,
}) => {
  await page.goto('/fr/cheat-sheet/');
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.site-footer')).toBeHidden();
  await expect(page.locator('.cheat-sheet-table')).toHaveCount(16);
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

test('geometry navigation and language switching preserve the section anchor', async ({
  page,
}) => {
  await page.goto('/fr/cheat-sheet/');
  await page
    .locator('.cheat-sheet-toc')
    .getByRole('link', { name: /Droites et géométrie analytique/ })
    .click();
  await expect(page).toHaveURL('/fr/cheat-sheet/#geometry');
  await expect(page.locator('#geometry h2')).toContainText('Droites');
  await expect(
    page.locator('#geometry .geometry-formula-table tbody tr'),
  ).toHaveCount(5);
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL('/en/cheat-sheet/#geometry');
  await expect(page.locator('#geometry h2')).toContainText('Analytic geometry');
  await expect(
    page.locator('#geometry .geometry-formula-table tbody tr'),
  ).toHaveCount(5);
});

test('straight-line graphs and half-plane formulas render as accessible math', async ({
  page,
}) => {
  await page.goto('/fr/cheat-sheet/#geometry');
  await expect(
    page.locator('#geometry .geometry-chart svg title'),
  ).toContainText('y = 2x + 1');
  await expect(page.locator('#geometry .line-case-table tbody tr')).toHaveCount(
    3,
  );
  await expect(
    page.locator('#geometry .katex-mathml math').first(),
  ).toBeAttached();
  await expect(page.locator('#geometry')).toBeVisible();
});

for (const [anchor, frenchTitle, englishTitle] of [
  ['pixels', /Droites sur écran/, /Lines on a screen/],
  ['regression', /Régression linéaire/, /Linear regression/],
] as const) {
  test(
    'bilingual navigation preserves ' + anchor + ' anchor',
    async ({ page }) => {
      await page.goto('/fr/cheat-sheet/');
      await page
        .locator('.cheat-sheet-toc')
        .getByRole('link', { name: frenchTitle })
        .click();
      await expect(page).toHaveURL('/fr/cheat-sheet/#' + anchor);
      await expect(page.locator('#' + anchor + ' h2')).toContainText(
        frenchTitle,
      );
      await page.getByRole('link', { name: 'EN', exact: true }).click();
      await expect(page).toHaveURL('/en/cheat-sheet/#' + anchor);
      await expect(page.locator('#' + anchor + ' h2')).toContainText(
        englishTitle,
      );
    },
  );
}

test('integer Bresenham steps and regression hand table are printable', async ({
  page,
}) => {
  await page.goto('/fr/cheat-sheet/#pixels');
  await expect(page.locator('#pixels .bres-trace-table tbody tr')).toHaveCount(
    6,
  );
  await expect(page.locator('#pixels .advanced-code')).toContainText(
    'D = 2*dy - dx',
  );
  await expect(
    page.locator('#pixels .katex-mathml math').first(),
  ).toBeAttached();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('#pixels .bres-trace-table')).toBeVisible();
  await expect(
    page.locator(
      '#regression .regression-hand-table:not(.regression-blank-table)',
    ),
  ).toBeVisible();
  await expect(
    page.locator('#regression .regression-blank-table tbody tr'),
  ).toHaveCount(4);
  await expect(
    page.locator('#regression .regression-limits-table tbody tr'),
  ).toHaveCount(4);
  await expect(
    page.locator('#regression .geometry-formula-reading'),
  ).toHaveCount(4);
});

test('Chapter 3 has accessible bilingual formulas, figures and course links', async ({
  page,
}) => {
  await page.goto('/fr/cheat-sheet/');
  await page
    .locator('.cheat-sheet-toc')
    .getByRole('link', { name: /Chapitre 3/ })
    .click();
  await expect(page).toHaveURL('/fr/cheat-sheet/#chapter-functions');
  await expect(page.locator('#chapter-functions h2')).toContainText(
    'Fonctions',
  );
  await expect(
    page.locator('#chapter-functions .function-derivative-table tbody tr'),
  ).toHaveCount(8);
  await expect(
    page.locator('#chapter-functions .function-law-table tbody tr'),
  ).toHaveCount(7);
  await expect(
    page.locator('#chapter-functions .katex-mathml math').first(),
  ).toBeAttached();
  await expect(page.locator('#chapter-functions svg[role="img"]')).toHaveCount(
    2,
  );
  for (const lesson of ['L37', 'L38', 'L39', 'L40', 'L41', 'L42']) {
    await expect(
      page
        .locator('#chapter-functions .function-lessons')
        .getByRole('link', { name: lesson }),
    ).toHaveAttribute('href', '/fr/lessons/' + lesson + '/');
  }
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL('/en/cheat-sheet/#chapter-functions');
  await expect(page.locator('#chapter-functions h2')).toContainText(
    'Functions',
  );
  await expect(
    page.locator('#chapter-functions .function-growth-table tbody tr'),
  ).toHaveCount(6);
});

test('Chapter 3 graphs, tables and headings remain printable', async ({
  page,
}) => {
  await page.goto('/fr/cheat-sheet/#chapter-functions');
  await page.emulateMedia({ media: 'print' });
  await expect(
    page.locator('#chapter-functions .function-derivative-table'),
  ).toBeVisible();
  await expect(
    page.locator('#chapter-functions .function-law-table'),
  ).toBeVisible();
  await expect(
    page.locator('#chapter-functions .function-growth-table'),
  ).toBeVisible();
  await expect(page.locator('#chapter-functions svg[role="img"]')).toHaveCount(
    2,
  );
});
