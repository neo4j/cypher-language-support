import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';
import { CypherEditorPage } from './e2e-utils';
import { largeQuery, mockSchema } from './mock-data';

test.use({ viewport: { width: 1000, height: 500 } });

test('performance test session ', async ({ mount, page }) => {
  test.setTimeout(30 * 1000);
  const editorPage = new CypherEditorPage(page);
  const component = await mount(
    <CypherEditor prompt="neo4j>" theme="dark" lint schema={mockSchema} />,
  );

  // pressSequentially is less efficient -> we want to test the performance of the editor
  await editorPage.getEditor().pressSequentially(`
   MATCH (n:Person) RETURN m;`);

  await editorPage.checkErrorMessage('m', 'Variable `m` not defined');

  // set and unset large query a few times
  await component.update(
    <CypherEditor value={largeQuery} schema={mockSchema} />,
  );
  await component.update(<CypherEditor value="" schema={mockSchema} />);

  await component.update(
    <CypherEditor value={largeQuery} schema={mockSchema} />,
  );
  await component.update(<CypherEditor value="" />);

  await component.update(
    <CypherEditor value={largeQuery} schema={mockSchema} />,
  );
  await component.update(<CypherEditor value="" schema={mockSchema} />);

  await component.update(
    <CypherEditor value={largeQuery} schema={mockSchema} />,
  );
  await component.update(<CypherEditor value="" schema={mockSchema} />);

  await component.update(
    <CypherEditor value={largeQuery} schema={mockSchema} />,
  );

  await editorPage.getEditor().pressSequentially(`
 MATCH (n:P`);

  await expect(
    page.locator('.cm-tooltip-autocomplete').getByText('Person'),
  ).toBeVisible();

  await page.locator('.cm-tooltip-autocomplete').getByText('Person').click();

  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();

  await expect(component).toContainText('MATCH (n:Person');

  await editorPage.getEditor().pressSequentially(') RETRN my');

  await expect(component).toContainText('MATCH (n:Person) RETRN m');

  await editorPage.checkErrorMessage(
    'RETRN',
    'Unexpected token. Did you mean RETURN?',
  );

  await editorPage
    .getEditor()
    .pressSequentially('veryveryveryverylongvariable');
});
