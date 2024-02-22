import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';

test.use({ viewport: { width: 500, height: 500 } });

test('prompt shows up', async ({ mount, page }) => {
  const component = await mount(<CypherEditor prompt="neo4j>" />);

  await expect(component).toContainText('neo4j>');

  await component.update(<CypherEditor prompt="test>" />);
  await expect(component).toContainText('test>');

  const textField = page.getByRole('textbox');
  await textField.press('a');

  await expect(textField).toHaveText('a');
});

test('line numbers can be turned on/off', async ({ mount }) => {
  const component = await mount(<CypherEditor lineNumbers />);

  await expect(component).toContainText('1');

  await component.update(<CypherEditor lineNumbers={false} />);
  await expect(component).not.toContainText('1');
});
