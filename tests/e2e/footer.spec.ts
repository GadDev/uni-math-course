import { test, expect } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`${locale}: footer destinations and reading layouts`, async ({
    page,
    request,
  }) => {
    await page.goto(`/${locale}/`);
    const destinations = await page
      .locator('.footer-resources a')
      .evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).getAttribute('href')!),
      );
    for (const href of destinations.filter((href) => href.startsWith('/'))) {
      const response = await request.get(href);
      expect(response.ok(), href).toBe(true);
      if (href.includes('#'))
        expect(await response.text()).toContain(`id="${href.split('#')[1]}"`);
    }
    for (const path of ['', 'chapters/C02/', 'lessons/L01/', 'exercises/']) {
      await page.goto(`/${locale}/${path}`);
      const footer = page.locator('.site-footer');
      await expect(footer).toBeVisible();
      await expect(footer.getByRole('heading', { level: 2 })).toHaveCount(3);
      for (const width of [375, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        for (const theme of ['light', 'dark'] as const) {
          await page.emulateMedia({ colorScheme: theme });
          const box = await footer.boundingBox();
          expect(box!.x).toBeGreaterThanOrEqual(0);
          expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        }
      }
      await footer.locator('a').first().focus();
      await page.keyboard.press('Tab');
      await expect(footer.locator('nav a').first()).toBeFocused();
      await page.emulateMedia({ media: 'print' });
      await expect(footer).toBeHidden();
      await page.emulateMedia({ media: 'screen' });
    }
    const links = await page
      .locator('.site-footer a')
      .evaluateAll((anchors) =>
        anchors.map((a) => (a as HTMLAnchorElement).getAttribute('href')!),
      );
    for (const href of links.filter((href) => href.startsWith('/'))) {
      expect(href.startsWith(`/${locale}/`)).toBe(true);
      const [path = href, hash] = href.split('#');
      const response = await request.get(path);
      expect(response.ok(), href).toBe(true);
      if (hash) {
        await page.goto(href);
        await expect(page.locator(`[id="${hash}"]`)).toHaveCount(1);
      }
    }
    await page.goto(`/${locale}/exercises/`);
    for (const href of await page
      .locator('#revision-pdfs a[type="application/pdf"]')
      .evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')!))) {
      const response = await request.get(href);
      expect(response.ok(), href).toBe(true);
      expect(response.headers()['content-type']).toContain('application/pdf');
    }
  });
}
