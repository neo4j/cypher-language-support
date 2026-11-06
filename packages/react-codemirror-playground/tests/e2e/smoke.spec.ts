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

  // Check that we get syntax highlighting - that the editor has styled spans.
  await expect(
    page.locator('.cm-content .cm-line > span').first(),
  ).toBeVisible();

  // Linting via worker is often fragile. Test that this feature also works in the demo
  await page.getByRole('textbox').fill('METCH (n) RETURN n');
  await expect(page.locator('.cm-lintRange-error').last()).toBeVisible({
    timeout: 10000,
  });

  expect(errors).toEqual([]);
});
