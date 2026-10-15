import {
  test,
  expect,
  type BrowserContext,
  type APIRequestContext,
  type Page,
} from '@playwright/test';
const fixtureURL = 'http://127.0.0.1:54329';
const appURL = 'http://127.0.0.1:4321';

test('two concurrent browsers retain their own server-verified identity', async ({
  request,
  context,
  browser,
}) => {
  const second = await browser.newContext();
  try {
    const one = await session(request, context);
    const two = await session(request, second);
    for (let i = 0; i < 3; i++) {
      const [a, b] = await Promise.all([
        context.request.get(appURL + '/api/auth/session/'),
        second.request.get(appURL + '/api/auth/session/'),
      ]);
      expect((await a.json()).user.id).toBe(one.session.user.id);
      expect((await b.json()).user.id).toBe(two.session.user.id);
      expect(one.session.user.id).not.toBe(two.session.user.id);
    }
  } finally {
    await second.close();
  }
});

test('wrong credentials fail generically and create no session', async ({
  context,
}) => {
  for (const form of [
    { email: 'learner@example.invalid', password: 'wrong-password' },
    { email: 'stranger@example.invalid', password: 'correct-horse-battery' },
    { email: '', password: '' },
  ]) {
    const response = await context.request.post(appURL + '/auth/login/', {
      headers: { Origin: appURL },
      form: { locale: 'en', ...form },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(303);
    expect(response.headers().location).toBe('/en/sign-in/?error=invalid');
    expect(response.headers()['cache-control']).toBe('private, no-store');
    expect(await response.text()).not.toContain('Invalid login credentials');
  }
  expect(
    (await context.request.get(appURL + '/api/auth/session/')).status(),
  ).toBe(401);
});

test('valid credentials sign in through a server-set HttpOnly cookie', async ({
  context,
}) => {
  const response = await context.request.post(appURL + '/auth/login/', {
    headers: { Origin: appURL },
    form: {
      locale: 'en',
      email: 'learner@example.invalid',
      password: 'correct-horse-battery',
    },
    maxRedirects: 0,
  });
  expect(response.headers().location).toBe('/en/account/');
  expect(
    (await context.request.get(appURL + '/api/auth/session/')).status(),
  ).toBe(200);
});

test('a provider lookup outage fails closed with an unavailable response', async ({
  request,
  context,
}) => {
  await session(request, context, { unavailable: true });
  const response = await context.request.get('/api/auth/session/');
  expect(response.status()).toBe(503);
  expect(await response.json()).toEqual({ error: 'auth_unavailable' });
  const account = await context.request.get('/en/account/');
  expect(account.status()).toBe(503);
  expect(await account.text()).not.toContain('learner-');
});

test('same-origin malformed and oversized forms fail before any auth mutation', async ({
  context,
}) => {
  for (const path of ['/auth/login/', '/auth/logout/']) {
    const malformed = await context.request.post(path, {
      headers: { Origin: appURL },
      data: { locale: 'en' },
    });
    expect(malformed.status()).toBe(400);
    const large = await context.request.post(path, {
      headers: {
        Origin: appURL,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: 'next=' + 'x'.repeat(3000),
    });
    expect(large.status()).toBe(400);
  }
});

async function signIn(page: Page, button: string) {
  await page
    .getByLabel(/Email address|Adresse e-mail/)
    .fill('learner@example.invalid');
  await page.getByLabel(/Password|Mot de passe/).fill('correct-horse-battery');
  await page.getByRole('button', { name: button }).click();
}

async function session(
  request: APIRequestContext,
  context: BrowserContext,
  options: Record<string, unknown> = {},
  chunks = false,
) {
  const response = await request.post(fixtureURL + '/__fixture/session', {
    data: options,
  });
  const fixture = await response.json();
  const values: { name: string; value: string }[] = chunks
    ? fixture.cookieValue
        .match(/.{1,200}/g)
        .map((value: string, index: number) => ({
          name: fixture.cookieName + '.' + index,
          value,
        }))
    : [{ name: fixture.cookieName, value: fixture.cookieValue }];
  await context.addCookies(
    values.map((cookie) => ({
      ...cookie,
      url: appURL,
      httpOnly: true,
      sameSite: 'Lax' as const,
    })),
  );
  return fixture;
}

test('private requests reject anonymous users and never cache sessions', async ({
  request,
}) => {
  const response = await request.get('/api/auth/session/');
  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({ error: 'unauthenticated' });
  expect(response.headers()['cache-control']).toBe('private, no-store');
  expect(response.headers()['vercel-cdn-cache-control']).toBe('no-store');
  const account = await request.get('/fr/account/', { maxRedirects: 0 });
  expect(account.status()).toBe(303);
  expect(account.headers().location).toBe(
    '/fr/sign-in/?next=%2Ffr%2Faccount%2F',
  );
});

test('real SDK password sign-in, verified account and local logout work together', async ({
  page,
  context,
}) => {
  await page.goto('/en/sign-in/');
  await signIn(page, 'Sign in');
  await expect(page).toHaveURL('/en/account/');
  await expect(
    page.getByRole('heading', { name: 'Your session is active' }),
  ).toBeVisible();
  const cookies = (await context.cookies()).filter((c) =>
    c.name.startsWith('sb-'),
  );
  expect(cookies.length).toBeGreaterThan(0);
  for (const cookie of cookies) {
    expect(cookie.httpOnly).toBe(true);
    expect(cookie.sameSite).toBe('Lax');
    expect(cookie.path).toBe('/');
  }
  const source = await page.content();
  expect(source).not.toContain('access_token');
  expect(source).not.toContain('refresh_token');
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  const oldCookie = cookies.map((c) => c.name + '=' + c.value).join('; ');
  await page.getByRole('link', { name: 'FR', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Votre session est active' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Se déconnecter de ce navigateur' })
    .click();
  await expect(page).toHaveURL('/fr/sign-in/?signedOut=1');
  await expect(page.getByRole('status')).toHaveText(
    'Vous êtes déconnecté de ce navigateur.',
  );
  expect(
    (await context.cookies()).filter((c) => c.name.startsWith('sb-')),
  ).toHaveLength(0);
  const replay = await context.request.get('/api/auth/session/', {
    headers: { Cookie: oldCookie },
  });
  expect(replay.status()).toBe(401);
});

test('sign-in language switching preserves the released lesson and fragment', async ({
  page,
}) => {
  await page.goto('/fr/sign-in/?next=%2Ffr%2Flessons%2FL05%2F%23main');
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page.locator('input[name="next"]')).toHaveValue(
    '/en/lessons/L05/#main',
  );
  await signIn(page, 'Sign in');
  await expect(page).toHaveURL('/en/lessons/L05/#main');
});

test('external return targets fall back to the local account', async ({
  page,
}) => {
  await page.goto('/en/sign-in/?next=https%3A%2F%2Fevil.example');
  await expect(page.locator('input[name="next"]')).toHaveValue('/en/account/');
  await signIn(page, 'Sign in');
  await expect(page).toHaveURL('/en/account/');
});

test('a failed login attempt does not log an existing user out', async ({
  request,
  context,
}) => {
  await session(request, context);
  await context.request.post('/auth/login/', {
    headers: { Origin: appURL },
    form: { locale: 'en', email: 'x@example.invalid', password: 'nope' },
    maxRedirects: 0,
  });
  expect((await context.request.get('/api/auth/session/')).status()).toBe(200);
});

test('a forged cookie cannot impersonate its embedded user', async ({
  request,
  context,
}) => {
  const fixture = await session(request, context);
  fixture.session.access_token =
    fixture.session.access_token.slice(0, -3) + 'bad';
  fixture.session.user.id = 'attacker-chosen-owner';
  await context.addCookies([
    {
      name: fixture.cookieName,
      value:
        'base64-' +
        Buffer.from(JSON.stringify(fixture.session)).toString('base64url'),
      url: appURL,
    },
  ]);
  const response = await context.request.get('/api/auth/session/');
  expect(response.status()).toBe(401);
  expect(await response.text()).not.toContain('attacker-chosen-owner');
});

test('a valid JWT with a falsified embedded user still resolves to the verified owner', async ({
  request,
  context,
}) => {
  const fixture = await session(request, context);
  const verifiedId = fixture.session.user.id;
  fixture.session.user.id = 'attacker-chosen-owner';
  await context.addCookies([
    {
      name: fixture.cookieName,
      value:
        'base64-' +
        Buffer.from(JSON.stringify(fixture.session)).toString('base64url'),
      url: appURL,
    },
  ]);
  const response = await context.request.get('/api/auth/session/');
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ user: { id: verifiedId } });
});

