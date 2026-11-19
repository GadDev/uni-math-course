import { test, expect, type BrowserContext, type Page } from '@playwright/test';
const app = 'http://127.0.0.1:4321';
async function identify(context: BrowserContext) {
  const issued = await (
    await context.request.post('http://127.0.0.1:54329/__fixture/session', {
      data: {},
    })
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
  return issued.session.user.id as string;
}
async function revisit(page: Page) {
  await page.evaluate(() =>
    window.dispatchEvent(
      new PageTransitionEvent('pageshow', { persisted: true }),
    ),
  );
}
const toggle = (page: Page) => page.locator('[data-completion-toggle]');

for (const chapter of [
  {
    id: 'C02',
    first: 'L21',
    next: 'L22',
    total: 16,
    percent: '6 %',
    groups: 5,
  },
  {
    id: 'C03',
    first: 'L37',
    next: 'L38',
    total: 6,
    percent: '17 %',
    groups: 3,
  },
  {
    id: 'C04',
    first: 'L43',
    next: 'L44',
    total: 15,
    percent: '7 %',
    groups: 4,
  },
]) {
  for (const locale of ['fr', 'en'] as const) {
    test(`programme dashboard scopes progress and navigation (${chapter.id}, ${locale})`, async ({
      page,
      context,
    }) => {
      const owner = await identify(context);
      for (const lessonId of ['L01', chapter.first]) {
        const response = await context.request.post(
          '/api/lesson-completions/',
          {
            headers: { Origin: app },
            data: { expectedLearnerId: owner, lessonId, completed: true },
          },
        );
        expect(response.ok()).toBe(true);
      }
      await page.goto(`/${locale}/chapters/${chapter.id}/`);
      await expect(page.locator('[data-completion-status]')).toHaveText(
        locale === 'fr'
          ? `1 leçon terminée sur ${chapter.total}`
          : `1 of ${chapter.total} lessons completed`,
      );
      await expect(page.locator('[data-completion-percent]')).toHaveText(
        chapter.percent,
      );
      await expect(page.locator('progress')).toHaveAttribute(
        'max',
        String(chapter.total),
      );
      await expect(page.locator('[data-completion-continue]')).toHaveAttribute(
        'href',
        `/${locale}/lessons/${chapter.next}/`,
      );
      await expect(
        page.locator(`[data-completion-badge="${chapter.first}"]`),
      ).toBeVisible();
      await expect(page.locator('.programme-jumps a')).toHaveCount(
        chapter.groups,
      );
      for (const width of [320, 960, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const theme of ['light', 'dark']) {
          await page.evaluate((theme) => {
            document.documentElement.dataset.theme = theme;
          }, theme);
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          ).toBe(true);
        }
      }
      const jump = page.locator('.programme-jumps a').last();
      const target = await jump.getAttribute('href');
      await jump.click();
      await expect(page.locator(target!)).toBeInViewport();
      const action = page.locator('.programme-workshop');
      const href = await action.getAttribute('href');
      await action.click();
      if (href!.startsWith('#'))
        await expect(page.locator(href!)).toBeInViewport();
      else await expect(page).toHaveURL(app + href!);
    });
  }
}

for (const locale of ['fr', 'en'] as const) {
  test(`manual completion, reload, language switch, chapter counter and undo (${locale})`, async ({
    page,
    context,
  }) => {
    await identify(context);
    await page.goto(`/${locale}/lessons/L01/`);
    await expect(toggle(page)).toBeEnabled();
    await expect(
      page.locator('.lesson-next a[href="/' + locale + '/lessons/L02/"]'),
    ).toBeVisible();
    // Reading alone, including reaching the end, never completes a lesson.
    await toggle(page).scrollIntoViewIfNeeded();
    await expect(page.locator('[data-completion-status]')).toContainText('0');
    await toggle(page).click();
    await expect(toggle(page)).toHaveText(
      locale === 'fr' ? 'Marquer comme non terminée' : 'Mark as not completed',
    );
    await expect(page.locator('[data-completion-status]')).toContainText(
      locale === 'fr' ? '1 leçon terminée sur 20' : '1 of 20 lessons completed',
    );
    await page.reload();
    await expect(toggle(page)).toHaveText(
      locale === 'fr' ? 'Marquer comme non terminée' : 'Mark as not completed',
    );
    const other = locale === 'fr' ? 'en' : 'fr';
    await page.locator('[data-language-link]').click();
    await expect(page).toHaveURL(new RegExp(`/${other}/lessons/L01/`));
    await expect(toggle(page)).toHaveText(
      other === 'fr' ? 'Marquer comme non terminée' : 'Mark as not completed',
    );
    await page.goto(`/${locale}/`);
    await expect(page.locator('[data-completion-badge="L01"]')).toBeVisible();
    await expect(page.locator('[data-completion-status]')).toContainText('1');
    await expect(
      page.locator('[data-completion-meter] progress'),
    ).toHaveAttribute('value', '1');
    await expect(page.locator('[data-completion-percent]')).toHaveText('5 %');
    await expect(page.locator('[data-completion-continue]')).toHaveAttribute(
      'href',
      `/${locale}/lessons/L02/`,
    );
    await page.goto(`/${locale}/lessons/L01/`);
    await expect(toggle(page)).toBeEnabled();
    await toggle(page).click();
    await expect(toggle(page)).toHaveText(
      locale === 'fr' ? 'Marquer comme terminée' : 'Mark as completed',
    );
    await page.reload();
    await expect(page.locator('[data-completion-status]')).toContainText('0');
  });
}

