import {
  test,
  expect,
  type BrowserContext,
  type APIRequestContext,
} from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { TrainingExam } from '../../src/lib/training-exams/types';

const origin = 'http://127.0.0.1:4321';
async function session(request: APIRequestContext, context: BrowserContext) {
  const response = await request.post(
    'http://127.0.0.1:54329/__fixture/session',
    { data: {} },
  );
  const fixture = await response.json();
  await context.addCookies([
    {
      name: fixture.cookieName,
      value: fixture.cookieValue,
      url: origin,
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
  return fixture.session.user.id as string;
}
const bank = (chapter: string) =>
  JSON.parse(
    readFileSync(`exercises/exams/${chapter}/v1.json`, 'utf8'),
  ) as TrainingExam;

for (const locale of ['fr', 'en']) {
  test(`global navigation reaches the public exam catalogue (${locale})`, async ({
    page,
  }) => {
    for (const width of [320, 375, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/`);
      const nav = page.locator('[data-exams-nav]');
      await expect(nav).toBeVisible();
      await expect(nav).toHaveAttribute('href', `/${locale}/training-exams/`);
      const expectedLabel =
        locale === 'fr' ? 'Examens blancs' : 'Practice exams';
      const compactLabel = width <= 820 || (width >= 1051 && width <= 1370);
      const expectedVisibleLabel = compactLabel
        ? locale === 'fr'
          ? 'Examens'
          : 'Exams'
        : expectedLabel;
      await expect(nav).toHaveText(expectedVisibleLabel, {
        useInnerText: true,
      });
      await expect(nav).toHaveAttribute('aria-label', expectedLabel);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await nav.focus();
      await expect(nav).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(`/${locale}/training-exams/`);
      await expect(page.locator('[data-exams-nav]')).toHaveAttribute(
        'aria-current',
        'page',
      );
      await expect(page.locator('.exam-card')).toHaveCount(4);
    }
  });

  test(`public mock exam catalogue and chapter entries fit mobile (${locale})`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(`/${locale}/training-exams/`);
    await expect(page.locator('.exam-card')).toHaveCount(4);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
    for (const chapter of ['C01', 'C02', 'C03']) {
      await page.goto(
        chapter === 'C01' ? `/${locale}/` : `/${locale}/chapters/${chapter}/`,
      );
      await expect(
        page.locator(`a[href="/${locale}/training-exams/#${chapter}"]`),
      ).toBeVisible();
    }
  });

  for (const chapter of ['C01', 'C02', 'C03']) {
    test(`full mock exam, deferred solutions and marking (${chapter}, ${locale})`, async ({
      page,
      request,
      context,
    }) => {
      await session(request, context);
      const response = await page.goto(`/${locale}/training-exams/${chapter}/`);
      expect(response!.headers()['cache-control']).toBe('private, no-store');
      const html = await response!.text();
      expect(html).not.toContain('&quot;explanation&quot;');
      expect(html).not.toContain('&quot;answer&quot;');
      await page
        .getByRole('button', { name: /Commencer l’examen|Start the exam/ })
        .click();
      await expect(page.locator('[data-question]')).toHaveCount(20);
      await expect(page.locator('.exam-solution')).toHaveCount(0);
      const exam = bank(chapter);
      for (const q of exam.questions) {
        const section = page.locator(`[data-question="${q.id}"]`);
        if (q.type === 'numeric') {
          for (const f of q.fields)
            await section
              .locator(`input[name="${q.id}-${f.id}"]`)
              .fill(f.answer);
        } else {
          for (const id of q.answer)
            await section.locator(`input[value="${id}"]`).check();
        }
      }
      await page.setViewportSize({ width: 320, height: 900 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(320);
      await page
        .getByRole('button', {
          name: /Terminer et corriger|Finish and mark/,
          exact: true,
        })
        .click();
      await expect(page.locator('.exam-solution')).toHaveCount(0);
      await page
        .getByRole('button', {
          name: /Confirmer et voir la correction|Confirm and view solutions/,
        })
        .click();
      await expect(page.locator('#exam-result-title')).toHaveText('20 / 20');
      await expect(page.locator('.exam-solution')).toHaveCount(20);
      await expect(page.locator('#exam-result-title')).toBeFocused();
      await expect(page.locator('.exam-solution a').first()).toHaveAttribute(
        'href',
        `/${locale}/lessons/${exam.questions[0]!.lessonId}/`,
      );
      expect(
        await page.evaluate(() =>
          Object.keys(sessionStorage).filter((key) =>
            key.startsWith('um-practice:exam:'),
          ),
        ),
      ).toEqual([]);
      await page
        .getByRole('button', {
          name: /Recommencer le même sujet|Repeat the same paper/,
        })
        .click();
      await expect(page.locator('.exam-preparation')).toContainText(
        locale === 'fr' ? 'déjà vu ce sujet' : 'already seen this paper',
      );
    });
  }
}

test('anonymous papers redirect and grading fails closed with no-store responses', async ({
  request,
}) => {
  for (const chapter of ['C01', 'C02', 'C03']) {
    const response = await request.get(`/fr/training-exams/${chapter}/`, {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(303);
    expect(response.headers().location).toBe(
      `/fr/sign-in/?next=%2Ffr%2Ftraining-exams%2F${chapter}%2F`,
    );
    expect(response.headers()['cache-control']).toBe('private, no-store');
    const grade = await request.post(`/api/training-exams/${chapter}/`, {
      headers: { Origin: origin },
      data: {},
    });
    expect(grade.status()).toBe(401);
    expect(grade.headers()['vercel-cdn-cache-control']).toBe('no-store');
  }
  expect((await request.get('/fr/training-exams/C99/')).status()).toBe(404);
  expect(
    (
      await request.get('http://127.0.0.1:4323/en/training-exams/C01/')
    ).status(),
  ).toBe(503);
});

test('mock exam draft survives reload and language switch, then logout clears it', async ({
  page,
  request,
  context,
}) => {
  await session(request, context);
  await page.goto('/fr/training-exams/C02/');
  await page
    .getByRole('button', { name: 'Commencer l’examen', exact: true })
    .click();
  const input = page.locator('input[name="C02-M01-Q01-a"]');
  await input.fill('-1/12');
  await page.reload();
  await expect(input).toHaveValue('-1/12');
  await page.locator('[data-language-link]').click();
  await expect(page).toHaveURL('/en/training-exams/C02/');
  await expect(input).toHaveValue('-1/12');
  await page.getByRole('button', { name: 'Hide time', exact: true }).click();
  await expect(page.getByRole('timer')).toHaveCount(0);
  await context.request.post('/auth/logout/', {
    headers: { Origin: origin },
    form: { locale: 'en' },
  });
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.locator('[role="alert"]')).toContainText(
    'Your session changed',
  );
  await expect(page.locator('[data-question]')).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      Object.keys(sessionStorage).filter((key) =>
        key.startsWith('um-practice:exam:'),
      ),
    ),
  ).toEqual([]);
});

test('incomplete marking requires confirmation and a failed request can be retried', async ({
  page,
  request,
  context,
}) => {
  await session(request, context);
  await page.goto('/en/training-exams/C03/');
  await page
    .getByRole('button', { name: 'Start the exam', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Finish and mark', exact: true })
    .click();
  await expect(page.locator('.exam-finish')).toContainText(
    '20 incomplete questions',
  );
  await page.route('**/api/training-exams/C03/', (route) => route.abort());
  await page
    .getByRole('button', { name: 'Confirm and view solutions', exact: true })
    .click();
  await expect(page.locator('.exam-finish [role="alert"]')).toContainText(
    'answers are preserved',
  );
  await page.unroute('**/api/training-exams/C03/');
  await page
    .getByRole('button', { name: 'Confirm and view solutions', exact: true })
    .click();
  await expect(page.locator('#exam-result-title')).toHaveText('0 / 20');
});

test('storage failure leaves an answerable paper and account switching removes prior answers', async ({
  page,
  request,
  context,
}) => {
  await session(request, context);
  await page.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', {
      get() {
        throw new Error('storage unavailable');
      },
    });
  });
  await page.goto('/en/training-exams/C01/');
  await page
    .getByRole('button', { name: 'Start the exam', exact: true })
    .click();
  await page.locator('[data-question="C01-M01-Q01"] input[value="c"]').check();
  await session(request, context);
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.locator('[role="alert"]')).toContainText(
    'Your session changed',
  );
  await expect(page.locator('[data-question]')).toHaveCount(0);
});

test('grading rejects cross-origin, foreign owner, stale version, extra fields and oversized inputs', async ({
  request,
}) => {
  const fixtureResponse = await request.post(
    'http://127.0.0.1:54329/__fixture/session',
    { data: {} },
  );
  const fixture = await fixtureResponse.json();
  const learner = fixture.session.user.id;
  const body = {
    examId: 'C03-M01',
    version: 1,
    expectedLearnerId: learner,
    responses: {},
  };
  const post = (data: unknown, from = origin) =>
    request.post('/api/training-exams/C03/', {
      headers: {
        Origin: from,
        Cookie: `${fixture.cookieName}=${fixture.cookieValue}`,
      },
      data,
    });
  expect((await post(body, 'https://outside.example')).status()).toBe(403);
  expect(
    (await post({ ...body, expectedLearnerId: 'someone-else' })).status(),
  ).toBe(409);
  expect((await post({ ...body, version: 99 })).status()).toBe(409);
  expect((await post({ ...body, score: 20 })).status()).toBe(400);
  expect(
    (await post({ ...body, responses: { unknown: ['a'] } })).status(),
  ).toBe(400);
  expect(
    (
      await post({ ...body, responses: { 'C03-M01-Q01': ['a', 'a'] } })
    ).status(),
  ).toBe(400);
  expect(
    (
      await post({
        ...body,
        responses: { 'C03-M01-Q07': { a: '1'.repeat(17000) } },
      })
    ).status(),
  ).toBe(400);
  const result = await post(body);
  expect(result.status()).toBe(200);
  expect((await result.json()).score).toBe(0);
  expect(result.headers()['cache-control']).toBe('private, no-store');
});
