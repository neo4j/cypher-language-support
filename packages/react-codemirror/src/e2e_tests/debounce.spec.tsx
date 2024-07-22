import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';
import { CypherEditorPage } from './e2eUtils';

const DEBOUNCE_TIMER = 200;

test('external updates should override debounced updates', async ({
  mount,
  page,
}) => {
  const editorPage = new CypherEditorPage(page);
  let value = '';

  const onChange = (val: string) => {
    value = val;
    void component.update(<CypherEditor value={val} onChange={onChange} />);
  };

  const component = await mount(
    <CypherEditor value={value} onChange={onChange} />,
  );

  await editorPage.getEditor().pressSequentially('RETURN 1');
  onChange('foo');
  await page.waitForTimeout(DEBOUNCE_TIMER);
  await expect(component).toContainText('foo');
});

test('onExecute updates should override debounce updates', async ({
  mount,
  page,
}) => {
  const editorPage = new CypherEditorPage(page);
  let value = '';

  const onExecute = () => {
    value = '';
    void component.update(
      <CypherEditor value={value} onChange={onChange} onExecute={onExecute} />,
    );
  };

  const onChange = (val: string) => {
    value = val;
    void component.update(
      <CypherEditor value={val} onChange={onChange} onExecute={onExecute} />,
    );
  };

  const component = await mount(
    <CypherEditor value={value} onChange={onChange} onExecute={onExecute} />,
  );

  await editorPage.getEditor().pressSequentially('RETURN 1');
  await editorPage.getEditor().press('Control+Enter');
  await page.waitForTimeout(DEBOUNCE_TIMER);
  await expect(component).not.toContainText('RETURN 1');

  await editorPage.getEditor().pressSequentially('RETURN 1');
  await editorPage.getEditor().pressSequentially('');
  await editorPage.getEditor().pressSequentially('RETURN 1');
  await editorPage.getEditor().press('Control+Enter');
  await page.waitForTimeout(DEBOUNCE_TIMER);
  await expect(component).not.toContainText('RETURN 1');
});

test('onExecute should fire after debounced updates', async ({
  mount,
  page,
}) => {
  const editorPage = new CypherEditorPage(page);
  let value = '';
  let executedCommand = '';

  const onExecute = (cmd: string) => {
    executedCommand = cmd;
    void component.update(
      <CypherEditor value={value} onChange={onChange} onExecute={onExecute} />,
    );
  };

  const onChange = (val: string) => {
    value = val;
    void component.update(
      <CypherEditor value={val} onChange={onChange} onExecute={onExecute} />,
    );
  };

  const component = await mount(
    <CypherEditor value={value} onChange={onChange} onExecute={onExecute} />,
  );

  await editorPage.getEditor().fill('RETURN 1');
  await editorPage.getEditor().press('Control+Enter');
  await editorPage.getEditor().fill('RETURN 2');
  await editorPage.getEditor().press('Control+Enter');
  await page.waitForTimeout(DEBOUNCE_TIMER);
  await expect(component).toContainText('RETURN 2');
  expect(executedCommand).toBe('RETURN 2');
});