test('chapter two completion has its own total and anonymous reading needs no API', async ({
  page,
  context,
}) => {
  const calls: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/')) calls.push(request.url());
  });
  await page.goto('/en/lessons/L21/');
  await expect(page.locator('[data-completion-sign-in]')).toBeVisible();
  await expect(toggle(page)).toBeHidden();
  expect(calls).toEqual([]);
  await page.locator('[data-completion-sign-in]').click();
  await expect(page.locator('input[name="next"]')).toHaveValue(
    '/en/lessons/L21/',
  );
  await identify(context);
  await page.goto('/en/lessons/L21/');
  await expect(toggle(page)).toBeEnabled();
  await toggle(page).click();
  await expect(page.locator('[data-completion-status]')).toContainText(
    '1 of 16 lessons completed',
  );
  await page.goto('/en/chapters/C02/');
  await expect(page.locator('[data-completion-badge="L21"]')).toBeVisible();
  await expect(page.locator('[data-completion-status]')).toHaveText(
    '1 of 16 lessons completed',
  );
});

test('programme overview hides unconfirmed progress and stays useful without an account', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/fr/');
  await expect(page.locator('[data-completion-meter]')).toBeHidden();
  await expect(page.locator('[data-completion-continue]')).toHaveAttribute(
    'href',
    '/fr/lessons/L01/',
  );
  await expect(page.locator('.programme-workshop')).toHaveAttribute(
    'href',
    '/fr/logic-workshop/',
  );
  for (const theme of ['light', 'dark']) {
    await page.evaluate((theme) => {
      document.documentElement.dataset.theme = theme;
    }, theme);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.locator('.programme-jumps a').nth(1).click();
  await expect(page).toHaveURL(/#programme-part-2$/);
  await expect(page.locator('#programme-part-2')).toBeInViewport();
});

test('programme overview handles all completed, failed reload and account change', async ({
  page,
  context,
}) => {
  const owner = await identify(context);
  for (let i = 1; i <= 20; i++) {
    const response = await context.request.post('/api/lesson-completions/', {
      headers: { Origin: app },
      data: {
        expectedLearnerId: owner,
        lessonId: `L${String(i).padStart(2, '0')}`,
        completed: true,
      },
    });
    expect(response.ok()).toBe(true);
  }
  await page.goto('/en/');
  await expect(page.locator('[data-completion-percent]')).toHaveText('100 %');
  await expect(page.locator('[data-completion-continue]')).toContainText(
    'All completed',
  );
  await page.route('**/api/lesson-completions/', (route) =>
    route.fulfill({ status: 503, json: {} }),
  );
  await revisit(page);
  await expect(page.locator('[data-completion-retry]')).toBeVisible();
  await expect(page.locator('[data-completion-meter]')).toBeHidden();
  await expect(page.locator('[data-completion-continue]')).toContainText(
    'Start the chapter',
  );
  await page.unroute('**/api/lesson-completions/');
  await page.locator('[data-completion-retry]').click();
  await expect(page.locator('[data-completion-percent]')).toHaveText('100 %');
  await identify(context);
  await revisit(page);
  await expect(page.locator('[data-completion-percent]')).toHaveText('0 %');
  await expect(page.locator('[data-completion-continue]')).toHaveAttribute(
    'href',
    '/en/lessons/L01/',
  );
});

test('API enforces identity, origin, released lesson, boolean and stale-account precondition', async ({
  request,
  context,
}) => {
  const anonymous = await request.get('/api/lesson-completions/');
  expect(anonymous.status()).toBe(401);
  expect(anonymous.headers()['cache-control']).toContain('no-store');
  const owner = await identify(context);
  const send = (body: unknown, origin = app) =>
    context.request.post('/api/lesson-completions/', {
      headers: { Origin: origin },
      data: body,
    });
  expect(
    (
      await send(
        { expectedLearnerId: owner, lessonId: 'L01', completed: true },
        'https://elsewhere.invalid',
      )
    ).status(),
  ).toBe(403);
  expect((await send({ lessonId: 'L01', completed: true })).status()).toBe(400);
  expect(
    (
      await send({ expectedLearnerId: owner, lessonId: 'L99', completed: true })
    ).status(),
  ).toBe(400);
  expect(
    (
      await send({
        expectedLearnerId: owner,
        lessonId: 'L01',
        completed: 'true',
      })
    ).status(),
  ).toBe(400);
  for (let i = 0; i < 2; i++)
    expect(
      (
        await send({
          expectedLearnerId: owner,
          lessonId: 'L01',
          completed: true,
        })
      ).status(),
    ).toBe(200);
  expect(
    (await (await context.request.get('/api/lesson-completions/')).json())
      .completedLessonIds,
  ).toEqual(['L01']);
  await identify(context);
  expect(
    (
      await send({ expectedLearnerId: owner, lessonId: 'L02', completed: true })
    ).status(),
  ).toBe(409);
  expect(
    (await (await context.request.get('/api/lesson-completions/')).json())
      .completedLessonIds,
  ).toEqual([]);
});

test('another tab updates completion on return and account change/logout clears badges', async ({
  page,
  context,
}) => {
  const owner = await identify(context);
  await page.goto('/en/lessons/L01/');
  await expect(toggle(page)).toBeEnabled();
  await context.request.post('/api/lesson-completions/', {
    headers: { Origin: app },
    data: { expectedLearnerId: owner, lessonId: 'L01', completed: true },
  });
  await revisit(page);
  await expect(toggle(page)).toHaveText('Mark as not completed');
  await identify(context);
  await revisit(page);
  await expect(toggle(page)).toHaveText('Mark as completed');
  await expect(page.locator('[data-completion-badge="L01"]')).toBeHidden();
  await context.request.post('/auth/logout/', {
    headers: { Origin: app },
    form: { locale: 'en' },
  });
  await revisit(page);
  await expect(toggle(page)).toBeHidden();
  await expect(page.locator('[data-completion-sign-in]')).toBeVisible();
});

test('failed acknowledgement reloads confirmed state; an old response cannot restore another account', async ({
  page,
  context,
}) => {
  await identify(context);
  await page.goto('/en/lessons/L01/');
  await expect(toggle(page)).toBeEnabled();
  await page.route('**/api/lesson-completions/', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    await route.fetch(); // The save commits, but its acknowledgement is lost.
    await route.fulfill({ status: 503, json: { error: 'unavailable' } });
  });
  await toggle(page).click();
  await expect(page.locator('[data-completion-status]')).toContainText(
    'could not be confirmed',
  );
  await expect(toggle(page)).toBeDisabled();
  await page.unroute('**/api/lesson-completions/');
  await page.locator('[data-completion-retry]').click();
  await expect(toggle(page)).toHaveText('Mark as not completed');
  let release!: () => void;
  let saved!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const committed = new Promise<void>((resolve) => {
    saved = resolve;
  });
  await page.route('**/api/lesson-completions/', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    const response = await route.fetch();
    saved();
    await gate;
    await route.fulfill({ response });
  });
  await toggle(page).click();
  await committed;
  await identify(context);
  await revisit(page);
  await expect(toggle(page)).toHaveText('Mark as completed');
  await expect(toggle(page)).toBeEnabled();
  release();
  await page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/lesson-completions/') &&
      response.request().method() === 'POST',
  );
  await expect(toggle(page)).toHaveText('Mark as completed');
});

for (const locale of ['fr', 'en'] as const) {
  test(`completion controls fit at 320px in both themes (${locale})`, async ({
    page,
    context,
  }) => {
    await identify(context);
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`/${locale}/lessons/L01/`);
    await expect(toggle(page)).toBeEnabled();
    await toggle(page).click();
    await expect(toggle(page)).toHaveText(
      locale === 'fr' ? 'Marquer comme non terminée' : 'Mark as not completed',
    );
    await page.locator('[data-completion]').scrollIntoViewIfNeeded();
    for (const theme of ['light', 'dark']) {
      await page.evaluate((theme) => {
        document.documentElement.dataset.theme = theme;
      }, theme);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      const button = await toggle(page).boundingBox();
      expect(button!.height).toBeGreaterThanOrEqual(44);
      expect(button!.x).toBeGreaterThanOrEqual(0);
      expect(button!.x + button!.width).toBeLessThanOrEqual(320);
      await page
        .locator('[data-completion]')
        .screenshot({ path: `/tmp/completion-${locale}-${theme}.png` });
    }
  });
}
