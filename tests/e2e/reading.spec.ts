import { test, expect } from '@playwright/test';

test('read the bilingual pilot and preserve lesson/anchor on language switching', async ({
  page,
}) => {
  await page.goto('/fr/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await page.getByRole('link', { name: 'Lire la leçon' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'implication',
  );
  await expect(page.locator('.katex-mathml math').first()).toBeAttached();
  await expect(page.locator('table tr')).toHaveCount(5);
  await page.goto('/fr/lessons/L05/#main');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL('/en/lessons/L05/#main');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Implication',
  );
  await expect(
    page.getByRole('link', { name: 'FR', exact: true }),
  ).toHaveAttribute('href', '/fr/lessons/L05/');
});

test('Radix island hydrates and the reading disclosure works by keyboard', async ({
  page,
}) => {
  await page.goto('/en/');
  const button = page.getByRole('button', { name: 'How to use this notebook' });
  await expect(button).toBeVisible();
  await expect(button).toBeEnabled();
  await expect(
    page.getByText('Read an example, then explain the rule'),
  ).not.toBeVisible();
  const frame = await page.locator('.reading-notice-theme').boundingBox();
  const notice = await page.locator('.reading-notice').boundingBox();
  expect(frame!.height).toBeLessThanOrEqual(notice!.height + 4);
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('button', { name: 'Hide the tip' }),
  ).toHaveAttribute('aria-expanded', 'true');
  await expect(
    page.getByText('Read an example, then explain the rule'),
  ).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(
    page.getByText('Read an example, then explain the rule'),
  ).not.toBeVisible();
});

for (const width of [320, 375, 768, 1280]) {
  test('French reading fits at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/fr/lessons/L05/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    const brand = await page.locator('.brand').boundingBox();
    const language = await page.locator('.language-switch').boundingBox();
    expect(brand).not.toBeNull();
    expect(language).not.toBeNull();
    expect(brand!.x + brand!.width).toBeLessThanOrEqual(language!.x);
  });
}

test('English/French shell reports practice development state and links to real sign-in', async ({
  page,
}) => {
  await page.goto('/en/');
  await expect(
    page.getByText('Interactive exercises and progress tracking'),
  ).toBeVisible();
  await expect(
    page
      .locator('.practice-status')
      .getByRole('link', { name: 'Sign in', exact: true }),
  ).toHaveAttribute('href', '/en/sign-in/');
  await page.goto('/en/lessons/missing/');
  await expect(
    page.getByRole('heading', { name: 'Page introuvable' }),
  ).toBeVisible();
});

for (const locale of ['fr', 'en']) {
  for (const width of [320, 375, 768, 1280]) {
    test(`Signed-in header fits and supports keyboard (${locale}, ${width}px)`, async ({
      page,
      context,
    }) => {
      await context.request.post('/auth/login/', {
        headers: { Origin: 'http://127.0.0.1:4321' },
        form: {
          locale,
          email: 'learner@example.invalid',
          password: 'correct-horse-battery',
        },
      });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/`);
      const menu = page.locator('[data-profile-menu]');
      await expect(menu).toBeVisible();
      const button = menu.locator('button').first();
      await button.focus();
      await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      const panel = await menu.locator('.profile-panel').boundingBox();
      expect(panel!.x).toBeGreaterThanOrEqual(0);
      expect(panel!.x + panel!.width).toBeLessThanOrEqual(width);
      await page.keyboard.press('Escape');
      await expect(button).toBeFocused();
      await expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  }
  for (const width of [
    320, 375, 768, 859, 860, 861, 1099, 1100, 1101, 1280, 1440,
  ]) {
    test(`Signal public pages retain header geometry (${locale}, ${width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of [`/${locale}/`, `/${locale}/lessons/L05/`]) {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width);
        const header = await page.locator('.site-header').boundingBox();
        expect(header!.height).toBeLessThanOrEqual(width > 860 ? 100 : 145);
        const nav = await page.locator('.primary-nav').boundingBox();
        const action = await page.locator('.header-sign-in').boundingBox();
        if (width > 860) {
          expect(nav!.x + nav!.width).toBeLessThanOrEqual(action!.x);
        } else {
          // Actions occupy the first row; navigation gets the full second row.
          expect(action!.y + action!.height).toBeLessThanOrEqual(nav!.y);
        }
        const brand = await page.locator('.brand').boundingBox();
        const localeControl = await page
          .locator('.language-switch')
          .boundingBox();
        expect(brand!.x + brand!.width).toBeLessThanOrEqual(localeControl!.x);
        for (const link of await page.locator('.primary-nav a').all()) {
          const size = await link.boundingBox();
          expect(size!.height).toBeLessThanOrEqual(48);
        }
      }
    });
  }
}

test('section navigation preserves the guided example when switching language', async ({
  page,
}) => {
  await page.goto('/fr/lessons/L05/');
  const example = page
    .locator('.section-nav')
    .getByRole('link', { name: /Exemple guidé/ });
  await example.click();
  const frenchFragment = new URL(page.url()).hash;
  expect(frenchFragment).not.toBe('');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/lessons\/L05\/#guided-example/);
  await expect(
    page.getByRole('heading', { name: /Guided example:/ }),
  ).toBeInViewport();
  await page.getByRole('link', { name: 'FR', exact: true }).click();
  expect(new URL(page.url()).hash).toBe(frenchFragment);
  await page.setViewportSize({ width: 375, height: 900 });
  const contents = page.locator('.mobile-contents');
  await contents.locator('summary').click();
  await expect(
    contents.getByRole('link', { name: /Exemple guidé/ }),
  ).toBeVisible();
});

test('Signal keeps the skip link, focus visibility and mathematical readings', async ({
  page,
}) => {
  await page.goto('/fr/lessons/L05/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Aller au contenu' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.keyboard.press('Tab');
  const focusedOutline = await page.evaluate(
    () => getComputedStyle(document.activeElement!).outlineWidth,
  );
  expect(focusedOutline).not.toBe('0px');
  await expect(page.locator('.katex-mathml math').first()).toBeAttached();
  await expect(
    page.getByText('Dans ce tableau, 0 signifie faux et 1 signifie vrai.'),
  ).toBeVisible();
  const falseRow = page.locator('.lesson-prose tbody tr').nth(2);
  await expect(falseRow.locator('td').last()).toHaveText('0');
  await page.goto('/fr/');
  await expect(
    page.locator('nav[aria-label="Langue"] [aria-current="page"]'),
  ).toHaveText('FR');
  await expect(
    page.locator('.feature-formula .katex-mathml math'),
  ).toBeAttached();
});