test('expired chunked cookies refresh, rotate and survive the next request', async ({
  request,
  context,
}) => {
  const fixture = await session(request, context, { expired: true }, true);
  const response = await context.request.get('/api/auth/session/');
  expect(response.status()).toBe(200);
  expect((await response.json()).user.id).toBe(fixture.session.user.id);
  expect(response.headers()['cache-control']).toBe('private, no-store');
  const cookies = (await context.cookies()).filter((c) =>
    c.name.startsWith('sb-'),
  );
  expect(cookies).toHaveLength(1);
  expect(cookies[0]!.value).not.toContain(fixture.session.refresh_token);
  expect(cookies[0]!.httpOnly).toBe(true);
  expect(cookies[0]!.sameSite).toBe('Lax');
  expect((await context.request.get('/api/auth/session/')).status()).toBe(200);
});

test('revoked refresh/session is rejected and cannot refresh back into an account', async ({
  request,
  context,
}) => {
  const fixture = await session(request, context, { expired: true });
  await request.post(fixtureURL + '/__fixture/revoke', {
    data: { refresh_token: fixture.session.refresh_token },
  });
  expect((await context.request.get('/api/auth/session/')).status()).toBe(401);
  const account = await context.request.get('/en/account/', {
    maxRedirects: 0,
  });
  expect(account.status()).toBe(303);
});

