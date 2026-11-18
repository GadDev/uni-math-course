import { test, expect } from '@playwright/test';

test('encoding can be replayed, stepped back and restarted without changing the exercise', async ({
  page,
}) => {
  await page.goto('/en/chapters/C04/lzw/');
  await expect(page.getByTestId('lzw-input')).toHaveText('BANANABANANA');
  await expect(page.getByTestId('lzw-output')).toHaveText('—');
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await expect(page.getByTestId('lzw-output')).toHaveText('2');
  await expect(
    page.getByRole('region', { name: 'Dictionary table' }),
  ).toContainText('BA');
  await page.getByRole('button', { name: 'Previous step' }).click();
  await expect(page.getByTestId('lzw-output')).toHaveText('—');
  await expect(
    page.getByRole('region', { name: 'Dictionary table' }),
  ).not.toContainText('BA');
  for (let i = 0; i < 11; i++)
    await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByRole('button', { name: 'Finish', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Challenge completed!' }),
  ).toBeVisible();
  await expect(page.getByTestId('lzw-output')).toHaveText('2 1 3 5 1 4 6 6');
  await page.getByRole('button', { name: 'Restart', exact: true }).click();
  await expect(page.getByTestId('lzw-output')).toHaveText('—');
  await expect(page.getByTestId('lzw-input')).toHaveText('BANANABANANA');
});

test('guided decoding preserves feedback until next step and teaches the special case', async ({
  page,
}) => {
  await page.goto('/en/chapters/C04/lzw/');
  await page.getByLabel('Example', { exact: true }).selectOption('ABABABA');
  await page.getByLabel('Activity', { exact: true }).selectOption('decode');
  await expect(page.getByLabel('Example', { exact: true })).not.toContainText(
    'ABABABA',
  );
  await page.getByLabel('Mode', { exact: true }).selectOption('guided');
  await page.getByLabel('Decoded chunk', { exact: true }).fill('B');
  await page.getByLabel('Completed entry or —', { exact: true }).fill('-');
  await page.getByRole('button', { name: 'Check this step' }).click();
  await expect(page.locator('.lzw-feedback')).toContainText('Try again');
  await expect(
    page.getByRole('button', { name: 'Next step', exact: true }),
  ).toBeDisabled();
  for (const [chunk, entry] of [
    ['A', '-'],
    ['B', 'AB'],
    ['AB', 'BA'],
    ['ABA', 'ABA'],
  ]) {
    await page.getByLabel('Decoded chunk', { exact: true }).fill(chunk!);
    await page.getByLabel('Completed entry or —', { exact: true }).fill(entry!);
    await page.getByRole('button', { name: 'Check this step' }).click();
    await expect(page.locator('.lzw-feedback')).toContainText('Well done');
    if (chunk === 'ABA') {
      await expect(page.locator('.lzw-feedback')).toContainText('Special case');
      await expect(
        page.getByRole('heading', { name: 'Challenge completed!' }),
      ).toHaveCount(0);
      await page.getByRole('button', { name: 'Finish', exact: true }).click();
    } else
      await page
        .getByRole('button', { name: 'Next step', exact: true })
        .click();
  }
  await expect(page.getByTestId('lzw-output')).toHaveText('ABABABA');
  await expect(
    page.getByRole('region', { name: 'Dictionary table' }),
  ).toContainText('ABA?');
  await page.getByRole('button', { name: 'Try the other direction' }).click();
  await expect(page.getByLabel('Activity', { exact: true })).toHaveValue(
    'encode',
  );
});

test('guided encoding accepts no-output decisions and requires the final flush without a fictitious addition', async ({
  page,
}) => {
  await page.goto('/en/chapters/C04/lzw/');
  await page.getByLabel('Example', { exact: true }).selectOption('AAAAAA');
  await page.getByLabel('Mode', { exact: true }).selectOption('guided');
  for (const [code, entry] of [
    ['1', 'AA'],
    ['-', '-'],
    ['2', 'AAA'],
    ['-', '-'],
    ['-', '-'],
    ['3', '-'],
  ]) {
    await page.getByLabel('Emitted code or —', { exact: true }).fill(code!);
    await page.getByLabel('Added string or —', { exact: true }).fill(entry!);
    await page.getByRole('button', { name: 'Check this step' }).click();
    await expect(page.locator('.lzw-feedback')).toContainText('Well done');
    await page
      .getByRole('button', {
        name: code === '3' ? 'Finish' : 'Next step',
        exact: true,
      })
      .click();
  }
  await expect(page.getByTestId('lzw-output')).toHaveText('1 2 3');
  await page.getByLabel('Show achievements for this session').check();
  await expect(
    page.getByText('★ Dictionary builder: challenge completed.'),
  ).toBeVisible();
});

test('exam practice hides the dictionary and output until submission and can be retried', async ({
  page,
}) => {
  await page.goto('/en/chapters/C04/lzw/');
  await page.getByLabel('Mode', { exact: true }).selectOption('exam');
  await expect(page.getByTestId('lzw-output')).toHaveCount(0);
  await page
    .getByLabel('Code sequence', { exact: true })
    .fill('2 1 3 5 1 4 6 6');
  await page.getByRole('button', { name: 'Submit and check' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Correct answer' }),
  ).toBeVisible();
  await expect(page.getByTestId('lzw-output')).toHaveText('2 1 3 5 1 4 6 6');
  await page.getByRole('button', { name: 'Restart', exact: true }).click();
  await page.getByLabel('Activity', { exact: true }).selectOption('decode');
  await page.getByLabel('Decoded message', { exact: true }).fill('WRONG');
  await page.getByRole('button', { name: 'Submit and check' }).click();
  await expect(
    page.getByRole('heading', { name: 'Solution to study' }),
  ).toBeVisible();
  await expect(page.getByTestId('lzw-output')).toHaveText('BANANABANANA');
});

test('custom decoding rejects impossible codes and random challenges can be reproduced', async ({
  page,
}) => {
  await page.goto('/en/chapters/C04/lzw/');
  await page.getByLabel('Activity', { exact: true }).selectOption('decode');
  await page
    .getByText('Create a challenge: random or custom', { exact: true })
    .click();
  await page
    .getByLabel('Initial alphabet, in code order', { exact: true })
    .fill('AB');
  await page.getByLabel('Custom codes', { exact: true }).fill('1 4');
  await page.getByRole('button', { name: 'Load this exercise' }).click();
  await expect(page.getByRole('alert')).toContainText('Impossible code');
  await page.getByLabel('Custom codes', { exact: true }).fill('1 2 3 5');
  await page.getByRole('button', { name: 'Load this exercise' }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByTestId('lzw-input')).toHaveText('1 2 3 5');
  await page.getByLabel('Difficulty', { exact: true }).selectOption('advanced');
  await page.getByLabel('Seed', { exact: true }).fill('42');
  await page.getByRole('button', { name: 'Generate challenge' }).click();
  const input = await page.getByTestId('lzw-input').textContent();
  await page.getByRole('button', { name: 'Next step', exact: true }).click();
  await page.getByRole('button', { name: 'Generate challenge' }).click();
  await expect(page.getByTestId('lzw-input')).toHaveText(input!);
  await expect(page.getByTestId('lzw-output')).toHaveText('—');
});

for (const locale of ['fr', 'en']) {
  test(`chapter navigation, lesson translations, keyboard and mobile layout (${locale})`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 850 });
    await page.goto(`/${locale}/chapters/C04/`);
    await page.locator(`a[href="/${locale}/chapters/C04/lzw/"]`).click();
    await expect(page.locator('.chapter-option[aria-current]')).toHaveAttribute(
      'data-chapter',
      'C04',
    );
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    const mode = page.getByLabel('Mode', { exact: true });
    await mode.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(mode).toHaveValue('guided');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(
      await page
        .locator('.lzw-turn')
        .evaluate((node) => getComputedStyle(node).animationName),
    ).toBe('none');
    await page.locator('[data-language-link]').click();
    await expect(page).toHaveURL(
      `/${locale === 'fr' ? 'en' : 'fr'}/chapters/C04/lzw/`,
    );
    for (const id of ['L55', 'L56', 'L57']) {
      await page.goto(`/${locale}/lessons/${id}/`);
      await expect(page.locator('article h1')).toBeVisible();
      await expect(
        page.locator(`article a[href="/${locale}/chapters/C04/lzw/"]`).first(),
      ).toBeVisible();
    }
  });
}

test('LZW reading and workshop lesson links remain accessible without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4321/fr/chapters/C04/lzw/');
    // Playwright excludes NOSCRIPT wrappers from its text matcher. Assert the
    // rendered fallback paragraph, including visibility with scripting disabled.
    const fallback = page.locator('noscript p');
    await expect(fallback).toBeVisible();
    await expect(fallback).toContainText('Activez JavaScript');
    await page
      .getByRole('link', { name: '3. Cas particulier et bilan' })
      .click();
    await expect(page.locator('article')).toContainText('ABABABA');
    await page.locator('article summary').click();
    await expect(page.locator('article')).toContainText('15 codes');
  } finally {
    await context.close();
  }
});
