import { expect, test } from '@playwright/test';

const chapters = [
  {
    page: '/#chapter-01',
    lesson: 'L03',
    prerequisite: 'L02',
    next: 'L04',
    total: 20,
  },
  {
    page: '/chapters/C02/',
    lesson: 'L29',
    prerequisite: 'L28',
    next: 'L30',
    total: 16,
  },
  {
    page: '/chapters/C03/',
    lesson: 'L38',
    prerequisite: 'L37',
    next: 'L39',
    total: 6,
  },
  {
    page: '/chapters/C04/',
    lesson: 'L55',
    prerequisite: 'L54',
    next: 'L56',
    total: 15,
  },
] as const;

for (const locale of ['fr', 'en']) {
  test(`pathways show outcomes, start, lessons, then practice and revision (${locale})`, async ({
    page,
  }) => {
    for (const [index, chapter] of chapters.entries()) {
      await page.goto(`/${locale}${chapter.page}`);
      const programme = page.locator('.programme-section');
      await expect(programme.locator('.programme-part li')).toHaveCount(
        chapter.total,
      );
      const workbook = programme.locator('.programme-revision a');
      await expect(workbook).toHaveAttribute(
        'href',
        `/${locale}/exercises/#chapter-0${index + 1}`,
      );
      const order = await programme
        .locator(
          '.programme-orientation, .programme-progress, .programme-part, .programme-resources',
        )
        .evaluateAll((elements) =>
          elements.map((element) =>
            element.classList.contains('programme-part')
              ? 'lesson group'
              : element.classList.item(0),
          ),
        );
      expect(order.slice(0, 2)).toEqual([
        'programme-orientation',
        'lesson-completion',
      ]);
      expect(order.slice(2, -1)).toEqual(
        Array(order.length - 3).fill('lesson group'),
      );
      expect(order.at(-1)).toBe('programme-dashboard');

      if (index === 1) {
        await expect(
          page.locator('.programme-section + .source-path'),
        ).toBeAttached();
      }
      if (index === 3) {
        const lzwLessons = programme.locator(
          '#programme-C04-part-4 .available-topic > a',
        );
        expect(
          await lzwLessons.evaluateAll((links) =>
            links.map((link) => link.getAttribute('href')),
          ),
        ).toEqual(
          ['L55', 'L56', 'L57'].map((id) => `/${locale}/lessons/${id}/`),
        );
      }
    }
  });

  for (const { lesson, prerequisite, next, total } of chapters) {
    test(`${lesson} reading navigation and finish work in ${locale}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(`/${locale}/lessons/${lesson}/`);
      await expect(page.locator('.section-nav')).toBeVisible();
      const switcher = page.locator('.lesson-switcher');
      await expect(switcher).not.toHaveAttribute('open');
      const trigger = switcher.locator('summary');
      await trigger.focus();
      await page.keyboard.press('Enter');
      await expect(switcher.locator('li')).toHaveCount(total);
      await expect(switcher.locator('[aria-current="page"]')).toBeVisible();
      const nextHref = `/${locale}/lessons/${next}/`;
      await expect(switcher.locator(`a[href="${nextHref}"]`)).toBeVisible();
      await page.keyboard.press('Space');
      await expect(switcher).not.toHaveAttribute('open');
      await expect(
        page.locator(
          `.lesson-prerequisites a[href="/${locale}/lessons/${prerequisite}/"]`,
        ),
      ).toBeVisible();
      await expect(page.locator('.lesson-practice-action a')).toHaveAttribute(
        'href',
        `/${locale}/lessons/${lesson}/practice/`,
      );
      await expect(
        page.locator(`.lesson-next a[href="${nextHref}"]`),
      ).toBeVisible();
      await page.setViewportSize({ width: 320, height: 900 });
      await page.evaluate(() => {
        document.documentElement.dataset.theme = 'dark';
      });
      await expect(page.locator('.section-nav')).toBeHidden();
      await expect(page.locator('.mobile-contents summary')).toBeVisible();
      await trigger.click();
      await expect(switcher.locator('[aria-current="page"]')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
      await page.emulateMedia({ media: 'print' });
      await expect(switcher).toBeHidden();
      await expect(page.locator('.lesson-prose')).toBeVisible();
    });
  }
}
