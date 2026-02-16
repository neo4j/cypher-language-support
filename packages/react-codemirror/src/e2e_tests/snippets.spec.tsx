import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';


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
