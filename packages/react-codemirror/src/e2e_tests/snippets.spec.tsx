import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';

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

test('can navigate snippet', async ({ page, mount }) => {
  await mount(<CypherEditor />);
  const textField = page.getByRole('textbox');

  await textField.fill('CREATE INDEX abc FOR ()');

  await page
    .locator('.cm-tooltip-autocomplete')
    .getByText('-[]-()', { exact: true })
    .click();
  await expect(page.locator('.cm-tooltip-autocomplete')).not.toBeVisible();
  await expect(page.locator('.cm-snippetField')).toHaveCount(2);

  await textField.press('Tab');
  await textField.press('Shift+Tab');

  await expect(textField).toHaveText('CREATE INDEX abc FOR ()-[ ]-( )');

  await textField.press('a');
  await expect(textField).toHaveText('CREATE INDEX abc FOR ()-[a]-( )');

  await textField.press('Escape');
  await textField.press('Escape');
  await expect(page.locator('.cm-snippetField')).toHaveCount(0);
  await textField.press('Tab');
  await expect(textField).toHaveText('CREATE INDEX abc FOR ()-[a  ]-( )');
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
