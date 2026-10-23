import { test, expect } from '@playwright/test';

const origin = 'http://127.0.0.1:4321';
for (const locale of ['fr', 'en']) {
  test(`verified practice hydrates without extra exercise/session requests or answer leaks (${locale})`, async ({
    page,
    context,
  }) => {
    const issued = await (
      await context.request.post('http://127.0.0.1:54329/__fixture/session', {
        data: {},
      })
    ).json();
    await context.addCookies([
      {
        name: issued.cookieName,
        value: issued.cookieValue,
        url: origin,
        httpOnly: true,
      },
      { name: 'um-session', value: '1', url: origin },
    ]);
    const requests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/'))
        requests.push(new URL(request.url()).pathname);
    });
    const response = await page.goto(`/${locale}/lessons/L05/practice/`);
    expect(response?.headers()['cache-control']).toContain('no-store');
    await expect(page.locator('.pp-options')).toBeVisible();
    await page.waitForLoadState('networkidle');
    expect(requests).toEqual([]);
    await expect(page.locator('.profile-menu')).toBeVisible();
    const props = await page
      .locator('astro-island')
      .evaluateAll((islands) =>
        islands
          .map((island) => island.getAttribute('props') ?? '')
          .find((props) => props.includes('initialData')),
      );
    expect(props).toBeTruthy();
    expect(props).not.toMatch(
      /"(?:answer|correctAnswer|feedback|explanation|provenance|grading)"/,
    );
    expect(props).toContain('L05-E01');
    // Removing the redundant initial check must not remove return-time checks.
    const checked = page.waitForResponse((r) =>
      r.url().endsWith('/api/auth/session/'),
    );
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    expect((await checked).status()).toBe(200);
    await expect(page.locator('.pp-options')).toBeVisible();
    expect(requests).toEqual(['/api/auth/session/']);
  });
}
