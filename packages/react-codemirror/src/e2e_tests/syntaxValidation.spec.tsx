import { testData } from '@neo4j-cypher/language-support';
import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';
import { CypherEditorPage } from './e2eUtils';

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

test('Can turn linting back on', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  const query = 'METCH (n) RETURN n';

  const component = await mount(<CypherEditor value={query} lint={false} />);

  await expect(page.locator('.cm-lintRange-error').last()).not.toBeVisible({
    timeout: 2000,
  });

  await component.update(<CypherEditor value={query} lint={true} />);

  await editorPage.getEditor().fill('METCH (n) RETURN n');

  await editorPage.checkErrorMessage(
    'METCH',
    `Invalid input 'METCH': expected 'FOREACH', 'ALTER', 'ORDER BY', 'CALL', 'USING PERIODIC COMMIT', 'CREATE', 'LOAD CSV', 'START DATABASE', 'STOP DATABASE', 'DEALLOCATE', 'DELETE', 'DENY', 'DETACH', 'DROP', 'DRYRUN', 'FINISH', 'GRANT', 'INSERT', 'LIMIT', 'MATCH', 'MERGE', 'NODETACH', 'OFFSET', 'OPTIONAL', 'REALLOCATE', 'REMOVE', 'RENAME', 'RETURN', 'REVOKE', 'ENABLE SERVER', 'SET', 'SHOW', 'SKIP', 'TERMINATE', 'UNWIND', 'USE' or 'WITH'`,
  );
});

test('Syntactic errors are surfaced', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  const query = 'METCH (n) RETURN n';

  await mount(<CypherEditor value={query} />);

  await editorPage.checkErrorMessage(
    'METCH',
    `Invalid input 'METCH': expected 'FOREACH', 'ALTER', 'ORDER BY', 'CALL', 'USING PERIODIC COMMIT', 'CREATE', 'LOAD CSV', 'START DATABASE', 'STOP DATABASE', 'DEALLOCATE', 'DELETE', 'DENY', 'DETACH', 'DROP', 'DRYRUN', 'FINISH', 'GRANT', 'INSERT', 'LIMIT', 'MATCH', 'MERGE', 'NODETACH', 'OFFSET', 'OPTIONAL', 'REALLOCATE', 'REMOVE', 'RENAME', 'RETURN', 'REVOKE', 'ENABLE SERVER', 'SET', 'SHOW', 'SKIP', 'TERMINATE', 'UNWIND', 'USE' or 'WITH'`,
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

test('Semantic errors work in firefox', async ({
  browserName,
  page,
  mount,
}) => {
  test.skip(browserName !== 'firefox');
  const editorPage = new CypherEditorPage(page);
  const query = 'MATCH (n:OperationalPoint)--(m:OperationalPoint) RETURN s,m,n';

  await mount(<CypherEditor value={query} schema={testData.mockSchema} />);

  await editorPage.checkErrorMessage('s,m,n', 'Variable `s` not defined');
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
    'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
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
    'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD)',
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
    'Query cannot conclude with CALL (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
  );

  await editorPage.checkErrorMessage(
    '-1',
    "Invalid input. '-1' is not a valid value. Must be a positive integer",
  );
});

test('Strikethroughs are shown for deprecated functions', async ({
  page,
  mount,
}) => {
  const editorPage = new CypherEditorPage(page);
  const query = `RETURN id()`;

  await mount(<CypherEditor value={query} schema={testData.mockSchema} />);
  await expect(
    editorPage.page.locator('.cm-deprecated-element').last(),
  ).toBeVisible({ timeout: 3000 });
  await editorPage.checkWarningMessage('id', 'Function id is deprecated.');
});

test('Strikethroughs are shown for deprecated procedures', async ({
  page,
  mount,
}) => {
  const editorPage = new CypherEditorPage(page);
  const query = `CALL apoc.create.uuids()`;

  await mount(<CypherEditor value={query} schema={testData.mockSchema} />);
  await expect(
    editorPage.page.locator('.cm-deprecated-element').last(),
  ).toBeVisible({ timeout: 3000 });

  await editorPage.checkWarningMessage(
    'apoc.create.uuids',
    'Procedure apoc.create.uuids is deprecated.',
  );
});
