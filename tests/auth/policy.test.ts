import test from 'node:test';
import assert from 'node:assert/strict';
import {
  authConfig,
  emailAllowed,
  safeReturn,
  sameOriginPost,
  smallForm,
} from '../../src/lib/auth/policy.ts';

const env = {
  AUTH_PROVIDER: 'password',
  SUPABASE_URL: 'https://pilot.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_fixture',
  AUTH_SITE_URL: 'https://pilot.example',
};
test('require explicit provider, publishable key and safe canonical origins', () => {
  assert.ok(authConfig(env));
  for (const replacement of [
    { AUTH_PROVIDER: '' },
    { SUPABASE_PUBLISHABLE_KEY: 'sb_secret_never' },
    { SUPABASE_PUBLISHABLE_KEY: 'legacy-service-role-jwt' },
    { AUTH_SITE_URL: 'http://public.example' },
    { AUTH_SITE_URL: 'https://user:pass@pilot.example' },
    { AUTH_SITE_URL: 'https://pilot.example/path' },
    { SUPABASE_URL: 'https://pilot.supabase.co/?secret=x' },
  ])
    assert.equal(authConfig({ ...env, ...replacement }), null);
  assert.ok(
    authConfig({
      ...env,
      AUTH_SITE_URL: 'http://localhost:4321',
      SUPABASE_URL: 'http://127.0.0.1:54321',
    }),
  );
});
test('return only to released local routes with a safe fragment', () => {
  for (const path of [
    '/en/',
    '/fr/account/',
    '/fr/chapters/C02/',
    '/en/chapters/C02/',
    '/fr/lessons/L05/#main',
    '/en/lessons/L05/practice/',
    '/fr/lessons/L20/practice/',
    '/en/lessons/L21/practice/',
    '/fr/lessons/L36/practice/?exercise=L36-E15&version=1',
    '/en/lessons/L01/',
  ])
    assert.equal(safeReturn(path, 'en'), path);
  for (const path of [
    '//evil.example',
    'https://evil.example',
    '/fr/../../evil',
    '/fr/%2f%2fevil',
    '/fr/\\evil',
    '/auth/callback/',
    '/en/account/?code=secret',
    '/en/lessons/missing/',
    '/en/lessons/L99/practice/',
    '/en/lessons/L00/',
    '/en/chapters/C99/',
    '/en/chapters/C02/?anything=extra',
    '/en/#main\n',
  ])
    assert.equal(safeReturn(path, 'en'), '/en/account/');
});
test('require same-origin POST for login and logout', () => {
  const config = authConfig(env)!;
  const request = (origin?: string, method = 'POST', site = 'same-origin') =>
    new Request('https://pilot.example/auth/logout/', {
      method,
      headers: {
        ...(origin ? { Origin: origin } : {}),
        'Sec-Fetch-Site': site,
      },
    });
  assert.equal(sameOriginPost(request('https://pilot.example'), config), true);
  for (const req of [
    request(),
    request('https://evil.example'),
    request('https://pilot.example', 'GET'),
    request('https://pilot.example', 'POST', 'cross-site'),
  ])
    assert.equal(sameOriginPost(req, config), false);
});
test('bound forms without trusting content-length', async () => {
  const request = (body: string, type = 'application/x-www-form-urlencoded') =>
    new Request('https://pilot.example/auth/start/', {
      method: 'POST',
      headers: { 'Content-Type': type },
      body,
    });
  assert.equal((await smallForm(request('locale=en')))?.get('locale'), 'en');
  assert.equal(await smallForm(request('x'.repeat(2049))), null);
  assert.equal(await smallForm(request('{}', 'application/json')), null);
});
test('only the password provider is enabled and the allowlist is case-insensitive', () => {
  assert.equal(authConfig({ ...env, AUTH_PROVIDER: 'google' }), null);
  assert.equal(authConfig({ ...env, AUTH_PROVIDER: 'azure' }), null);
  assert.equal(authConfig(env)!.allowedEmails, null);
  const config = authConfig({
    ...env,
    AUTH_ALLOWED_EMAILS: 'Ada.Lovelace@uni.lu, bob@uni.lu;carol@uni.lu',
  })!;
  assert.equal(emailAllowed(config, 'ada.lovelace@UNI.LU'), true);
  assert.equal(emailAllowed(config, 'carol@uni.lu'), true);
  assert.equal(emailAllowed(config, 'mallory@uni.lu'), false);
  assert.equal(emailAllowed(config, 'bob@uni.lu.evil.example'), false);
  assert.equal(emailAllowed(config, null), false);
  assert.equal(emailAllowed(authConfig(env)!, 'anyone@example.com'), true);
});

test('practice return targets preserve only bounded same-lesson exercise/version parameters', () => {
  for (const locale of ['fr', 'en'] as const) {
    const path = `/${locale}/lessons/L05/practice/`;
    const target = path + '?exercise=L05-E03&version=1';
    assert.equal(safeReturn(target, locale), target);
    assert.equal(
      safeReturn(path + '?version=1&exercise=L05-E03', locale),
      target,
    );
    assert.equal(safeReturn(target + '#main', locale), target + '#main');
    for (const query of [
      '?exercise=L06-E01&version=1',
      '?exercise=L05-E01',
      '?version=1',
      '?exercise=L05-E01&version=0',
      '?exercise=L05-E01&version=-1',
      '?exercise=L05-E01&version=1.5',
      '?exercise=L05-E01&version=01',
      '?exercise=L05-E01&version=1000000000',
      '?exercise=L05-E01&version=1&next=https://evil.example',
      '?exercise=L05-E01&exercise=L05-E02&version=1',
      '?exercise=L05-E01&version=1&version=2',
      '?exercise=%4C05-E01&version=1',
      '?exercise=L05-E01&version=1?x=y',
    ])
      assert.equal(safeReturn(path + query, locale), `/${locale}/account/`);
    assert.equal(
      safeReturn(`/${locale}/account/?exercise=L05-E01&version=1`, locale),
      `/${locale}/account/`,
    );
    assert.equal(
      safeReturn(`//evil.example${target}`, locale),
      `/${locale}/account/`,
    );
  }
});
