import { testData } from '@neo4j-cypher/language-support';
import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';

test('hello world end 2 end test', async ({ mount }) => {
  const component = await mount(<CypherEditor value="hello world" />);
  await expect(component).toContainText('hello world');
  await component.update(<CypherEditor value="RETURN 123" />);
  await expect(component).toContainText('RETURN 123');
});

test('can complete in the middle of statement', async ({ mount, page }) => {
  const component = await mount(
    <CypherEditor
      value={`MATCH ()
WHER true
RETURN n;`}
    />,
  );

  // Move into the statement and trigger autocompletion
  const textField = page.getByRole('textbox');

  await textField.focus();
  await textField.press('ArrowDown');
  await textField.press('ArrowRight');
  await textField.press('ArrowRight');
  await textField.press('ArrowRight');
  await textField.press('ArrowRight');

  await textField.press('Control+ ');

  await expect(page.locator('.cm-tooltip-autocomplete')).toBeVisible();
  await page.locator('.cm-tooltip-autocomplete').getByText('WHERE').click();

  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  await expect(component).toContainText('WHERE true');
});

test('get completions when typing and can accept completions with tab', async ({
  mount,
  page,
}) => {
  const component = await mount(<CypherEditor />);
  const textField = page.getByRole('textbox');

  await textField.fill('RETU');

  await expect(
    page.locator('.cm-tooltip-autocomplete').getByText('RETURN'),
  ).toBeVisible();

  // We need to wait for the editor to realise there is a completion open
  // so that it does not just indent with tab key
  await page.waitForTimeout(500);
  await textField.press('Tab');

  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  await expect(component).toContainText('RETURN');
});

test('can complete labels', async ({ mount, page }) => {
  const component = await mount(
    <CypherEditor
      schema={{
        labels: ['Pokemon'],
      }}
    />,
  );

  const textField = page.getByRole('textbox');

  await textField.fill('MATCH (n :P');

  await page.locator('.cm-tooltip-autocomplete').getByText('Pokemon').click();
  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  await expect(component).toContainText('MATCH (n :Pokemon');
});

test('can update dbschema', async ({ mount, page }) => {
  const component = await mount(
    <CypherEditor
      schema={{
        labels: ['Pokemon'],
      }}
    />,
  );

  const textField = page.getByRole('textbox');

  await textField.fill('MATCH (n :');

  await expect(
    page.locator('.cm-tooltip-autocomplete').getByText('Pokemon'),
  ).toBeVisible();

  await textField.press('Escape');

  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  await component.update(
    <CypherEditor
      schema={{
        labels: ['Pokemon', 'Digimon'],
      }}
    />,
  );

  await textField.press('Control+ ');

  await expect(
    page.locator('.cm-tooltip-autocomplete').getByText('Pokemon'),
  ).toBeVisible();

  await expect(
    page.locator('.cm-tooltip-autocomplete').getByText('Digimon'),
  ).toBeVisible();
});

test('can complete rel types', async ({ page, mount }) => {
  const component = await mount(
    <CypherEditor
      schema={{
        relationshipTypes: ['KNOWS'],
      }}
    />,
  );

  const textField = page.getByRole('textbox');

  await textField.fill('MATCH (n)-[:');

  await page.locator('.cm-tooltip-autocomplete').getByText('KNOWS').click();
  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  await expect(component).toContainText('MATCH (n)-[:KNOWS');
});

test('can complete functions', async ({ page, mount }) => {
  const component = await mount(
    <CypherEditor
      schema={{
        functions: {
          function123: {
            ...testData.emptyFunction,
            name: 'function123',
          },
        },
      }}
    />,
  );

  const textField = page.getByRole('textbox');

  await textField.fill('RETURN func');

  await page
    .locator('.cm-tooltip-autocomplete')
    .getByText('function123')
    .click();

  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  await expect(component).toContainText('RETURN function123');
});

