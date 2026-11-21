import { expect, test, type Locator } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

// Browser evidence only: MathML and live-region assertions do not verify speech.
async function visibleFocus(control: Locator) {
  await control.focus();
  await expect(control).toBeFocused();
  expect(
    await control.evaluate((node) => getComputedStyle(node).outlineStyle),
  ).not.toBe('none');
}

for (const locale of ['fr', 'en']) {
  const fr = locale === 'fr';

  test(`practice focuses the verdict and keeps the explanation until requested (${locale})`, async ({
    page,
    context,
  }) => {
    const issued = await (
      await context.request.post('http://127.0.0.1:54329/__fixture/session', {
        data: {},
      })
    ).json();
    await context.addCookies([
      {
        name: issued.cookieName,
        value: issued.cookieValue,
        url: 'http://127.0.0.1:4321',
        httpOnly: true,
        sameSite: 'Lax',
      },
      { name: 'um-session', value: '1', url: 'http://127.0.0.1:4321' },
    ]);
    await page.goto(`/${locale}/lessons/L05/practice/`);
    await page.locator('.pp-question input').first().check();
    await page
      .getByRole('button', {
        name: fr ? 'Vérifier ma réponse' : 'Check my answer',
        exact: true,
      })
      .press('Enter');
    await expect(page.locator('#pp-feedback-title')).toBeFocused();
    await expect(page.locator('.pp-explanation')).toBeVisible();
    await expect(page.locator('.pp-step').first()).toHaveAttribute(
      'aria-current',
      'step',
    );
    const next = page.getByRole('button', {
      name: fr ? 'Exercice suivant' : 'Next exercise',
      exact: true,
    });
    await expect(next).toBeEnabled();
    await expect(page.locator('#pp-feedback-title')).toBeFocused();
    await next.press('Enter');
    await expect(page.locator('.pp-step').nth(1)).toHaveAttribute(
      'aria-current',
      'step',
    );
  });

  test(`math exposes one semantic representation, with fractions, indices, powers and limits (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L38/`);
    const math = page.locator('article .katex-mathml math');
    expect(await math.count()).toBeGreaterThan(20);
    for (const tag of ['mfrac', 'msub', 'msup'])
      expect(await math.locator(tag).count()).toBeGreaterThan(0);
    // KaTeX encodes the limit condition as a subscript in this version.
    expect(
      await math.locator('msub').filter({ hasText: 'lim' }).count(),
    ).toBeGreaterThan(0);
    expect(
      await page
        .locator('article .katex')
        .evaluateAll((nodes) =>
          nodes.every(
            (node) =>
              node.querySelectorAll('.katex-mathml math').length === 1 &&
              node.querySelector('.katex-html')?.getAttribute('aria-hidden') ===
                'true' &&
              !node
                .querySelector('.katex-mathml')
                ?.closest('[aria-hidden="true"]'),
          ),
        ),
    ).toBe(true);
    await expect(page.locator('article')).toContainText(
      fr ? 'limite' : 'limit as h tends to zero',
    );
  });

  test(`truth tables and reference disclosure retain keyboard access (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L03/`);
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
    const table = page.locator('article table').first();
    expect(await table.getByRole('columnheader').count()).toBeGreaterThan(1);
    expect(await table.getByRole('row').count()).toBeGreaterThan(2);
    await page.goto(`/${locale}/logic-workshop/`);
    const disclosure = page.locator('.logic-reference').first();
    await disclosure.locator('summary').press('Enter');
    const region = disclosure.getByRole('region', {
      name: fr ? 'Table des lois booléennes' : 'Boolean law reference',
    });
    await visibleFocus(region);
    await expect(region.getByRole('table')).toHaveAccessibleName(
      fr ? 'Table des lois booléennes' : 'Boolean law reference',
    );
    expect(await region.getByRole('rowheader').count()).toBeGreaterThan(5);
    await disclosure.locator('summary').press('Space');
    await expect(region).not.toBeVisible();
  });

  test(`graphs describe scale and retain exact controls and textual results (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L29/`);
    const slope = page.locator('[data-geometry-lab="slope"] .geo-live');
    await slope.scrollIntoViewIfNeeded();
    const slider = slope.getByRole('slider').first();
    await visibleFocus(slider);
    await page.keyboard.press('ArrowLeft');
    await expect(slider).toHaveValue('1.75');
    await slope.getByRole('spinbutton').nth(0).fill('-0.5');
    await slope.getByRole('spinbutton').nth(1).fill('2');
    await expect(slope.locator('[data-results]')).toContainText('Δy = -1');
    await expect(slope.locator('svg desc')).toContainText(
      fr ? 'graduations -4, 0, 4, 8' : 'ticks -4, 0, 4, 8',
    );
    await slope.getByRole('spinbutton').nth(2).fill('0');
    await expect(slope.locator('[data-results]')).toContainText(
      fr ? '0/0 est indéfini' : '0/0 is undefined',
    );

    await page.goto(`/${locale}/lessons/L38/`);
    const secant = page.locator('[data-l38-explorer="secant"]');
    await secant.scrollIntoViewIfNeeded();
    await expect(secant.locator('[data-h="0"]')).toBeEnabled();
    await secant.locator('[data-h="0"]').press('Enter');
    await expect(secant.locator('[data-secant-value]')).toContainText(
      fr ? 'non définie' : 'undefined',
    );
    await expect(secant.getByRole('status')).toContainText(
      fr ? 'non définie' : 'undefined',
    );
    await expect(secant.locator('svg desc')).toContainText(
      fr ? 'graduations de 6' : 'ticks every 6',
    );
  });

  test(`LZW tables have names, column and row headers; feedback waits for the learner (${locale})`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/chapters/C04/lzw/`);
    await expect(
      page.locator('astro-island:has(.lzw-workshop)'),
    ).not.toHaveAttribute('ssr');
    const dictionary = page.getByRole('table', {
      name: fr ? 'Dictionnaire à cette étape' : 'Dictionary at this step',
    });
    await expect(dictionary.getByRole('columnheader')).toHaveCount(2);
    await expect(dictionary.getByRole('rowheader')).toHaveCount(3);
    const region = page.getByRole('region', {
      name: fr ? 'Table du dictionnaire' : 'Dictionary table',
    });
    await visibleFocus(region);
    await page.keyboard.press('Tab');
    await expect(region).not.toBeFocused();
    await page.getByLabel('Mode', { exact: true }).selectOption('guided');
    const output = page.getByLabel(
      fr ? 'Code émis ou —' : 'Emitted code or —',
      {
        exact: true,
      },
    );
    const entry = page.getByLabel(
      fr ? 'Chaîne ajoutée ou —' : 'Added string or —',
      {
        exact: true,
      },
    );
    await output.fill('0');
    await entry.fill('-');
    const check = page.getByRole('button', {
      name: fr ? 'Vérifier cette étape' : 'Check this step',
    });
    await check.press('Enter');
    const feedback = page.locator('.lzw-feedback[role="status"]');
    await expect(feedback).toContainText(fr ? 'À revoir' : 'Try again');
    const next = page.getByRole('button', {
      name: fr ? 'Étape suivante' : 'Next step',
      exact: true,
    });
    await expect(next).toBeDisabled();
    await output.fill('2');
    await entry.fill('BA');
    await check.press('Enter');
    await expect(feedback).toContainText(fr ? 'Bien joué' : 'Well done');
    await expect(next).toBeEnabled();
    await expect(page.locator('.lzw-turn h3')).toHaveText(
      fr ? 'Étape 1' : 'Step 1',
    );
    await next.press('Enter');
    const trace = page.getByRole('table', {
      name: fr ? 'Trace détaillée' : 'Detailed trace',
    });
    await expect(
      trace.getByRole('columnheader', {
        name: fr ? 'Étape' : 'Step',
        exact: true,
      }),
    ).toHaveCount(1);
    await expect(trace.getByRole('rowheader')).toHaveCount(1);
    await expect(dictionary.getByRole('rowheader')).toHaveCount(4);
  });

  for (const theme of ['light', 'dark']) {
    test(`sample reflows at 320px with readable text and reduced motion (${locale}, ${theme})`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width: 320, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(
        (theme) => localStorage.setItem('um-theme', theme),
        theme,
      );
      for (const path of [
        'lessons/L03/',
        'lessons/L29/',
        'lessons/L38/',
        'lessons/L55/',
        'logic-workshop/',
        'chapters/C04/lzw/',
        'glossary/',
        'cheat-sheet/',
      ]) {
        await page.goto(`/${locale}/${path}`);
        await page.locator('html').evaluate((node, theme) => {
          node.setAttribute('data-theme', theme);
        }, theme);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
          path,
        ).toBeLessThanOrEqual(320);
        // Measure rendered text against its nearest opaque surface. Sample
        // plain prose/labels; images, gradients and native controls need manual QA.
        const contrasts = await page
          .locator('main p, main label')
          .evaluateAll((nodes) => {
            function rgb(value: string) {
              const values = value.match(/[\d.]+/g)?.map(Number) ?? [];
              return values.length >= 3 && (values[3] ?? 1) === 1
                ? values.slice(0, 3)
                : null;
            }
            function luminance(rgb: number[]) {
              return rgb
                .map((v) => {
                  const c = v / 255;
                  return c <= 0.04045
                    ? c / 12.92
                    : ((c + 0.055) / 1.055) ** 2.4;
                })
                .reduce(
                  (sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i]!,
                  0,
                );
            }
            return nodes
              .filter(
                (node) => node.checkVisibility() && node.textContent?.trim(),
              )
              .map((node) => {
                const style = getComputedStyle(node);
                const fg = rgb(style.color);
                let current: Element | null = node;
                let bg: number[] | null = null;
                while (current && !bg) {
                  bg = rgb(getComputedStyle(current).backgroundColor);
                  current = current.parentElement;
                }
                if (!fg || !bg) return null;
                const a = luminance(fg),
                  b = luminance(bg);
                return {
                  text: node.textContent?.trim().slice(0, 60),
                  ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
                };
              })
              .filter((result) => result !== null);
          });
        expect(contrasts.length, path).toBeGreaterThan(0);
        const contrastPath = testInfo.outputPath(
          path.replaceAll('/', '-') + 'contrast.json',
        );
        await writeFile(
          contrastPath,
          JSON.stringify({
            path,
            locale,
            theme,
            samples: contrasts.length,
            minimumRatio: Math.min(...contrasts.map((item) => item.ratio)),
          }),
        );
        await testInfo.attach(path.replaceAll('/', '-') + 'contrast.json', {
          path: contrastPath,
          contentType: 'application/json',
        });
        expect(
          contrasts.filter((item) => item.ratio < 4.5),
          path,
        ).toEqual([]);
        const smallTargets = await page
          .locator(
            '.geo-live button, .geo-live input, .l38-explorer button, .l38-explorer input, .lzw-workshop button, .lzw-workshop select',
          )
          .evaluateAll((nodes) =>
            nodes
              .filter((node) => node.checkVisibility())
              .map((node) => {
                const rect = node.getBoundingClientRect();
                return {
                  label:
                    node.getAttribute('aria-label') ?? node.textContent?.trim(),
                  width: rect.width,
                  height: rect.height,
                };
              })
              .filter((target) => target.width < 24 || target.height < 24),
          );
        expect(smallTargets, path).toEqual([]);
        const turn = page.locator('.lzw-turn');
        if (await turn.count())
          expect(
            await turn.evaluate((node) => getComputedStyle(node).animationName),
          ).toBe('none');
        if (path === 'chapters/C04/lzw/') {
          await page.locator('.lzw-workshop').screenshot({
            path: testInfo.outputPath('lzw-320.png'),
          });
        }
      }
    });
  }
}
