import {
  test,
  expect,
  type APIRequestContext,
  type BrowserContext,
} from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { Paper, Question } from '../../src/lib/final-exam/types';
const origin = 'http://127.0.0.1:4321';
const bank = JSON.parse(
  readFileSync('exercises/final-exam/v1.json', 'utf8'),
) as Question[];
async function session(request: APIRequestContext, context?: BrowserContext) {
  const fixture = await (
    await request.post('http://127.0.0.1:54329/__fixture/session', { data: {} })
  ).json();
  if (context)
    await context.addCookies([
      {
        name: fixture.cookieName,
        value: fixture.cookieValue,
        url: origin,
        httpOnly: true,
        sameSite: 'Lax',
      },
    ]);
  return fixture;
}

test('final API protects keys, marks selected papers and rejects malformed or foreign requests', async ({
  request,
}) => {
  const redirect = await request.get('/fr/training-exams/final/', {
    maxRedirects: 0,
  });
  expect(redirect.status()).toBe(303);
  expect(redirect.headers()['cache-control']).toBe('private, no-store');
  expect(
    (
      await request.post('/api/training-exams/final/', {
        headers: { Origin: origin },
        data: {},
      })
    ).status(),
  ).toBe(401);
  const f = await session(request);
  const headers = {
    Origin: origin,
    Cookie: `${f.cookieName}=${f.cookieValue}`,
  };
  const start = {
    action: 'start',
    version: 1,
    expectedLearnerId: f.session.user.id,
    history: [],
  };
  const post = (data: unknown, from = origin) =>
    request.post('/api/training-exams/final/', {
      headers: { ...headers, Origin: from },
      data,
    });
  const response = await post(start);
  expect(response.status()).toBe(200);
  expect(response.headers()['cache-control']).toBe('private, no-store');
  expect(response.headers()['vercel-cdn-cache-control']).toBe('no-store');
  const paper = (await response.json()) as Paper;
  expect(paper.questions).toHaveLength(18);
  const serialized = JSON.stringify(paper);
  for (const key of [
    'answer',
    'explanation',
    'feedback',
    'rubric',
    'verification',
  ])
    expect(serialized).not.toContain(`"${key}"`);
  const responses = Object.fromEntries(
    paper.ids.map((id) => {
      const q = bank.find((q) => q.id === id)!;
      return [
        id,
        q.type === 'written'
          ? 'Sur papier'
          : q.type === 'numeric'
            ? Object.fromEntries(q.fields.map((f) => [f.id, f.answer]))
            : q.answer,
      ];
    }),
  );
  const grading = {
    action: 'grade',
    version: 1,
    expectedLearnerId: f.session.user.id,
    ids: paper.ids,
    seed: paper.seed,
    startedAt: paper.startedAt,
    responses,
  };
  const result = await post(grading);
  expect(result.status()).toBe(200);
  const marked = await result.json();
  expect(marked.automatic).toBe(27);
  expect(marked.manualMaximum).toBe(33);
  expect((await post(start, 'https://outside.example')).status()).toBe(403);
  expect((await post({ ...start, expectedLearnerId: 'other' })).status()).toBe(
    409,
  );
  expect((await post({ ...start, version: 2 })).status()).toBe(409);
  expect(
    (await post({ ...grading, ids: [...paper.ids].reverse() })).status(),
  ).toBe(400);
  expect(
    (await post({ ...grading, responses: { foreign: 'answer' } })).status(),
  ).toBe(400);
  expect((await post({ ...grading, score: 60 })).status()).toBe(400);
  expect(
    (await post({ ...grading, responses: { x: 'x'.repeat(70000) } })).status(),
  ).toBe(400);
  expect(
    (
      await request.get('http://127.0.0.1:4323/fr/training-exams/final/')
    ).status(),
  ).toBe(503);
});

