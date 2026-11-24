import { test, expect, type BrowserContext, type Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { selectedL05Version } from './released-bank';
const app = 'http://127.0.0.1:4321';
const fixture = 'http://127.0.0.1:54329';
async function identify(context: BrowserContext) {
  const issued = await (
    await context.request.post(`${fixture}/__fixture/session`, { data: {} })
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
async function complete(
  context: BrowserContext,
  owner: string,
  completed = true,
) {
  expect(
    (
      await context.request.post('/api/lesson-completions/', {
        headers: { Origin: app },
        data: { expectedLearnerId: owner, lessonId: 'L43', completed },
      })
    ).ok(),
  ).toBe(true);
}
async function returnToPage(page: Page) {
  await page.evaluate(() =>
    window.dispatchEvent(
      new PageTransitionEvent('pageshow', { persisted: true }),
    ),
  );
}
const resumeLink = (page: Page) => page.locator('[data-study-resume-link]');

test('anonymous and new accounts never get a fabricated resume from page visits', async ({
  page,
  context,
  request,
}) => {
  const calls: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/')) calls.push(request.url());
  });
  await page.goto('/en/');
  await expect(page.locator('[data-study-resume]')).toBeHidden();
  expect(calls).toEqual([]);
  const anonymous = await request.get('/api/study-resume/');
  expect(anonymous.status()).toBe(401);
  expect(anonymous.headers()['cache-control']).toContain('no-store');
  await identify(context);
  await page.goto('/en/lessons/L43/');
  await page.goto('/en/');
  await expect(page.locator('[data-study-resume-status]')).toContainText(
    'No saved activity',
  );
  await expect(resumeLink(page)).toBeHidden();
});

for (const locale of ['fr', 'en'] as const) {
  test(`saved reading and attempts drive resume across returns (${locale})`, async ({
    page,
    context,
  }) => {
    const owner = await identify(context);
    await complete(context, owner);
    await page.goto(`/${locale}/`);
    await expect(resumeLink(page)).toHaveAttribute(
      'href',
      `/${locale}/lessons/L43/`,
    );
    await page.goto(`/${locale}/progress/`);
    await expect(page.locator('.reading-history li')).toHaveCount(1);
    await expect(page.locator('.reading-history')).toContainText(
      locale === 'fr' ? 'Lecture terminée' : 'Reading completed',
    );
    await expect(
      page.locator('.progress-stats > div').first().locator('dd').first(),
    ).toHaveText(/^0\s*\/[\s/]*\d+$/);
    await expect(page.locator('.progress-stat-accent dd').first()).toHaveText(
      /^0\s*\/[\s/]*\d+$/,
    );
    for (const correct of [false, true]) {
      expect(
        (
          await context.request.post(`${fixture}/rest/v1/rpc/record_attempt`, {
            headers: { apikey: 'sb_secret_protocol_fixture' },
            data: {
              p_attempt: {
                user_id: owner,
                submission_id: randomUUID(),
                lesson_id: 'L05',
                exercise_id: 'L05-E01',
                exercise_version: selectedL05Version,
                response: { optionId: '00' },
                correct,
                hint_used: true,
                locale,
              },
            },
          })
        ).ok(),
      ).toBe(true);
    }
    await page.reload();
    const target = `/${locale}/lessons/L05/practice/?exercise=L05-E01&version=${selectedL05Version}`;
    await expect(page.locator('[data-saved-resume]')).toHaveAttribute(
      'href',
      target,
    );
    await expect(page.locator('.progress-history li')).toHaveCount(2);
    await expect(page.locator('.progress-stat-accent dd').first()).toHaveText(
      /^0\s*\/[\s/]*\d+$/,
    );
    await page.goto(`/${locale}/`);
    await expect(resumeLink(page)).toHaveAttribute('href', target);
    for (const width of [320, 1440]) {
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
    await resumeLink(page).click();
    await expect(page).toHaveURL(app + target);
    await page.goto(`/${locale}/`);
    await expect(resumeLink(page)).toHaveAttribute('href', target);
    await complete(context, owner, false);
    await page.goto(`/${locale}/progress/`);
    await expect(page.locator('.reading-history li')).toHaveCount(0);
    await expect(page.locator('[data-saved-resume]')).toHaveAttribute(
      'href',
      target,
    );
    const response = await context.request.get('/api/study-resume/');
    expect(response.headers()['cache-control']).toContain('no-store');
    const body = await response.json();
    expect(Object.keys(body.resume).sort()).toEqual([
      'at',
      'exerciseId',
      'kind',
      'lessonId',
      'version',
    ]);
  });
}

test('failed resume reload hides stale targets, retries and isolates a new account', async ({
  page,
  context,
}) => {
  const owner = await identify(context);
  await complete(context, owner);
  await page.goto('/en/');
  await expect(resumeLink(page)).toBeVisible();
  await page.route('**/api/study-resume/', (route) =>
    route.fulfill({ status: 503, json: {} }),
  );
  await returnToPage(page);
  await expect(page.locator('[data-study-resume-retry]')).toBeVisible();
  await expect(resumeLink(page)).toBeHidden();
  await page.unroute('**/api/study-resume/');
  await page.locator('[data-study-resume-retry]').click();
  await expect(resumeLink(page)).toBeVisible();
  await identify(context);
  await returnToPage(page);
  await expect(page.locator('[data-study-resume-status]')).toContainText(
    'No saved activity',
  );
  await expect(resumeLink(page)).toBeHidden();
  const other = await context.request.get('/api/study-resume/');
  expect((await other.json()).resume).toBeNull();
});

test('an old account response cannot restore a private resume after account change or logout', async ({
  page,
  context,
}) => {
  const owner = await identify(context);
  await complete(context, owner);
  await page.goto('/en/');
  await expect(resumeLink(page)).toBeVisible();
  let release!: () => void;
  let fetched!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const ready = new Promise<void>((resolve) => {
    fetched = resolve;
  });
  let held = false;
  await page.route('**/api/study-resume/', async (route) => {
    if (held) return route.continue();
    held = true;
    const response = await route.fetch();
    fetched();
    await gate;
    await route.fulfill({ response });
  });
  await returnToPage(page);
  await ready;
  await identify(context);
  await returnToPage(page);
  await expect(page.locator('[data-study-resume-status]')).toContainText(
    'No saved activity',
  );
  const oldResponse = page.waitForResponse((response) =>
    response.url().endsWith('/api/study-resume/'),
  );
  release();
  await (await oldResponse).finished();
  await expect(resumeLink(page)).toBeHidden();
  await page.unroute('**/api/study-resume/');
  await context.request.post('/auth/logout/', {
    headers: { Origin: app },
    form: { locale: 'en' },
  });
  await returnToPage(page);
  await expect(page.locator('[data-study-resume]')).toBeHidden();
});

for (const locale of ['fr', 'en']) {
  test(`workshops disclose unsaved results before controls (${locale})`, async ({
    page,
  }) => {
    for (const path of ['logic-workshop', 'chapters/C04/lzw']) {
      await page.goto(`/${locale}/${path}/`);
      const notice = page.locator('[data-activity-storage]');
      await expect(notice).toBeVisible();
      await expect(notice).toContainText(
        locale === 'fr' ? 'ne sont pas enregistrés' : 'not saved',
      );
      await page.locator('.logic-setup, .lzw-workshop').waitFor();
      expect(
        await notice.evaluate((el) => {
          const controls = document.querySelector(
            '.logic-setup, .lzw-workshop',
          );
          return (
            !!controls &&
            !!(
              el.compareDocumentPosition(controls) &
              Node.DOCUMENT_POSITION_FOLLOWING
            )
          );
        }),
      ).toBe(true);
    }
  });
}
