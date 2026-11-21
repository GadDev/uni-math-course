import { test, expect } from '@playwright/test';

test('PWA installs public resources and reads French and English lessons offline', async ({
  page,
  context,
  request,
}) => {
  test.setTimeout(180_000);
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  expect(manifest.display).toBe('standalone');
  expect(manifest.start_url).toBe('/fr/');

  await page.goto('/fr/offline/');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    'href',
    '/manifest.webmanifest',
  );
  await expect
    .poll(async () =>
      page.evaluate(() =>
        navigator.serviceWorker.ready.then(
          (registration) => !!registration.active,
        ),
      ),
    )
    .toBe(true);
  await page
    .getByRole('button', { name: 'Télécharger pour le hors ligne' })
    .click();
  await expect(page.getByRole('status')).toContainText('Cours téléchargés', {
    timeout: 160_000,
  });

  await expect(page.locator('#offline-coverage')).toContainText(
    '57 leçons bilingues (L01–L57)',
  );
  const index = await (await request.get('/offline-index.json')).json();
  expect(
    index.pages.filter((p: string) => /^\/(fr|en)\/lessons\/L\d{2}\/$/.test(p)),
  ).toHaveLength(114);
  const packedPaths = await page.evaluate(async () =>
    (await (await caches.open('uni-math-pack-v1')).keys()).map(
      (key) => new URL(key.url).pathname,
    ),
  );
  for (const lesson of ['L50', 'L54', 'L55', 'L57'])
    for (const locale of ['fr', 'en'])
      expect(packedPaths).toContain(`/${locale}/lessons/${lesson}/`);
  expect(
    packedPaths
      .filter((path) => !path.startsWith('/_astro/'))
      .some((path) =>
        /training-exams|cheat-sheet|\/lzw\/|\.pdf$|\/api\//.test(path),
      ),
  ).toBe(false);
  await context.setOffline(true);
  await page.goto('/fr/lessons/L23/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.katex-mathml math').first()).toBeAttached();
  await expect(page.locator('astro-island').first()).toBeAttached();
  await page.goto('/en/lessons/L23/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  for (const lesson of ['L50', 'L54', 'L55', 'L57']) {
    for (const locale of ['fr', 'en']) {
      await page.goto(`/${locale}/lessons/${lesson}/`);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('.offline-page')).toHaveCount(0);
      await expect(page.locator('.katex-mathml math').first()).toBeAttached();
    }
  }
  await page.goto('/fr/offline/');
  await expect(
    page.getByRole('heading', { name: /Étudier hors ligne/ }),
  ).toBeVisible();
  const apiResult = await page.evaluate(async () => {
    try {
      await fetch('/api/attempts');
      return 'unexpected';
    } catch {
      return 'offline';
    }
  });
  expect(apiResult).toBe('offline');
});
