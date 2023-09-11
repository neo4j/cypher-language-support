import { expect, test } from '@playwright/test';
import { CypherEditorPage } from './cypher-editor';

test.beforeEach(async ({ page }) => {
  await page.goto('localhost:3000');
});

test('can complete in the middle of statement', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);

  await editorPage.createEditor({
    value: `MATCH ()
WHER true
RETURN n;`,
  });

  // Move into the statement and trigger autocompletion
  await editorPage.getEditor().press('ArrowDown');
  await editorPage.getEditor().press('ArrowRight');
  await editorPage.getEditor().press('ArrowRight');
  await editorPage.getEditor().press('ArrowRight');
  await editorPage.getEditor().press('ArrowRight');

  await page.keyboard.press('Control+ ');

  await expect(page.locator('.cm-tooltip-autocomplete')).toBeVisible();
  await page.locator('.cm-tooltip-autocomplete').getByText('WHERE').click();

  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  expect(await editorPage.getEditor().textContent()).toContain('WHERE true');
});

test('get completions when typing and can accept completions with tab', async ({
  page,
}) => {
  const editorPage = new CypherEditorPage(page);

  await editorPage.createEditor({ value: '' });

  await editorPage.getEditor().type('RETU');

  await expect(
    page.locator('.cm-tooltip-autocomplete').getByText('RETURN'),
  ).toBeVisible();
  // We need to wait for the editor to realise there is a completion open
  // so that it does not just indent with tab key
  await page.waitForTimeout(500);
  await editorPage.getEditor().press('Tab');

  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  expect(await editorPage.getEditor().textContent()).toContain('RETURN');
});

test('can complete labels', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);

  await editorPage.createEditor({
    value: '',
    schema: {
      labels: ['Pokemon'],
      relationshipTypes: [],
      functionSignatures: {},
      procedureSignatures: {},
      aliasNames: [],
      databaseNames: [],
      parameterNames: [],
      propertyKeys: [],
    },
  });
  await editorPage.getEditor().type('MATCH (n :P');

  await page.locator('.cm-tooltip-autocomplete').getByText('Pokemon').click();
  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  expect(await editorPage.getEditor().textContent()).toContain(
    'MATCH (n :Pokemon',
  );
});

test('can complete rel types', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);

  await editorPage.createEditor({
    value: '',
    schema: {
      labels: [],
      relationshipTypes: ['KNOWS'],
      functionSignatures: {},
      procedureSignatures: {},
      aliasNames: [],
      databaseNames: [],
      parameterNames: [],
      propertyKeys: [],
    },
  });
  await editorPage.getEditor().type('MATCH (n)-[:');

  await page.locator('.cm-tooltip-autocomplete').getByText('KNOWS').click();
  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  expect(await editorPage.getEditor().textContent()).toContain(
    'MATCH (n)-[:KNOWS',
  );
});

test('can complete functions', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);

  await editorPage.createEditor({
    value: '',
    schema: {
      labels: [],
      relationshipTypes: [],
      functionSignatures: {
        function123: { label: 'function123', documentation: 'no docs' },
      },
      procedureSignatures: {},
      aliasNames: [],
      databaseNames: [],
      parameterNames: [],
      propertyKeys: [],
    },
  });

  await editorPage.getEditor().type('RETURN func');

  await page
    .locator('.cm-tooltip-autocomplete')
    .getByText('function123')
    .click();
  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  expect(await editorPage.getEditor().textContent()).toContain(
    'RETURN function123',
  );
});

test('can complete procedures', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);

  await editorPage.createEditor({
    value: '',
    schema: {
      labels: [],
      relationshipTypes: [],
      functionSignatures: {},
      procedureSignatures: {
        'db.ping': { label: 'db.ping', documentation: 'no docs' },
      },
      aliasNames: [],
      databaseNames: [],
      parameterNames: [],
      propertyKeys: [],
    },
  });

  await editorPage.getEditor().type('CALL d');

  await page.locator('.cm-tooltip-autocomplete').getByText('db.ping').click();
  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  expect(await editorPage.getEditor().textContent()).toContain('CALL db.ping');
});

test('can complete parameters', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);

  await editorPage.createEditor({
    value: '',
    schema: {
      labels: [],
      relationshipTypes: [],
      functionSignatures: {},
      procedureSignatures: {},
      aliasNames: [],
      databaseNames: [],
      parameterNames: ['parameter'],
      propertyKeys: [],
    },
  });

  await editorPage.getEditor().type('RETURN $');

  await page.locator('.cm-tooltip-autocomplete').getByText('parameter').click();
  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  expect(await editorPage.getEditor().textContent()).toEqual(
    'RETURN $parameter',
  );
});
