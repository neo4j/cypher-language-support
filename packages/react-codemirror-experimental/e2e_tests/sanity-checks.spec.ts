import { expect, test } from '@playwright/test';
import { CypherEditorPage } from './cypher-editor';

test.beforeEach(async ({ page }) => {
  await page.goto('localhost:5173');
});

test('can mount the editor with text', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);

  await editorPage.createEditor({ value: 'MATCH (n) RETURN n;' });
  await expect(page.getByText('MATCH (n) RETURN n;')).toBeVisible();
});

test('can complete RETURN', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);
  await editorPage.createEditor({ value: '' });

  await editorPage.getEditor().type('RETU');
  await page.getByText('RETURN').click();
  await expect(editorPage.getEditor()).toHaveText('RETURN');
});

test('can complete CALL/CREATE', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);
  await editorPage.createEditor({ value: '' });

  await editorPage.getEditor().type('C');
  await expect(page.getByText('CALL')).toBeVisible();
  await expect(page.getByText('CREATE')).toBeVisible();
  await editorPage.getEditor().type('A');
  await expect(page.getByText('CALL')).toBeVisible();
  await expect(page.getByText('CREATE')).not.toBeVisible();

  await editorPage.getEditor().press('Enter', { delay: 500 });
  await expect(editorPage.getEditor()).toHaveText('CALL');
});

test('prompt shows up', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);
  await editorPage.createEditor({ value: '', prompt: 'neo4j>' });

  // for some reason it's rendered two times, first one is hidden
  await expect(page.getByText('neo4j').nth(1)).toBeVisible();
});
