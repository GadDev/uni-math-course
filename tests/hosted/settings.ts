const required = (name: string) => {
  const value = process.env[name];
  if (!value?.trim())
    throw new Error(`Missing required hosted test setting: ${name}`);
  return name.endsWith('_PASSWORD') ? value : value.trim();
};

const parseUrl = (value: string) => {
  try {
    return new URL(value);
  } catch {
    throw new Error('Invalid hosted URL setting');
  }
};

export function hostedSettings() {
  const localFixture = process.env.HOSTED_LOCAL_FIXTURE === '1';
  const target = parseUrl(
    localFixture ? 'http://127.0.0.1:4321' : required('HOSTED_BASE_URL'),
  );
  if (
    target.username ||
    target.password ||
    target.search ||
    target.hash ||
    target.pathname !== '/' ||
    (!localFixture && target.protocol !== 'https:')
  )
    throw new Error('HOSTED_BASE_URL must be a bare HTTPS origin');
  if (!localFixture && required('HOSTED_ALLOW_TEST_WRITES') !== '1')
    throw new Error(
      'Hosted tests require explicit synthetic-account write consent',
    );
  const account = (name: 'A' | 'B') => ({
    email: localFixture
      ? name === 'A'
        ? 'learner@example.invalid'
        : 'hosted-fixture-b@example.invalid'
      : required(`HOSTED_ACCOUNT_${name}_EMAIL`),
    password: localFixture
      ? 'correct-horse-battery'
      : required(`HOSTED_ACCOUNT_${name}_PASSWORD`),
  });
  const a = account('A');
  const b = account('B');
  if (a.email.toLowerCase() === b.email.toLowerCase())
    throw new Error(
      'Hosted acceptance requires two different synthetic accounts',
    );
  const appSha = localFixture ? 'local-fixture' : required('HOSTED_APP_SHA');
  if (!localFixture && !/^[a-f0-9]{40}$/.test(appSha))
    throw new Error('HOSTED_APP_SHA must be the full deployed commit SHA');
  const supabaseUrl = process.env.HOSTED_SUPABASE_URL;
  const publishableKey = process.env.HOSTED_SUPABASE_PUBLISHABLE_KEY;
  if (Boolean(supabaseUrl) !== Boolean(publishableKey))
    throw new Error('Set both hosted Data API settings or neither');
  if (localFixture && (supabaseUrl || publishableKey))
    throw new Error('Unset hosted Data API settings in local fixture mode');
  if (
    publishableKey &&
    (!publishableKey.startsWith('sb_publishable_') || /\s/.test(publishableKey))
  )
    throw new Error('Only a publishable key is allowed in hosted tests');
  if (supabaseUrl) {
    const dataOrigin = parseUrl(supabaseUrl);
    if (
      dataOrigin.protocol !== 'https:' ||
      dataOrigin.origin !== supabaseUrl ||
      dataOrigin.username ||
      dataOrigin.password
    )
      throw new Error('Hosted Data API setting must be a bare HTTPS origin');
  }
  return {
    localFixture,
    origin: target.origin,
    appSha,
    deployment: localFixture
      ? 'local-fixture'
      : required('HOSTED_DEPLOYMENT_ID'),
    operator: localFixture ? 'local-fixture' : required('HOSTED_OPERATOR'),
    a,
    b,
    supabaseUrl: localFixture ? 'http://127.0.0.1:54329' : supabaseUrl,
    publishableKey: localFixture
      ? 'sb_publishable_protocol_fixture'
      : publishableKey,
  };
}
