import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';

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

test('can configure readonly', async ({ mount, page }) => {
  const component = await mount(<CypherEditor readonly />);

  const textField = page.getByRole('textbox');
  await textField.press('a');
  await expect(textField).not.toHaveText('a');

  await component.update(<CypherEditor readonly={false} />);
  await textField.press('b');
  await expect(textField).toHaveText('b');
});

test('can set placeholder ', async ({ mount, page }) => {
  const component = await mount(<CypherEditor placeholder="bulbasaur" />);

  const textField = page.getByRole('textbox');
  await expect(textField).toHaveText('bulbasaur');

  await component.update(<CypherEditor placeholder="venusaur" />);
  await expect(textField).not.toHaveText('bulbasaur');
  await expect(textField).toHaveText('venusaur');

  await textField.fill('abc');
  await expect(textField).not.toHaveText('venusaur');
  await expect(textField).toHaveText('abc');
});

test('can set/unset onFocus/onBlur', async ({ mount, page }) => {
  const component = await mount(<CypherEditor />);

  let focusFireCount = 0;
  let blurFireCount = 0;

  const focus = () => {
    focusFireCount += 1;
  };
  const blur = () => {
    blurFireCount += 1;
  };

  await component.update(<CypherEditor domEventHandlers={{ blur, focus }} />);

  const textField = page.getByRole('textbox');
  await textField.click();
  await expect(textField).toBeFocused();

  // this is to give the events time to fire
  await expect(() => {
    expect(focusFireCount).toBe(1);
    expect(blurFireCount).toBe(0);
  }).toPass();

  await textField.blur();

  await expect(() => {
    expect(focusFireCount).toBe(1);
    expect(blurFireCount).toBe(1);
  }).toPass();

  await component.update(<CypherEditor />);
  await textField.click();
  await expect(textField).toBeFocused();
  await textField.blur();

  await expect(() => {
    expect(focusFireCount).toBe(1);
    expect(blurFireCount).toBe(1);
  }).toPass();
});

test('aria-label is not set by default', async ({ mount, page }) => {
  await mount(<CypherEditor />);

  const textField = page.getByRole('textbox');
  expect(await textField.getAttribute('aria-label')).toBeNull();
});

test('can set aria-label', async ({ mount, page }) => {
  const ariaLabel = 'Cypher Editor';

  await mount(<CypherEditor ariaLabel={ariaLabel} />);

  const textField = page.getByRole('textbox');
  expect(await textField.getAttribute('aria-label')).toEqual(ariaLabel);
});
