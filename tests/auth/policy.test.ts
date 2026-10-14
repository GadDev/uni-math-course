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
  for (const path of ['/en/', '/fr/account/', '/fr/lessons/L05/#main'])
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
