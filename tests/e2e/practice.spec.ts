import { test, expect, type BrowserContext } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const app = 'http://127.0.0.1:4321';
const fixture = 'http://127.0.0.1:54329';
const bank = JSON.parse(
  readFileSync('exercises/L05/v1.json', 'utf8'),
).exercises;

async function identify(context: BrowserContext) {
  const issued = await (
    await context.request.post(fixture + '/__fixture/session', { data: {} })
  ).json();
  await context.addCookies([
    {
      name: issued.cookieName,
      value: issued.cookieValue,
      url: app,
      httpOnly: true,
      sameSite: 'Lax',
    },
    { name: 'um-session', value: '1', url: app },
  ]);
  return issued.session;
}

test('hint exposure and active response survive closing, reload and language switching', async ({
  page,
  context,
}) => {
  await identify(context);
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/en/lessons/L05/practice/');
  await page.locator('.pp-step').nth(3).click();
  await page.locator(`input[value="${bank[3].answer}"]`).check();
  const hint = page.getByRole('button', { name: 'Show a hint' });
  await hint.focus();
  await page.keyboard.press('Enter');
  await expect(hint).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Enter');
  await expect(hint).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('link', { name: 'FR', exact: true }).click();
  await expect(page.locator('.pp-step[aria-current="step"]')).toContainText(
    '04',
  );
  await expect(page.locator(`input[value="${bank[3].answer}"]`)).toBeChecked();
  await page.reload();
  await expect(page.locator('.pp-step[aria-current="step"]')).toContainText(
    '04',
  );
  await page.getByRole('link', { name: 'EN', exact: true }).click();
  await expect(page.locator('.pp-step[aria-current="step"]')).toContainText(
    '04',
  );
  await expect(page.locator(`input[value="${bank[3].answer}"]`)).toBeChecked();
  await page.getByRole('link', { name: 'FR', exact: true }).click();
  await expect(page.locator('.pp-step[aria-current="step"]')).toContainText(
    '04',
  );
  const outgoing = page.waitForRequest(
    (r) => r.url().endsWith('/api/attempts/') && r.method() === 'POST',
  );
  const saved = page.waitForResponse((r) => r.url().endsWith('/api/attempts/'));
  await page.getByRole('button', { name: 'Vérifier ma réponse' }).focus();
  await page.keyboard.press('Enter');
  expect((await outgoing).postDataJSON().hintUsed).toBe(true);
  const result = await (await saved).json();
  expect(result.correct).toBe(true);
  expect(result.independentEvidence).toBe(false);
  await expect(page.locator('#pp-feedback-title')).toBeFocused();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});

for (const invalidation of ['version', 'learner', 'missing-item'] as const) {
  test(`active exercise falls back safely for a ${invalidation} mismatch`, async ({
    page,
    context,
  }) => {
    await identify(context);
    await page.goto('/en/lessons/L05/practice/');
    await page.locator('.pp-step').nth(3).click();
    await page.locator(`input[value="${bank[3].answer}"]`).check();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            JSON.parse(sessionStorage.getItem('um-practice:L05') ?? '{}')
              .currentExerciseId,
        ),
      )
      .toBe('L05-E04');
    await page.evaluate((reason) => {
      const draft = JSON.parse(sessionStorage.getItem('um-practice:L05')!);
      if (reason === 'version') draft.entries['L05-E04'].version += 1;
      else if (reason === 'learner') draft.learner = 'another-learner';
      else draft.currentExerciseId = 'L05-E99';
      sessionStorage.setItem('um-practice:L05', JSON.stringify(draft));
    }, invalidation);
    await page.reload();
    await expect(page.locator('.pp-step[aria-current="step"]')).toContainText(
      '01',
    );
    await page.locator('.pp-step').nth(3).click();
    if (invalidation === 'missing-item') {
      await expect(
        page.locator(`input[value="${bank[3].answer}"]`),
      ).toBeChecked();
    } else {
      await expect(page.locator('input:checked')).toHaveCount(0);
    }
  });
}

