import { expect, test } from '@playwright/test';

test('production bundle loads and highlights Cypher without errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(`console.error: ${message.text()}`);
    }
  });

  await page.goto('/');

  await expect(page.locator('.cm-editor')).toBeVisible();

  // The demo query is syntax highlighted, so the editor renders styled spans.
  // A module that throws while evaluating takes the whole app down before
  // React mounts, which is how bundler-only breakage tends to surface here.
  await expect(
    page.locator('.cm-content .cm-line > span').first(),
  ).toBeVisible();

  // Linting runs in a web worker emitted as its own asset and loaded by URL,
  // a seam that only exists in the bundled build. Feature coverage for linting
  // itself lives in the react-codemirror component tests.
  await page.getByRole('textbox').fill('METCH (n) RETURN n');
  await expect(page.locator('.cm-lintRange-error').last()).toBeVisible({
    timeout: 10000,
  });

  expect(errors).toEqual([]);
});
