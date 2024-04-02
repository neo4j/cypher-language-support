import { testData } from '@neo4j-cypher/language-support';
import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';

test.use({ viewport: { width: 500, height: 500 } });

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

test('can complete pattern snippet', async ({ page, mount }) => {
  await mount(<CypherEditor />);
  const textField = page.getByRole('textbox');

  await textField.fill('MATCH ()-[]->()');

  await page.locator('.cm-tooltip-autocomplete').getByText('-[]->()').click();
  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  await textField.press('Tab');
  await textField.press('Tab');

  await expect(textField).toHaveText('MATCH ()-[]->()-[ ]->( )');
});

test('can accept completion inside pattern snippet', async ({
  page,
  mount,
}) => {
  await mount(<CypherEditor schema={{ labels: ['City'] }} />);
  const textField = page.getByRole('textbox');

  await textField.fill('MATCH ()-[]->()');

  await page.locator('.cm-tooltip-autocomplete').getByText('-[]->()').click();
  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  // move to node
  await textField.press('Tab');

  // get & accept completion
  await textField.press(':');
  await expect(
    page.locator('.cm-tooltip-autocomplete').getByText('City'),
  ).toBeVisible();

  await textField.press('Tab');
  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  // tab out of the snippet
  await textField.press('Tab');

  await expect(textField).toHaveText('MATCH ()-[]->()-[ ]->(:City)');
});

test('does not automatically open completion panel for expressions after snippet trigger char', async ({
  page,
  mount,
}) => {
  await mount(<CypherEditor />);
  const textField = page.getByRole('textbox');

  await textField.fill('RETURN (1)');

  // expect the panel to not show up
  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  // unless manually triggered
  await textField.press('Control+ ');
  await expect(page.locator('.cm-tooltip-autocomplete')).toBeVisible();
});
