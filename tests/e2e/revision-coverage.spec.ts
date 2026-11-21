import { test, expect } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`Chapter 4 revision links and coverage are explicit (${locale})`, async ({
    page,
    request,
  }, testInfo) => {
    await page.setViewportSize({ width: 320, height: 900 });
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      await page.goto(`/${locale}/cheat-sheet/`);
      await page.locator('a[href="#information"]').focus();
      await page.keyboard.press('Enter');
      const reference = page.locator('#information');
      await expect(reference.getByRole('heading', { level: 2 })).toContainText(
        locale === 'fr' ? 'Information et codage' : 'Information and coding',
      );
      await expect(reference.locator('.katex-mathml math')).toHaveCount(7);
      for (const link of await reference.locator('a').all()) {
        expect(
          (await request.get((await link.getAttribute('href'))!)).ok(),
        ).toBe(true);
      }
      const bounds = await reference.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
      for (const formula of await reference
        .locator('.information-formula')
        .all()) {
        const box = await formula.boundingBox();
        expect(box!.x + box!.width).toBeLessThanOrEqual(320);
      }
      await page.mouse.move(2, 2);
      await page.mouse.wheel(500, 0);
      await expect.poll(() => page.evaluate(() => window.scrollX)).toBe(0);
      await page.screenshot({
        path: testInfo.outputPath(`chapter-4-${colorScheme}.png`),
      });
    }
    await page.goto(`/${locale}/training-exams/`);
    await expect(page.locator('.final-exam-card')).toContainText('L50–L57');
    await expect(page.locator('.final-exam-card')).toContainText('LZW');
    if (locale === 'en')
      await expect(page.locator('.final-exam-card')).toContainText('in French');
    await page.goto(`/${locale}/exercises/#chapter-04`);
    await expect(page.locator('#chapter-04')).toContainText('L43–L49');
    await expect(page.locator('#chapter-04')).toContainText('L50–L57');
    if (locale === 'en')
      await expect(page.locator('.printable-language-note')).toContainText(
        'French',
      );
  });
}
