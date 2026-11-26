import { expect, test } from '@playwright/test';

for (const locale of ['fr', 'en']) {
  test(`${locale}: L23 module anchors, quotient check and absolute distance`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/lessons/L23/`);
    await expect(
      page.locator('.algebra-study h2').filter({ hasText: /^[1-6]\. / }),
    ).toHaveCount(6);
    for (const id of ['fractions', 'powers', 'roots']) {
      await expect(page.locator(`#module-${id}`)).toHaveCount(1);
    }
    const fractions = page.locator('[data-fraction-lab] .method-live');
    await fractions.scrollIntoViewIfNeeded();
    await fractions.getByRole('button', { name: '3/4 ÷ 9/8' }).click();
    await expect(
      fractions.locator('[data-fraction-division-check]'),
    ).toBeVisible();
    await fractions.getByRole('spinbutton').nth(2).fill('0');
    await expect(
      fractions.locator('[data-fraction-division-check]'),
    ).toHaveCount(0);
    const domain = page.locator('[data-algebra-lab="domain"]');
    await domain.scrollIntoViewIfNeeded();
    const input = domain.getByRole('spinbutton');
    await input.fill('-2');
    await expect(domain.locator('[data-root-distance]:visible')).toContainText(
      '|x| = 2',
    );
    await input.fill('0');
    await expect(domain.locator('[data-root-distance]:visible')).toContainText(
      '|x| = 0',
    );
    await input.fill('3');
    await expect(domain.locator('[data-quotient]:visible')).toHaveText(
      locale === 'fr' ? 'Non défini' : 'Undefined',
    );
    await expect(page.locator('.katex-error')).toHaveCount(0);
  });
}
