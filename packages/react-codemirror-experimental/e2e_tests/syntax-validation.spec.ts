import { expect, test } from '@playwright/test';
import { CypherEditorPage } from './cypher-editor';

test.beforeEach(async ({ page }) => {
  await page.goto('localhost:3000');
});

test('Prop lint set to false disables syntax validation', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);
  const query = 'METCH (n) RETURN n';

  await editorPage.createEditor({ value: query, lint: false });

  await expect(page.locator('.cm-lintRange-error').last()).not.toBeVisible({
    timeout: 2000,
  });
});

test('Syntactic errors are surfaced', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);
  const query = 'METCH (n) RETURN n';

  await editorPage.createEditor({ value: query });

  await editorPage.checkErrorMessage(
    'METCH',
    'Unexpected keyword. Did you mean MATCH?',
  );
});

test('Errors for undefined labels are surfaced', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);
  const query = 'MATCH (n: Person) RETURN n';

  await editorPage.createEditor({
    value: query,
    schema: { labels: ['Movie'], relationshipTypes: [] },
  });

  await editorPage.checkWarningMessage(
    'Person',
    "Label Person is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
  );
});

test('Errors for multiline undefined labels are highlighted correctly', async ({
  page,
}) => {
  const editorPage = new CypherEditorPage(page);
  const query = `MATCH (n:\`Foo
    Bar\`) RETURN n`;
  const expectedMsg = `Label \`Foo
    Bar\` is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application`;

  await editorPage.createEditor({
    value: query,
    schema: { labels: ['Movie'], relationshipTypes: [] },
  });

  await editorPage.checkWarningMessage('`Foo', expectedMsg);
  await editorPage.checkWarningMessage('Bar`', expectedMsg);
});

test('Semantic errors are surfaced when there are no syntactic errors', async ({
  page,
}) => {
  const editorPage = new CypherEditorPage(page);
  const query = 'MATCH (n) RETURN m';

  await editorPage.createEditor({ value: query });

  await editorPage.checkErrorMessage('m', 'Variable `m` not defined');
});

test('Semantic errors are correctly accumulated', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);
  const query = 'CALL { MATCH (n) } IN TRANSACTIONS OF -1 ROWS';

  await editorPage.createEditor({ value: query });

  await editorPage.checkErrorMessage(
    'MATCH (n)',
    'Query cannot conclude with MATCH (must be a RETURN clause, an update clause, a unit subquery call, or a procedure call with no YIELD)',
  );

  await editorPage.checkErrorMessage(
    '-1',
    "Invalid input. '-1' is not a valid value. Must be a positive integer",
  );
});

test('Multiline errors are correctly placed', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);
  const query = `CALL { 
    MATCH (n) 
  } IN TRANSACTIONS 
  OF -1 ROWS`;

  await editorPage.createEditor({ value: query });

  await editorPage.checkErrorMessage(
    'MATCH (n)',
    'Query cannot conclude with MATCH (must be a RETURN clause, an update clause, a unit subquery call, or a procedure call with no YIELD)',
  );

  await editorPage.checkErrorMessage(
    '-1',
    "Invalid input. '-1' is not a valid value. Must be a positive integer",
  );
});

test('Validation errors are correctly overlapped', async ({ page }) => {
  const editorPage = new CypherEditorPage(page);
  const query = `CALL { MATCH (n)
    RETURN n
  } IN TRANSACTIONS 
  OF -1 ROWS`;

  await editorPage.createEditor({ value: query });

  await editorPage.checkErrorMessage(
    '-1',
    'Query cannot conclude with CALL (must be a RETURN clause, an update clause, a unit subquery call, or a procedure call with no YIELD)',
  );

  await editorPage.checkErrorMessage(
    '-1',
    "Invalid input. '-1' is not a valid value. Must be a positive integer",
  );
});
