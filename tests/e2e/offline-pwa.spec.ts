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
        navigator.serviceWorker.ready.then((registration) => !!registration.active),
      ),
    )
    .toBe(true);
  await page
    .getByRole('button', { name: 'Télécharger pour le hors ligne' })
    .click();
  await expect(page.getByRole('status')).toContainText('Cours téléchargés', {
    timeout: 160_000,
  });

  await context.setOffline(true);
  await page.goto('/fr/lessons/L23/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.katex-mathml math').first()).toBeAttached();
  await expect(page.locator('astro-island').first()).toBeAttached();
  await page.goto('/en/lessons/L23/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
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
