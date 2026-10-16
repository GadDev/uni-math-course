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

test('lifetime history keeps archived records and labels unavailable explanations', async ({
  page,
  context,
}) => {
  const session = await identify(context);
  for (const [exerciseId, version] of [
    ['L99-E01', 99],
    ['L05-E01', 1],
  ] as const) {
    const saved = await context.request.post(
      fixture + '/rest/v1/rpc/record_attempt',
      {
        headers: { apikey: 'sb_secret_protocol_fixture' },
        data: {
          p_attempt: {
            user_id: session.user.id,
            submission_id: randomUUID(),
            lesson_id: exerciseId.slice(0, 3),
            exercise_id: exerciseId,
            exercise_version: version,
            response: { optionId: '00' },
            correct: false,
            hint_used: true,
            locale: 'en',
          },
        },
      },
    );
    expect(saved.status()).toBe(200);
  }
  await page.goto('/en/progress/');
  await expect(page.locator('.progress-stats > div').nth(1)).toContainText('2');
  await expect(page.locator('.progress-stats > div').nth(1)).toContainText(
    '2 of them aided',
  );
  await expect(page.locator('.progress-history li')).toHaveCount(2);
  const archived = page
    .locator('.progress-history li')
    .filter({ hasText: 'L99' });
  await expect(archived).toContainText('v99');
  await expect(archived).toContainText('Archived version');
  await expect(archived).toContainText('explanation is unavailable');
  const current = page
    .locator('.progress-history li')
    .filter({ hasText: 'L05' });
  await current.locator('summary').click();
  await expect(current).toContainText('condition is false');
  await expect(page.locator('.progress-focus a')).toHaveAttribute(
    'href',
    '/en/lessons/L05/practice/?exercise=L05-E01&version=1',
  );
});

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
    expectedLearnerId: owner.user.id,
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