test('active exercise is restored by ID when exercise order changes', async ({
  page,
  context,
}) => {
  await identify(context);
  await page.goto('/en/lessons/L05/practice/');
  await page.locator('.pp-step').nth(3).click();
  await page.locator(`input[value="${bank[3].answer}"]`).check();
  await page.route('**/api/exercises/L05/', async (route) => {
    const response = await route.fetch();
    const payload = await response.json();
    const selected = payload.exercises.find(
      (exercise: { id: string }) => exercise.id === 'L05-E04',
    );
    payload.exercises = [
      selected,
      ...payload.exercises.filter(
        (exercise: { id: string }) => exercise.id !== selected.id,
      ),
    ];
    await route.fulfill({ response, json: payload });
  });
  await page.reload();
  await expect(page.locator('.pp-step[aria-current="step"]')).toContainText(
    '01',
  );
  await expect(page.locator('input[name="L05-E04"]:checked')).toHaveValue(
    bank[3].answer,
  );
});

test('sign in, wrong answer, retry, saved progress and later sign-in work together', async ({
  page,
}) => {
  const signIn = async () => {
    await page.goto('/en/sign-in/?next=/en/lessons/L05/practice/');
    await page
      .getByLabel('Email address', { exact: true })
      .fill('learner@example.invalid');
    await page
      .getByLabel('Password', { exact: true })
      .fill('correct-horse-battery');
    await page.locator('.auth-form button').click();
    await expect(page).toHaveURL('/en/lessons/L05/practice/');
  };
  await signIn();
  await page.locator('input[value="00"]').check();
  await page.getByRole('button', { name: 'Check my answer' }).click();
  await expect(page.locator('#pp-feedback-title')).toBeFocused();
  await page.getByRole('button', { name: 'Try this exercise again' }).click();
  await page.locator('input[value="10"]').check();
  const saved = page.waitForResponse((r) => r.url().endsWith('/api/attempts/'));
  await page.getByRole('button', { name: 'Check my answer' }).click();
  expect((await (await saved).json()).independentEvidence).toBe(false);
  await page.goto('/en/progress/');
  await expect(page.locator('.progress-history li')).toHaveCount(2);
  await page.reload();
  await expect(page.locator('.progress-history li')).toHaveCount(2);
  await page.locator('.profile-button').click();
  await page.locator('.profile-panel form button').click();
  await expect(page).toHaveURL('/en/sign-in/?signedOut=1');
  expect(
    await page.evaluate(() =>
      Object.keys(sessionStorage).filter((key) =>
        key.startsWith('um-practice:'),
      ),
    ),
  ).toEqual([]);
  await signIn();
  await page.goto('/en/progress/');
  await expect(page.locator('.progress-history li')).toHaveCount(2);
  await expect(page.locator('.progress-focus a')).toHaveAttribute(
    'href',
    /\/practice\/$/,
  );
});

test('direct practice operations enforce identity, origin, idempotency and ownership', async ({
  context,
  browser,
}) => {
  expect((await context.request.get('/api/exercises/L05/')).status()).toBe(401);
  const owner = await identify(context);
  const exerciseResponse = await context.request.get('/api/exercises/L05/');
  const delivered = JSON.stringify(await exerciseResponse.json());
  expect(delivered).not.toMatch(/"answer"|"explanation"|"feedback"/);
  const body = {
    submissionId: randomUUID(),
    exerciseId: 'L05-E01',
    version: 1,
    locale: 'en',
    response: { optionId: '10' },
    userId: randomUUID(),
    correct: false,
  };
  expect(
    (
      await context.request.post('/api/attempts/', {
        headers: { Origin: 'https://elsewhere.invalid' },
        data: body,
      })
    ).status(),
  ).toBe(403);
  const first = await context.request.post('/api/attempts/', {
    headers: { Origin: app },
    data: body,
  });
  expect(first.status()).toBe(201);
  expect((await first.json()).correct).toBe(true);
  const again = await context.request.post('/api/attempts/', {
    headers: { Origin: app },
    data: { ...body, response: { optionId: '00' } },
  });
  expect(again.status()).toBe(200);
  expect((await again.json()).duplicate).toBe(true);
  const other = await browser.newContext();
  try {
    const stranger = await identify(other);
    const headers = {
      apikey: 'sb_publishable_protocol_fixture',
      Authorization: `Bearer ${stranger.access_token}`,
    };
    const leaked = await other.request.get(
      `${fixture}/rest/v1/attempts?user_id=eq.${owner.user.id}`,
      { headers },
    );
    expect(await leaked.json()).toEqual([]);
    expect(
      (
        await other.request.post(fixture + '/rest/v1/attempts', {
          headers,
          data: body,
        })
      ).status(),
    ).toBe(403);
  } finally {
    await other.close();
  }
});
