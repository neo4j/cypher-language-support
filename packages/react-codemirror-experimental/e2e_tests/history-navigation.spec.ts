import { expect, test } from '@playwright/test';
import { CypherEditorPage } from './cypher-editor';

test.beforeEach(async ({ page }) => {
  await page.goto('localhost:3000');
});

test('respects preloaded history', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);

  const initialValue = 'MATCH (n) RETURN n;';
  await editorPage.createEditor({
    value: initialValue,
    initialHistory: ['first', 'second'],
  });
  await editorPage.getEditor().press('ArrowUp');
  await expect(page.getByText('first')).toBeVisible();
  // First arrow up is to get to start of line
  await editorPage.getEditor().press('ArrowUp');
  await editorPage.getEditor().press('ArrowUp');
  await expect(page.getByText('second')).toBeVisible();

  await editorPage.getEditor().press('ArrowDown');
  await expect(page.getByText('first')).toBeVisible();
  await editorPage.getEditor().press('ArrowDown');
  await expect(page.getByText(initialValue)).toBeVisible();
});

test('can execute queries and see them in history', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);

  const initialValue = `MATCH (n)
RETURN n;`;

  await editorPage.createEditor({ value: initialValue });

  // Execute initial query
  await editorPage.getEditor().press('Enter');
  await expect(page.getByText('query-executed')).toBeVisible();

  // Ensure query execution doesn't fire if the query is only whitespace
  await editorPage.getEditor().type('     ');
  await editorPage.getEditor().press('Enter');
  await expect(page.getByText('query-executed')).toHaveCount(1);

  // Ensure shift enter doesn't execute query
  await editorPage.getEditor().type('multiline');
  await editorPage.getEditor().press('Shift+Enter');
  await editorPage.getEditor().press('Shift+Enter');
  await editorPage.getEditor().press('Shift+Enter');
  await editorPage.getEditor().press('Shift+Enter');
  await editorPage.getEditor().type('entry');
  await expect(page.getByText('query-executed')).toHaveCount(1);
  await editorPage.getEditor().press('Enter');

  // type a new query and make sure it's not lost when navigating history
  await editorPage.getEditor().type('draft');
  await expect(page.getByText('draft')).toBeVisible();
  await expect(page.getByText('query-executed')).toHaveCount(2);

  // Navigate to the top of the editor before navigating history
  await editorPage.getEditor().press('ArrowLeft');
  await editorPage.getEditor().press('ArrowLeft');
  await editorPage.getEditor().press('ArrowLeft');
  await editorPage.getEditor().press('ArrowLeft');
  await editorPage.getEditor().press('ArrowLeft');
  await editorPage.getEditor().press('ArrowUp');

  // Ensure moving down in the editor doesn't navigate history
  await expect(page.getByText('multiline')).toBeVisible();

  // arrow movements don't matter until bottom is hit
  await editorPage.getEditor().press('ArrowUp');
  await editorPage.getEditor().press('ArrowUp');
  await editorPage.getEditor().press('ArrowDown');
  await editorPage.getEditor().press('ArrowDown');

  // editor still multiline
  await expect(page.getByText('multiline')).toBeVisible();

  // until you hit the end where have the draft we created earlier
  await editorPage.getEditor().press('ArrowDown');
  await expect(page.getByText('draft')).toBeVisible();
});
