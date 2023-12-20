import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';
import { CypherEditorPage } from './e2e-utils';

test.use({ viewport: { width: 1000, height: 500 } });
test('Prop lint set to false disables syntax validation', async ({
  page,
  mount,
}) => {
  const query = 'METCH (n) RETURN n';

  await mount(<CypherEditor value={query} lint={false} />);

  await expect(page.locator('.cm-lintRange-error').last()).not.toBeVisible({
    timeout: 2000,
  });
});

test.skip('Can turn linting back on', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  const query = 'METCH (n) RETURN n';

  const component = await mount(<CypherEditor value={query} lint={false} />);

  await expect(page.locator('.cm-lintRange-error').last()).not.toBeVisible({
    timeout: 2000,
  });

  await component.update(<CypherEditor value={query} lint />);

  await editorPage.getEditor().fill('METCH (n) RETURN n');

  await editorPage.checkErrorMessage(
    'METCH',
    'Unrecognized keyword. Did you mean MATCH?',
  );
});

test('Syntactic errors are surfaced', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  const query = 'METCH (n) RETURN n';

  await mount(<CypherEditor value={query} />);

  await editorPage.checkErrorMessage(
    'METCH',
    'Unrecognized keyword. Did you mean MATCH?',
  );
});

test('Errors for undefined labels are surfaced', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  const query = 'MATCH (n: Person) RETURN n';

  await mount(
    <CypherEditor
      value={query}
      schema={{ labels: ['Movie'], relationshipTypes: [] }}
    />,
  );

  await editorPage.checkWarningMessage(
    'Person',
    "Label Person is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
  );
});

test('Errors for multiline undefined labels are highlighted correctly', async ({
  page,
  mount,
}) => {
  const editorPage = new CypherEditorPage(page);
  const query = `MATCH (n:\`Foo
    Bar\`) RETURN n`;
  const expectedMsg = `Label \`Foo
    Bar\` is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application`;

  await mount(
    <CypherEditor
      value={query}
      schema={{ labels: ['Movie'], relationshipTypes: [] }}
    />,
  );

  await editorPage.checkWarningMessage('`Foo', expectedMsg);
  await editorPage.checkWarningMessage('Bar`', expectedMsg);
});

test('Semantic errors are surfaced when there are no syntactic errors', async ({
  page,
  mount,
}) => {
  const editorPage = new CypherEditorPage(page);
  const query = 'MATCH (n) RETURN m';

  await mount(<CypherEditor value={query} />);

  await editorPage.checkErrorMessage('m', 'Variable `m` not defined');
});

test('Semantic errors are correctly accumulated', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  const query = 'CALL { MATCH (n) } IN TRANSACTIONS OF -1 ROWS';

  await mount(<CypherEditor value={query} />);

  await editorPage.checkErrorMessage(
    'MATCH (n)',
    'Query cannot conclude with MATCH (must be a RETURN clause, an update clause, a unit subquery call, or a procedure call with no YIELD)',
  );

  await editorPage.checkErrorMessage(
    '-1',
    "Invalid input. '-1' is not a valid value. Must be a positive integer",
  );
});

test('Multiline errors are correctly placed', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  const query = `CALL { 
    MATCH (n) 
  } IN TRANSACTIONS 
  OF -1 ROWS`;

  await mount(<CypherEditor value={query} />);

  await editorPage.checkErrorMessage(
    'MATCH (n)',
    'Query cannot conclude with MATCH (must be a RETURN clause, an update clause, a unit subquery call, or a procedure call with no YIELD)',
  );

  await editorPage.checkErrorMessage(
    '-1',
    "Invalid input. '-1' is not a valid value. Must be a positive integer",
  );
});

test('Validation errors are correctly overlapped', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  const query = `CALL { MATCH (n)
    RETURN n
  } IN TRANSACTIONS 
  OF -1 ROWS`;

  await mount(<CypherEditor value={query} />);

  await editorPage.checkErrorMessage(
    '-1',
    'Query cannot conclude with CALL (must be a RETURN clause, an update clause, a unit subquery call, or a procedure call with no YIELD)',
  );

  await editorPage.checkErrorMessage(
    '-1',
    "Invalid input. '-1' is not a valid value. Must be a positive integer",
  );
});

// TODO test semantic analayssi here as well
