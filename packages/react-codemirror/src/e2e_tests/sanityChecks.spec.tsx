import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';

test.use({ viewport: { width: 500, height: 500 } });

test('can mount the editor with text', async ({ mount }) => {
  const component = await mount(<CypherEditor value="MATCH (n) RETURN n;" />);

  await expect(component).toContainText('MATCH (n) RETURN n;');
});

test('the editors text can be externally controlled ', async ({ mount }) => {
  const intitialValue = 'MATCH (n) RETURN n;';

  const component = await mount(<CypherEditor value={intitialValue} />);

  await expect(component).toContainText(intitialValue);

  const newValue = 'RETURN 123';
  await component.update(<CypherEditor value={newValue} />);

  await expect(component).toContainText(newValue);
});

test('the editor can report changes to the text ', async ({ mount, page }) => {
  const intitialValue = 'MATCH (n) ';

  let editorValueCopy = intitialValue;
  const onChange = (val: string) => {
    editorValueCopy = val;
  };

  await mount(<CypherEditor value={intitialValue} onChange={onChange} />);

  const textField = page.getByRole('textbox');

  await textField.fill('RETURN 12');

  // editor update is debounced, retry wait for debounced
  await expect(() => {
    expect(editorValueCopy).toBe('RETURN 12');
  }).toPass({ intervals: [300, 300, 1000] });

  await page.keyboard.type('34');

  await expect(() => {
    expect(editorValueCopy).toBe('RETURN 12');
  }).toPass({ intervals: [300, 300, 1000] });
});

test('can complete RETURN', async ({ page, mount }) => {
  await mount(<CypherEditor />);
  const textField = page.getByRole('textbox');

  await textField.fill('RETU');

  await page.getByText('RETURN').click();
  await expect(textField).toHaveText('RETURN');
});

test('can complete CALL/CREATE', async ({ page, mount }) => {
  await mount(<CypherEditor />);
  const textField = page.getByRole('textbox');

  await textField.fill('C');
  await expect(page.getByText('CALL')).toBeVisible();
  await expect(page.getByText('CREATE')).toBeVisible();

  await textField.fill('CA');
  await expect(page.getByText('CALL')).toBeVisible();
  await expect(page.getByText('CREATE')).not.toBeVisible();

  // wait for the autocomplete interactivity
  await page.waitForTimeout(500);
  await textField.press('Enter');

  await expect(textField).toHaveText('CALL');
});

test('prompt shows up', async ({ mount, page }) => {
  const component = await mount(<CypherEditor prompt="neo4j>" />);

  await expect(component).toContainText('neo4j>');

  await component.update(<CypherEditor prompt="test>" />);
  await expect(component).toContainText('test>');

  const textField = page.getByRole('textbox');
  await textField.press('a');

  await expect(textField).toHaveText('a');
});