test('cross-site and GET mutations fail without disturbing a signed-in session', async ({
  request,
  context,
}) => {
  await session(request, context);
  for (const path of ['/auth/login/', '/auth/logout/']) {
    expect((await context.request.get(path)).status()).toBe(405);
    for (const headers of [{ Origin: 'https://evil.example' }, {}] as Record<
      string,
      string
    >[]) {
      expect(
        (
          await context.request.post(path, { headers, form: { locale: 'en' } })
        ).status(),
      ).toBe(403);
    }
  }
  expect((await context.request.get('/api/auth/session/')).status()).toBe(200);
});

test('logout outage clears browser credentials and reports uncertain revocation', async ({
  request,
  context,
  page,
}) => {
  await session(request, context, { logoutFailure: true });
  await page.goto('/en/account/');
  await page.getByRole('button', { name: 'Sign out of this browser' }).click();
  await expect(page).toHaveURL('/en/sign-in/?error=logout');
  await expect(page.getByRole('alert')).toContainText('did not confirm');
  expect(
    (await context.cookies()).filter((c) => c.name.startsWith('sb-')),
  ).toHaveLength(0);
});

test('unconfigured deployment stays disabled and public reading still works', async ({
  page,
  request,
}) => {
  await page.goto('http://127.0.0.1:4323/fr/sign-in/');
  await expect(
    page.getByRole('button', { name: 'Se connecter' }),
  ).toBeDisabled();
  await expect(page.getByRole('status')).toContainText(
    'une fois le service configuré',
  );
  expect(
    (await request.get('http://127.0.0.1:4323/api/auth/session/')).status(),
  ).toBe(503);
  await page.goto('http://127.0.0.1:4323/fr/lessons/L05/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

for (const width of [320, 375, 768, 1280]) {
  test(
    'French sign-in supports keyboard and geometry at ' + width + 'px',
    async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/fr/sign-in/');
      await page.getByLabel('Adresse e-mail').fill('learner@example.invalid');
      await page.getByLabel('Mot de passe').fill('correct-horse-battery');
      const button = page.getByRole('button', { name: 'Se connecter' });
      await button.focus();
      await expect(button).toBeFocused();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.keyboard.press('Enter');
      await expect(
        page.getByRole('heading', { name: 'Votre session est active' }),
      ).toBeVisible();
    },
  );
}