test('can complete procedures', async ({ page, mount }) => {
  const component = await mount(
    <CypherEditor
      schema={{
        procedures: {
          'db.ping': { ...testData.emptyProcedure, name: 'db.ping' },
        },
      }}
    />,
  );

  const textField = page.getByRole('textbox');

  await textField.fill('CALL d');

  await page.locator('.cm-tooltip-autocomplete').getByText('db.ping').click();
  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  await expect(component).toContainText('CALL db.ping');
});

test('can complete parameters', async ({ page, mount }) => {
  const component = await mount(
    <CypherEditor
      schema={{
        parameters: { parameter: { type: 'string' } },
      }}
    />,
  );

  const textField = page.getByRole('textbox');

  await textField.fill('RETURN $p');

  await page.locator('.cm-tooltip-autocomplete').getByText('parameter').click();
  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  await expect(component).toContainText('RETURN $parameter');
});

test('completes allShortestPaths correctly', async ({ page, mount }) => {
  await mount(
    <CypherEditor
      schema={{
        parameters: { parameter: { type: 'string' } },
      }}
    />,
  );

  const textField = page.getByRole('textbox');

  // The first query contains errors on purpose so the
  // syntax errors get triggered before the auto-completion
  await textField.fill('MATCH (n) REURN n; MATCH a');

  await page
    .locator('.cm-tooltip-autocomplete')
    .getByText('allShortestPaths')
    .click();
  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  expect(await textField.textContent()).toEqual(
    'MATCH (n) REURN n; MATCH allShortestPaths',
  );
});

test('shows signature help information on auto-completion for procedures', async ({
  page,
  mount,
}) => {
  await mount(<CypherEditor schema={testData.mockSchema} />);
  const procName = 'apoc.periodic.iterate';
  const procedure = testData.mockSchema.procedures[procName];

  const textField = page.getByRole('textbox');
  await textField.fill('CALL apoc.periodic.');

  await expect(page.locator('.cm-tooltip-autocomplete')).toBeVisible();

  const infoTooltip = page.locator('.cm-completionInfo');

  while (!(await infoTooltip.getByText(procName).isVisible())) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);
  }

  await expect(infoTooltip).toContainText(procedure.signature);
  await expect(infoTooltip).toContainText(procedure.description);
});

test('shows signature help information on auto-completion for functions', async ({
  page,
  mount,
}) => {
  await mount(<CypherEditor schema={testData.mockSchema} />);
  const fnName = 'apoc.coll.combinations';
  const fn = testData.mockSchema.functions[fnName];

  const textField = page.getByRole('textbox');
  await textField.fill('RETURN apoc.coll.');

  await expect(page.locator('.cm-tooltip-autocomplete')).toBeVisible();

  const infoTooltip = page.locator('.cm-completionInfo');

  while (!(await infoTooltip.getByText(fnName).isVisible())) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);
  }

  await expect(infoTooltip).toContainText(fn.signature);
  await expect(infoTooltip).toContainText(fn.description);
});

test('shows deprecated procedures as strikethrough on auto-completion', async ({
  page,
  mount,
}) => {
  const procName = 'apoc.trigger.resume';

  await mount(
    <CypherEditor
      schema={{
        procedures: { [procName]: testData.mockSchema.procedures[procName] },
      }}
    />,
  );
  const textField = page.getByRole('textbox');
  await textField.fill('CALL apoc.trigger.');

  // We need to assert on the element having the right class
  // and trusting the CSS is making this truly strikethrough
  await expect(page.locator('.cm-deprecated-completion')).toBeVisible();
});

test('shows deprecated function as strikethrough on auto-completion', async ({
  page,
  mount,
}) => {
  const fnName = 'apoc.create.uuid';

  await mount(
    <CypherEditor
      schema={{
        functions: { [fnName]: testData.mockSchema.functions[fnName] },
      }}
    />,
  );
  const textField = page.getByRole('textbox');
  await textField.fill('RETURN apoc.create.');

  // We need to assert on the element having the right class
  // and trusting the CSS is making this truly strikethrough
  await expect(page.locator('.cm-deprecated-completion')).toBeVisible();
});
