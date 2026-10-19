import { test, expect, type Locator } from '@playwright/test';

async function expectReadable(locator: Locator) {
  const contrast = await locator.evaluate((element) => {
    const luminance = (color: string) => {
      const channels = color
        .match(/[\d.]+/g)!
        .slice(0, 3)
        .map(Number);
      return channels.reduce((sum, value, index) => {
        const channel = value / 255;
        return (
          sum +
          [0.2126, 0.7152, 0.0722][index]! *
            (channel <= 0.04045
              ? channel / 12.92
              : ((channel + 0.055) / 1.055) ** 2.4)
        );
      }, 0);
    };
    let background = 'rgba(0, 0, 0, 0)';
    let parent: Element | null = element;
    while (parent && background === 'rgba(0, 0, 0, 0)') {
      background = getComputedStyle(parent).backgroundColor;
      parent = parent.parentElement;
    }
    const foreground = luminance(getComputedStyle(element).color);
    const surface = luminance(background);
    return (
      (Math.max(foreground, surface) + 0.05) /
      (Math.min(foreground, surface) + 0.05)
    );
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
}

test('follows the system until a keyboard toggle sets a persistent bilingual preference', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/fr/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  const toggle = page.getByRole('button', {
    name: 'Thème sombre',
    exact: true,
  });
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(toggle).toHaveAttribute('title', 'Passer au thème clair');
  await toggle.focus();
  expect(
    await toggle.evaluate((el) => getComputedStyle(el).outlineWidth),
  ).not.toBe('0px');
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/fr/lessons/L05/');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Dark theme', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('applies saved theme without waiting for bundled scripts', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.addInitScript(() => localStorage.setItem('um-theme', 'dark'));
  await page.route('**/_astro/*.js', (route) => route.abort());
  await page.goto('/en/lessons/L05/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(
    await page
      .locator('html')
      .evaluate((el) => getComputedStyle(el).colorScheme),
  ).toBe('dark');
});

test('synchronizes tabs and returns to system preference when storage is cleared', async ({
  page,
  context,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/en/');
  const other = await context.newPage();
  await other.emulateMedia({ colorScheme: 'light' });
  await other.goto('/fr/lessons/L05/');
  await page.getByRole('button', { name: 'Dark theme', exact: true }).click();
  await expect(other.locator('html')).toHaveAttribute('data-theme', 'dark');
  await other.evaluate(() => localStorage.removeItem('um-theme'));
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('invalid saved values fall back to the system and blocked storage does not break the toggle', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addInitScript(() => localStorage.setItem('um-theme', 'invalid'));
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage blocked', 'SecurityError');
      },
    });
  });
  await page.reload();
  await page.getByRole('button', { name: 'Dark theme', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('reading follows dark system colours without JavaScript and hides the inactive toggle', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    colorScheme: 'dark',
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4321/en/lessons/L05/');
    await expect(page.locator('[data-theme-toggle]')).toBeHidden();
    expect(
      await page
        .locator('html')
        .evaluate((el) => getComputedStyle(el).backgroundColor),
    ).toBe('rgb(24, 27, 25)');
    await expectReadable(page.locator('.lesson-prose p').first());
  } finally {
    await context.close();
  }
});

for (const locale of ['fr', 'en']) {
  for (const width of [320, 375, 1051, 1280]) {
    test(`theme control fits both themes with public and signed-in headers (${locale}, ${width}px)`, async ({
      page,
      context,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/`);
      for (const signedIn of [false, true]) {
        if (signedIn) {
          await context.request.post('/auth/login/', {
            headers: { Origin: 'http://127.0.0.1:4321' },
            form: {
              locale,
              email: 'learner@example.invalid',
              password: 'correct-horse-battery',
            },
          });
          await page.reload();
          await expect(page.locator('[data-profile-menu]')).toBeVisible();
        }
        for (let i = 0; i < 2; i++) {
          const toggle = page.locator('[data-theme-toggle]');
          await toggle.click();
          await page.evaluate(() => document.fonts.ready);
          expect(
            await page.evaluate(() => document.documentElement.scrollWidth),
          ).toBeLessThanOrEqual(width);
          const boxes = await Promise.all(
            [
              page.locator('.brand'),
              toggle,
              page.locator('.language-switch'),
              page.locator(signedIn ? '.profile-button' : '.header-sign-in'),
            ].map((locator) => locator.boundingBox()),
          );
          for (let j = 1; j < boxes.length; j++) {
            expect(boxes[j - 1]!.x + boxes[j - 1]!.width).toBeLessThanOrEqual(
              boxes[j]!.x,
            );
          }
          expect(boxes[1]!.width).toBeGreaterThanOrEqual(44);
          expect(boxes[1]!.height).toBeGreaterThanOrEqual(44);
        }
      }
    });
  }
}

test('dark surfaces keep reading, forms, glossary, diagrams and practice feedback readable', async ({
  page,
  context,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/en/lessons/L05/');
  await expectReadable(page.locator('.lesson-prose th').first());
  await expectReadable(
    page.locator('.lesson-prose tbody tr').nth(2).locator('td').last(),
  );
  await expectReadable(page.locator('.reading-guide summary'));
  await page.goto('/en/sign-in/');
  await expectReadable(page.locator('input[type="email"]'));
  await page.goto('/en/glossary/');
  await expectReadable(page.locator('.glossary-filters button'));
  await page.goto('/en/numbers/');
  await expectReadable(page.locator('.family-natural small').first());
  await expectReadable(page.locator('.numbers-table thead th').first());
  await context.request.post('/auth/login/', {
    headers: { Origin: 'http://127.0.0.1:4321' },
    form: {
      locale: 'en',
      email: 'learner@example.invalid',
      password: 'correct-horse-battery',
    },
  });
  await page.goto('/en/lessons/L21/practice/');
  await expect(page.locator('.pp-option').first()).toBeVisible();
  await expectReadable(page.locator('.pp-instruction'));
  await page.locator('.pp-option input').first().check();
  await page.getByRole('button', { name: 'Check my answer' }).click();
  await expect(page.locator('.pp-feedback')).toBeVisible();
  for (const row of await page.locator('.pp-answer-row').all()) {
    await expectReadable(row);
  }
  for (const tag of await page.locator('.pp-tag').all()) {
    await expectReadable(tag);
  }
  await page.goto('/en/progress/');
  await expectReadable(page.locator('.progress-badge').first());
});
