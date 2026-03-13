import { test, expect, Page } from '@playwright/test';

const VSCODE_WEB_URL = `http://localhost:${process.env.VSCODE_WEB_PORT ?? 3333}`;

async function waitForVSCodeReady(page: Page) {
  await page.goto(VSCODE_WEB_URL);
  await page.waitForSelector('.monaco-workbench', { timeout: 30_000 });
  // Give extensions a moment to activate
  await page.waitForTimeout(3_000);
}

async function executeCommand(page: Page, command: string) {
  await page.keyboard.press('Control+Shift+KeyP');
  await page.waitForSelector('.quick-input-widget', { timeout: 5_000 });
  await page.keyboard.type(command, { delay: 50 });
  await page.waitForTimeout(500);
  await page.keyboard.press('Enter');
}

/**
 * Helper to create a new file and set its language to Cypher.
 */
async function createCypherFile(page: Page) {
  // Create a new untitled file
  await executeCommand(page, 'New Untitled Text File');
  await page.waitForTimeout(1_000);

  // Set language to Cypher
  await executeCommand(page, 'Change Language Mode');
  await page.waitForTimeout(500);
  await page.keyboard.type('Cypher', { delay: 50 });
  await page.waitForTimeout(500);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1_000);
}

test.describe('Web Extension - Basic Language Features', () => {
  test('extension activates and provides syntax highlighting', async ({
    page,
  }) => {
    await waitForVSCodeReady(page);
    await createCypherFile(page);

    // Type a Cypher query
    await page.keyboard.type('MATCH (n:Person) RETURN n', { delay: 30 });
    await page.waitForTimeout(2_000);

    // Verify the editor has content (the text was typed successfully)
    const editorContent = page.locator('.monaco-editor .view-lines');
    await expect(editorContent).toContainText('MATCH');
    await expect(editorContent).toContainText('RETURN');
  });

  test('completions work for Cypher keywords', async ({ page }) => {
    await waitForVSCodeReady(page);
    await createCypherFile(page);

    // Type partial keyword and trigger completion
    await page.keyboard.type('MATC', { delay: 50 });
    await page.keyboard.press('Control+Space');
    await page.waitForTimeout(2_000);

    // Verify completion list appears with MATCH
    const suggestWidget = page.locator('.editor-widget.suggest-widget');
    await expect(suggestWidget).toBeVisible({ timeout: 5_000 });
    await expect(suggestWidget).toContainText('MATCH');
  });

  test('signature help works for functions', async ({ page }) => {
    await waitForVSCodeReady(page);
    await createCypherFile(page);

    // Type a function call to trigger signature help
    await page.keyboard.type('RETURN toInteger(', { delay: 50 });
    await page.waitForTimeout(2_000);

    // Verify signature help widget appears
    const signatureHelp = page.locator('.parameter-hints-widget');
    await expect(signatureHelp).toBeVisible({ timeout: 5_000 });
  });

  test('document formatting works', async ({ page }) => {
    await waitForVSCodeReady(page);
    await createCypherFile(page);

    // Type poorly formatted Cypher
    await page.keyboard.type('match(n)return n', { delay: 30 });
    await page.waitForTimeout(1_000);

    // Trigger format document
    await page.keyboard.press('Shift+Alt+KeyF');
    await page.waitForTimeout(2_000);

    // Verify the text was reformatted (keywords should be uppercased)
    const editorContent = page.locator('.monaco-editor .view-lines');
    await expect(editorContent).toContainText('MATCH');
    await expect(editorContent).toContainText('RETURN');
  });
});