for (const locale of ['fr', 'en'] as const) {
  test(`pending choice keeps the submitted snapshot and prevents answer/hint edits (${locale})`, async ({
    page,
    context,
  }) => {
    await identify(context);
    await page.goto(`/${locale}/lessons/L05/practice/`);
    await page.locator('input[value="10"]').check();
    let release!: () => void;
    let recorded!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const saved = new Promise<void>((resolve) => {
      recorded = resolve;
    });
    await page.route('**/api/attempts/', async (route) => {
      const response = await route.fetch();
      recorded();
      await gate;
      await route.fulfill({ response });
    });
    try {
      await page.locator('.pp-button-solid').click();
      await saved;
      await expect(page.locator('input[value="00"]')).toBeDisabled();
      await expect(page.locator('.pp-button-outline').first()).toBeDisabled();
      await expect(page.locator('input[value="10"]')).toBeChecked();
      const draft = await page.evaluate(() =>
        JSON.parse(sessionStorage.getItem('um-practice:L05')!),
      );
      expect(draft.entries['L05-E01'].submission).toEqual({
        answers: { choice: '10' },
        hintUsed: false,
      });
    } finally {
      release();
    }
    await expect(page.locator('.pp-feedback')).toBeVisible();
    await expect(page.locator('.pp-answer .pp-tag')).toHaveText('Correct');
    await expect(page.locator('input:checked')).toHaveValue('10');
    await expect(page.locator('#pp-feedback-title')).toBeFocused();
    // Recorded choices, rather than mutable draft choices, restore feedback.
    await page.evaluate(() => {
      const draft = JSON.parse(sessionStorage.getItem('um-practice:L05')!);
      draft.entries['L05-E01'].answers.choice = '00';
      sessionStorage.setItem('um-practice:L05', JSON.stringify(draft));
    });
    await page.reload();
    await expect(page.locator('.pp-feedback')).toBeVisible();
    await expect(page.locator('input:checked')).toHaveValue('10');
    const alternate = locale === 'fr' ? 'en' : 'fr';
    await page
      .getByRole('link', { name: alternate.toUpperCase(), exact: true })
      .click();
    await expect(page.locator('.pp-feedback')).toBeVisible();
    await expect(page.locator('input:checked')).toHaveValue('10');
  });

  for (const exerciseIndex of [0, 1]) {
    test(`lost acknowledgement retries the same snapshot after reload/language switch (${locale}, ${exerciseIndex})`, async ({
      page,
      context,
    }) => {
      await identify(context);
      await page.setViewportSize({ width: 320, height: 900 });
      await page.goto(`/${locale}/lessons/L05/practice/`);
      const exercise = bank[exerciseIndex];
      await page.locator('.pp-step').nth(exerciseIndex).click();
      if (exercise.type === 'single-choice')
        await page.locator(`input[value="${exercise.answer}"]`).check();
      else
        for (const [row, value] of Object.entries(exercise.answer))
          await page
            .locator(`input[name="${exercise.id}-${row}"][value="${value}"]`)
            .check();
      await page.locator('.pp-button-outline').first().click();
      let original: Record<string, unknown>;
      await page.route(
        '**/api/attempts/',
        async (route) => {
          original = route.request().postDataJSON();
          await route.fetch(); // Commit succeeds; only its acknowledgement is lost.
          await route.abort('failed');
        },
        { times: 1 },
      );
      await page.locator('.pp-button-solid').click();
      await expect(page.locator('.practice-error')).toBeVisible();
      await expect(page.locator('.pp-question input').first()).toBeDisabled();
      await page.reload();
      await expect(page.locator('.pp-step[aria-current="step"]')).toContainText(
        String(exerciseIndex + 1).padStart(2, '0'),
      );
      const alternate = locale === 'fr' ? 'en' : 'fr';
      await page
        .getByRole('link', { name: alternate.toUpperCase(), exact: true })
        .click();
      await expect(page.locator('.pp-question input').first()).toBeDisabled();
      const outgoing = page.waitForRequest(
        (request) =>
          request.url().endsWith('/api/attempts/') &&
          request.method() === 'POST',
      );
      const returned = page.waitForResponse((response) =>
        response.url().endsWith('/api/attempts/'),
      );
      await page.locator('.pp-button-solid').click();
      const resent = (await outgoing).postDataJSON();
      expect(resent.submissionId).toBe(original!.submissionId);
      expect(resent.response).toEqual(original!.response);
      expect(resent.hintUsed).toBe(true);
      const result = await (await returned).json();
      expect(result.duplicate).toBe(true);
      expect(result.response).toEqual(original!.response);
      expect(result.hintUsed).toBe(true);
      await expect(page.locator('.pp-feedback')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
      await page.goto(`/${alternate}/progress/`);
      await expect(page.locator('.progress-history li')).toHaveCount(1);
    });
  }
}

test('legacy uncertain choice reconciles saved answers before feedback and deliberate retry gets a new id', async ({
  page,
  context,
}) => {
  const session = await identify(context);
  const submissionId = randomUUID();
  const saved = await context.request.post('/api/attempts/', {
    headers: { Origin: app },
    data: {
      expectedLearnerId: session.user.id,
      submissionId,
      exerciseId: 'L05-E01',
      version: 1,
      locale: 'en',
      hintUsed: false,
      response: { optionId: '00' },
    },
  });
  expect(saved.status()).toBe(201);
  await page.goto('/en/lessons/L05/practice/');
  await page.locator('.pp-options').waitFor();
  await page.evaluate(
    ({ learner, submissionId }) => {
      sessionStorage.setItem(
        'um-practice:L05',
        JSON.stringify({
          learner,
          currentExerciseId: 'L05-E01',
          entries: {
            'L05-E01': {
              version: 1,
              answers: { choice: '10' },
              hintShown: false,
              hintUsed: false,
              submissionId,
              result: {
                correct: false,
                feedback: { fr: 'old', en: 'old' },
                explanation: { fr: 'old', en: 'old' },
              },
            },
          },
        }),
      );
    },
    { learner: session.user.id, submissionId },
  );
  await page.reload();
  await expect(page.locator('.pp-feedback')).toHaveCount(0);
  await expect(page.locator('input[value="10"]')).toBeDisabled();
  await page.getByRole('button', { name: 'Check saved response' }).click();
  await expect(page.locator('.pp-feedback')).toBeVisible();
  await expect(page.locator('input:checked')).toHaveValue('00');
  await page.getByRole('button', { name: 'Try this exercise again' }).click();
  await expect(page.locator('input[value="10"]')).toBeEnabled();
  await page.locator('input[value="10"]').check();
  const outgoing = page.waitForRequest(
    (request) =>
      request.url().endsWith('/api/attempts/') && request.method() === 'POST',
  );
  await page.getByRole('button', { name: 'Check my answer' }).click();
  expect((await outgoing).postDataJSON().submissionId).not.toBe(submissionId);
  await expect(page.locator('.pp-feedback')).toBeVisible();
  await expect(page.locator('input:checked')).toHaveValue('10');
  await page.goto('/en/progress/');
  await expect(page.locator('.progress-history li')).toHaveCount(2);
});

for (const locale of ['fr', 'en'] as const) {
  test(`review links override a different active draft without dropping its answers (${locale})`, async ({
    page,
    context,
  }) => {
    const session = await identify(context);
    // Save an E01 mistake, then leave an unfinished E06 draft active.
    await context.request.post('/api/attempts/', {
      headers: { Origin: app },
      data: {
        expectedLearnerId: session.user.id,
        submissionId: randomUUID(),
        exerciseId: 'L05-E01',
        version: 1,
        locale,
        response: { optionId: '00' },
      },
    });
    await page.goto(`/${locale}/lessons/L05/practice/`);
    await page.locator('.pp-step').nth(5).click();
    await page.locator(`input[value="${bank[5].answer}"]`).check();
    await page.goto(`/${locale}/progress/`);
    const review = page.locator('.practice-exercise a').first();
    await expect(review).toHaveAttribute(
      'href',
      `/${locale}/lessons/L05/practice/?exercise=L05-E01&version=1`,
    );
    await expect(page.locator('.progress-focus a')).toHaveAttribute(
      'href',
      `/${locale}/lessons/L05/practice/?exercise=L05-E01&version=1`,
    );
    await review.click();
    await expect(page.locator('.pp-step[aria-current="step"]')).toContainText(
      '01',
    );
    const alternate = locale === 'fr' ? 'en' : 'fr';
    await page
      .getByRole('link', { name: alternate.toUpperCase(), exact: true })
      .click();
    await expect(page.locator('.pp-step[aria-current="step"]')).toContainText(
      '01',
    );
    // Choosing another exercise consumes the original intent for future navigation.
    await page.locator('.pp-step').nth(5).click();
    await expect(
      page.locator(`input[value="${bank[5].answer}"]`),
    ).toBeChecked();
    await page.reload();
    await expect(page.locator('.pp-step[aria-current="step"]')).toContainText(
      '06',
    );
    await page
      .getByRole('link', { name: locale.toUpperCase(), exact: true })
      .click();
    await expect(page.locator('.pp-step[aria-current="step"]')).toContainText(
      '06',
    );
    // A normal visit continues to use the existing draft selection.
    await page.goto(`/${locale}/lessons/L05/practice/`);
    await expect(page.locator('.pp-step[aria-current="step"]')).toContainText(
      '06',
    );
    for (const query of [
      'exercise=L05-E99&version=1',
      'exercise=L05-E01&version=999',
      'exercise=L06-E01&version=1',
      'exercise=L05-E01&version=1&version=2',
    ]) {
      await page.goto(`/${locale}/lessons/L05/practice/?${query}`);
      await expect(page.locator('.pp-step[aria-current="step"]')).toContainText(
        '06',
      );
      await expect(
        page.locator(`input[value="${bank[5].answer}"]`),
      ).toBeChecked();
    }
  });

  test(`anonymous target survives failed login and language switching (${locale})`, async ({
    page,
  }) => {
    const destination = `/${locale}/lessons/L05/practice/?exercise=L05-E03&version=1`;
    await page.goto(destination);
    await expect(page.locator('input[name="next"]')).toHaveValue(destination);
    await page.locator('#email').fill('learner@example.invalid');
    await page.locator('#password').fill('wrong-password');
    await page.locator('.auth-form button').click();
    await expect(page.locator('input[name="next"]')).toHaveValue(destination);
    const alternate = locale === 'fr' ? 'en' : 'fr';
    await page
      .getByRole('link', { name: alternate.toUpperCase(), exact: true })
      .click();
    const translated = destination.replace(`/${locale}/`, `/${alternate}/`);
    await expect(page.locator('input[name="next"]')).toHaveValue(translated);
    await page.locator('#email').fill('learner@example.invalid');
    await page.locator('#password').fill('correct-horse-battery');
    await page.locator('.auth-form button').click();
    await expect(page).toHaveURL(translated);
    await expect(page.locator('.pp-step[aria-current="step"]')).toContainText(
      '03',
    );
  });
}

test('session-expiry link identifies the currently selected exercise', async ({
  page,
  context,
}) => {
  await identify(context);
  await page.goto('/en/lessons/L05/practice/');
  await page.locator('.pp-step').nth(3).click();
  await page.locator(`input[value="${bank[3].answer}"]`).check();
  await page.route('**/api/attempts/', (route) =>
    route.fulfill({ status: 401, json: { error: 'unauthenticated' } }),
  );
  await page.getByRole('button', { name: 'Check my answer' }).click();
  await expect(page.locator('.practice-error a')).toHaveAttribute(
    'href',
    '/en/sign-in/?next=%2Fen%2Flessons%2FL05%2Fpractice%2F%3Fexercise%3DL05-E04%26version%3D1',
  );
});

for (const locale of ['fr', 'en'] as const) {
  test(`stale tab rejects an account switch before saving and clears old work (${locale})`, async ({
    page,
    context,
  }) => {
    const original = await identify(context);
    await page.goto(`/${locale}/lessons/L05/practice/`);
    await page.locator('input[value="10"]').check();
    // A different lesson's private draft must be cleared as well.
    await page.evaluate(() =>
      sessionStorage.setItem('um-practice:L01', 'old-work'),
    );
    const replacement = await (
      await context.request.post(fixture + '/__fixture/session', { data: {} })
    ).json();
    const otherTab = await context.newPage();
    await otherTab.goto('/en/sign-in/');
    // The normal sign-in page redirects an already signed-in user. Use the
    // actual login endpoint to replace the shared browser session in tab B.
    const switched = await otherTab.request.post('/auth/login/', {
      headers: { Origin: app },
      form: {
        email: replacement.session.user.email,
        password: 'correct-horse-battery',
        locale: 'en',
      },
    });
    expect(switched.ok()).toBe(true);
    await otherTab.goto('/en/account/');
    const current = (
      await (await context.request.get('/api/auth/session/')).json()
    ).user;
    expect(current.id).not.toBe(original.user.id);
    expect(current.id).toBe(replacement.session.user.id);
    const saved = page.waitForResponse((r) =>
      r.url().endsWith('/api/attempts/'),
    );
    await page.locator('.pp-button-solid').click();
    const rejected = await saved;
    expect(rejected.status()).toBe(409);
    expect(await rejected.json()).toEqual({ error: 'learner_context_changed' });
    await expect(page.getByRole('alert')).toContainText(
      locale === 'en' ? 'The account has changed' : 'Le compte a changé',
    );
    await expect(page.locator('.pp-question')).toHaveCount(0);
    await expect(page.locator('.pp-feedback')).toHaveCount(0);
    expect(
      await page.evaluate(() =>
        Object.keys(sessionStorage).filter((k) => k.startsWith('um-practice:')),
      ),
    ).toEqual([]);
    // Read each owner's rows through their own authenticated Data API session.
    for (const token of [
      original.access_token,
      replacement.session.access_token,
    ]) {
      const history = await context.request.get(`${fixture}/rest/v1/attempts`, {
        headers: {
          apikey: 'sb_publishable_protocol_fixture',
          Authorization: `Bearer ${token}`,
        },
      });
      expect(await history.json()).toEqual([]);
    }
    await otherTab.goto('/en/progress/');
    await expect(otherTab.locator('.progress-history li')).toHaveCount(0);
    await page
      .getByRole('button', {
        name:
          locale === 'en' ? 'Load current account' : 'Charger le compte actuel',
      })
      .click();
    await expect(page.locator('.pp-options')).toBeVisible();
    await expect(page.locator('input:checked')).toHaveCount(0);
    await page.locator('input[value="10"]').check();
    const fresh = page.waitForResponse((r) =>
      r.url().endsWith('/api/attempts/'),
    );
    await page.locator('.pp-button-solid').click();
    expect((await fresh).status()).toBe(201);
    await expect(page.locator('.pp-feedback')).toBeVisible();
    await otherTab.reload();
    await expect(otherTab.locator('.progress-history li')).toHaveCount(1);
  });
}

test('attempt API requires matching learner context before writes and duplicate replay', async ({
  context,
}) => {
  const owner = await identify(context);
  const body = {
    submissionId: randomUUID(),
    exerciseId: 'L05-E01',
    version: 1,
    locale: 'en',
    response: { optionId: '10' },
  };
  for (const expectedLearnerId of [undefined, null, 42, '', randomUUID()]) {
    const response = await context.request.post('/api/attempts/', {
      headers: { Origin: app },
      data: { ...body, expectedLearnerId, userId: owner.user.id },
    });
    expect(response.status()).toBe(
      typeof expectedLearnerId === 'string' && expectedLearnerId ? 409 : 400,
    );
    expect(await response.json()).toEqual({
      error:
        typeof expectedLearnerId === 'string' && expectedLearnerId
          ? 'learner_context_changed'
          : 'invalid_learner_context',
    });
  }
  const history = await context.request.get(`${fixture}/rest/v1/attempts`, {
    headers: {
      apikey: 'sb_publishable_protocol_fixture',
      Authorization: `Bearer ${owner.access_token}`,
    },
  });
  expect(await history.json()).toEqual([]);
  const saved = await context.request.post('/api/attempts/', {
    headers: { Origin: app },
    data: { ...body, expectedLearnerId: owner.user.id, userId: randomUUID() },
  });
  expect(saved.status()).toBe(201);
  // Even an existing submission cannot be replayed with an incorrect context.
  const replay = await context.request.post('/api/attempts/', {
    headers: { Origin: app },
    data: { ...body, expectedLearnerId: randomUUID() },
  });
  expect(replay.status()).toBe(409);
  expect(await replay.json()).toEqual({ error: 'learner_context_changed' });
});