test('French final exam supports keyboard, mobile, stable reload, marking, self-assessment and a fresh paper', async ({
  page,
  request,
  context,
}) => {
  await session(request, context);
  await page.goto('/fr/training-exams/');
  await page.getByRole('link', { name: 'Préparer l’examen final →' }).click();
  const start = page.getByRole('button', {
    name: 'Commencer les 120 minutes',
    exact: true,
  });
  await expect(start).toBeEnabled();
  await start.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-question]')).toHaveCount(18);
  const first = (await page.evaluate(
    () => JSON.parse(sessionStorage.getItem('um-practice:final:v1')!).paper,
  )) as Paper;
  expect(await page.locator('.exam-solution').count()).toBe(0);
  for (const item of first.questions) {
    const q = bank.find((q) => q.id === item.id)!;
    const section = page.locator(`[data-question="${q.id}"]`);
    if (q.type === 'written')
      await section.locator('textarea').fill('Démarche effectuée sur papier.');
    else if (q.type === 'numeric')
      for (const f of q.fields)
        await section.locator(`input[name="${q.id}-${f.id}"]`).fill(f.answer);
    else
      for (const answer of q.answer)
        await section.locator(`input[value="${answer}"]`).check();
  }
  await page.reload();
  await expect(page.locator('[data-question]')).toHaveCount(18);
  const restored = await page.evaluate(
    () => JSON.parse(sessionStorage.getItem('um-practice:final:v1')!).paper,
  );
  expect(restored).toEqual(first);
  await expect(page.locator('textarea').first()).toHaveValue(
    'Démarche effectuée sur papier.',
  );
  await page.setViewportSize({ width: 320, height: 900 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  await page
    .getByRole('button', { name: 'Terminer et corriger', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Confirmer la remise' }),
  ).toBeFocused();
  await expect(page.locator('.exam-solution')).toHaveCount(0);
  await page
    .getByRole('button', {
      name: 'Confirmer et voir la correction',
      exact: true,
    })
    .click();
  await expect(page.locator('.exam-results')).toContainText('27 / 27');
  await expect(page.locator('.exam-results')).toContainText('33 points');
  await expect(page.locator('.exam-solution')).toHaveCount(18);
  await expect(page.locator('.exam-results h2')).toBeFocused();
  for (const select of await page.locator('.self-mark select').all()) {
    const value = await select.locator('option').last().getAttribute('value');
    await select.selectOption(value!);
  }
  await expect(page.locator('.exam-results')).toContainText(
    '60 / 60, soit 20 / 20',
  );
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.exam-question-nav')).toBeHidden();
  await expect(page.locator('.exam-question').first()).toBeVisible();
  await page.emulateMedia({ media: 'screen' });
  await page.reload();
  await expect(page.locator('textarea').first()).toBeDisabled();
  await page
    .getByRole('button', {
      name: 'Confirmer et voir la correction',
      exact: true,
    })
    .click();
  await expect(page.locator('.exam-results')).toContainText('27 / 27');
  await page
    .getByRole('button', {
      name: 'Préparer une nouvelle tentative',
      exact: true,
    })
    .click();
  await start.click();
  await expect(page.locator('[data-question]')).toHaveCount(18);
  const second = (await page.evaluate(
    () => JSON.parse(sessionStorage.getItem('um-practice:final:v1')!).paper,
  )) as Paper;
  expect(second.ids.filter((id) => first.ids.includes(id))).toEqual([]);
});

test('elapsed deadline freezes responses across reload and failed grading remains retryable', async ({
  page,
  request,
  context,
}) => {
  await session(request, context);
  await page.clock.install();
  await page.goto('/fr/training-exams/final/');
  await page
    .getByRole('button', { name: 'Commencer les 120 minutes', exact: true })
    .click();
  const textarea = page.locator('textarea').first();
  await textarea.fill('Conserver ce brouillon.');
  await page.clock.fastForward(120 * 60 * 1000 + 2000);
  await expect(page.getByRole('timer')).toHaveText('0:00');
  await expect(textarea).toBeDisabled();
  await page.reload();
  await expect(textarea).toHaveValue('Conserver ce brouillon.');
  await expect(textarea).toBeDisabled();
  await page
    .getByRole('button', { name: 'Terminer et corriger', exact: true })
    .click();
  await page.route('**/api/training-exams/final/', (route) => route.abort());
  await page
    .getByRole('button', {
      name: 'Confirmer et voir la correction',
      exact: true,
    })
    .click();
  await expect(page.getByRole('alert')).toContainText(
    'Vos réponses sont conservées',
  );
  await page.unroute('**/api/training-exams/final/');
  await page
    .getByRole('button', {
      name: 'Confirmer et voir la correction',
      exact: true,
    })
    .click();
  await expect(page.locator('.exam-results')).toContainText('0 / 27');
});

test('storage failure and account change preserve session boundaries', async ({
  page,
  request,
  context,
}) => {
  await session(request, context);
  await page.addInitScript(() =>
    Object.defineProperty(window, 'sessionStorage', {
      get() {
        throw new Error('blocked');
      },
    }),
  );
  await page.goto('/en/training-exams/final/');
  await expect(page).toHaveURL('/fr/training-exams/final/');
  await expect(page.getByRole('status')).toContainText(
    'stockage est indisponible',
  );
  await page
    .getByRole('button', { name: 'Commencer les 120 minutes', exact: true })
    .click();
  await expect(page.locator('[data-question]')).toHaveCount(18);
  await session(request, context);
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.getByRole('alert')).toContainText('Votre session a changé');
  await expect(page.locator('[data-question]')).toHaveCount(0);
});
