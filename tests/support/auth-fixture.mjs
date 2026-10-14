// Isolated Auth protocol fixture, never imported into application code.
// Exercises the real SDK/HTTP/cookie flow; it is not a hosted Supabase proof.
import { createServer } from 'node:http';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
const secret = 'only-for-local-protocol-tests';
const encode = (value) =>
  Buffer.from(JSON.stringify(value)).toString('base64url');

export async function startAuthFixture(port = 54329) {
  const sessions = new Map();
  const knownUser = {
    id: randomUUID(),
    aud: 'authenticated',
    role: 'authenticated',
    email: 'learner@example.invalid',
    created_at: new Date().toISOString(),
    app_metadata: { provider: 'email' },
    user_metadata: {},
  };
  const refreshes = new Map();
  const sign = (payload) => {
    const body = encode({ alg: 'HS256', typ: 'JWT' }) + '.' + encode(payload);
    return (
      body + '.' + createHmac('sha256', secret).update(body).digest('base64url')
    );
  };
  const issue = ({
    expired = false,
    user,
    sessionId = randomUUID(),
    logoutFailure = false,
    unavailable = false,
  } = {}) => {
    user ??= {
      id: randomUUID(),
      aud: 'authenticated',
      role: 'authenticated',
      email: 'learner-' + randomUUID().slice(0, 6) + '@example.invalid',
      created_at: new Date().toISOString(),
      app_metadata: { provider: 'email' },
      user_metadata: {},
    };
    const exp = Math.floor(Date.now() / 1000) + (expired ? -60 : 3600);
    const session = {
      access_token: sign({
        sub: user.id,
        aud: 'authenticated',
        role: 'authenticated',
        iat: exp - 3600,
        exp,
        session_id: sessionId,
      }),
      refresh_token: randomUUID(),
      token_type: 'bearer',
      expires_in: expired ? -60 : 3600,
      expires_at: exp,
      user,
    };
    const record = {
      user,
      sessionId,
      active: true,
      logoutFailure,
      unavailable,
    };
    sessions.set(sessionId, record);
    refreshes.set(session.refresh_token, record);
    return session;
  };
  const verify = (token) => {
    try {
      const [head, body, signature] = token.split('.');
      const actual = Buffer.from(signature, 'base64url');
      const expected = createHmac('sha256', secret)
        .update(head + '.' + body)
        .digest();
      if (
        actual.length !== expected.length ||
        !timingSafeEqual(actual, expected)
      )
        return null;
      const claims = JSON.parse(Buffer.from(body, 'base64url').toString());
      const record = sessions.get(claims.session_id);
      return record?.active &&
        record.user.id === claims.sub &&
        claims.exp > Date.now() / 1000
        ? record
        : null;
    } catch {
      return null;
    }
  };
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1:' + port);
    const json = (status, data) => {
      res.writeHead(status, {
        'Content-Type': 'application/json',
        'X-Supabase-Api-Version': '2024-01-01',
      });
      res.end(JSON.stringify(data));
    };
    const failure = (status = 401) =>
      json(status, { code: 'bad_jwt', msg: 'Invalid fixture session' });
    try {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (body.length > 8192) return failure(400);
      }
      const data = body ? JSON.parse(body) : {};
      if (url.pathname === '/__fixture/session' && req.method === 'POST') {
        const session = issue(data);
        return json(200, {
          session,
          cookieName: 'sb-127-auth-token',
          cookieValue: 'base64-' + encode(session),
        });
      }
      if (url.pathname === '/__fixture/revoke' && req.method === 'POST') {
        const record = refreshes.get(data.refresh_token);
        if (record) record.active = false;
        return json(200, {});
      }
      if (url.pathname === '/auth/v1/token' && req.method === 'POST') {
        if (url.searchParams.get('grant_type') === 'password') {
          // One known learner; anything else looks like unknown credentials.
          if (
            data.email !== 'learner@example.invalid' ||
            data.password !== 'correct-horse-battery'
          )
            return json(400, {
              code: 'invalid_credentials',
              msg: 'Invalid login credentials',
            });
          return json(200, issue({ user: knownUser }));
        }
        if (url.searchParams.get('grant_type') === 'refresh_token') {
          const record = refreshes.get(data.refresh_token);
          if (!record?.active)
            return json(400, {
              code: 'refresh_token_not_found',
              msg: 'Invalid fixture refresh',
            });
          refreshes.delete(data.refresh_token);
          return json(200, issue(record));
        }
      }
      const record = verify(
        req.headers.authorization?.replace(/^Bearer /, '') ?? '',
      );
      if (url.pathname === '/auth/v1/user')
        return record?.unavailable
          ? json(503, { msg: 'Fixture unavailable' })
          : record
            ? json(200, record.user)
            : failure();
      if (url.pathname === '/auth/v1/logout' && req.method === 'POST') {
        if (!record) return failure();
        if (record.logoutFailure)
          return json(503, { msg: 'Fixture service unavailable' });
        if (url.searchParams.get('scope') !== 'local') return failure(400);
        record.active = false;
        return json(200, {});
      }
      return failure(404);
    } catch {
      return failure(400);
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
  return server;
}
