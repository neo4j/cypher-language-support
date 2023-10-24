import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';
import { CypherEditorPage } from './e2e-utils';

test.use({ viewport: { width: 500, height: 500 } });

test('respects preloaded history', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);

  const initialValue = 'MATCH (n) RETURN n;';

  await mount(
    <CypherEditor
      value={initialValue}
      initialHistory={['first', 'second']}
      onExecute={() => {
        /* needed to turn on history movements */
      }}
    />,
  );

  await editorPage.getEditor().press('ArrowUp');
  await expect(page.getByText('first')).toBeVisible();

  // First arrow up is to get to start of line
  await editorPage.getEditor().press('ArrowUp');
  await editorPage.getEditor().press('ArrowUp');
  await expect(page.getByText('second')).toBeVisible();

  await editorPage.getEditor().press('ArrowDown');
  await expect(page.getByText('first')).toBeVisible();
  await editorPage.getEditor().press('ArrowDown');
  await expect(page.getByText(initialValue)).toBeVisible();
});

test('can execute queries and see them in history', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);

  const initialValue = `MATCH (n)
RETURN n;`;

  let exectutedQueries = 0;
  const onExecute = () => {
    exectutedQueries++;
  };

  await mount(<CypherEditor value={initialValue} onExecute={onExecute} />);

  // Execute initial query
  await editorPage.getEditor().press('Control+Enter');
  await editorPage.getEditor().press('Meta+Enter');
  expect(exectutedQueries).toBe(1);

  // Ensure query execution doesn't fire if the query is only whitespace
  await editorPage.getEditor().fill('     ');
  await editorPage.getEditor().press('Control+Enter');
  await editorPage.getEditor().press('Meta+Enter');
  expect(exectutedQueries).toBe(1);

  // Ensure only enter doesn't execute query
  await editorPage.getEditor().fill('multiline');
  await editorPage.getEditor().press('Enter');
  await editorPage.getEditor().press('Enter');
  await editorPage.getEditor().press('Enter');
  await editorPage.getEditor().press('Enter');
  await page.keyboard.type('entry');
  expect(exectutedQueries).toBe(1);
  await editorPage.getEditor().press('Control+Enter');
  await editorPage.getEditor().press('Meta+Enter');
  expect(exectutedQueries).toBe(2);

  // type a new query and make sure it's not lost when navigating history
  await editorPage.getEditor().fill('draft');
  await expect(page.getByText('draft')).toBeVisible();
  expect(exectutedQueries).toBe(2);

  // Navigate to the top of the editor before navigating history
  await editorPage.getEditor().press('ArrowLeft');
  await editorPage.getEditor().press('ArrowLeft');
  await editorPage.getEditor().press('ArrowLeft');
  await editorPage.getEditor().press('ArrowLeft');
  await editorPage.getEditor().press('ArrowLeft');
  await editorPage.getEditor().press('ArrowUp');

  // Ensure moving down in the editor doesn't navigate history
  await expect(page.getByText('multiline')).toBeVisible();

  // arrow movements don't matter until bottom is hit
  await editorPage.getEditor().press('ArrowUp');
  await editorPage.getEditor().press('ArrowUp');
  await editorPage.getEditor().press('ArrowDown');
  await editorPage.getEditor().press('ArrowDown');

  // editor still multiline
  await expect(page.getByText('multiline')).toBeVisible();

  // until you hit the end where have the draft we created earlier
  await editorPage.getEditor().press('ArrowDown');
  await expect(page.getByText('draft')).toBeVisible();
});

test('can navigate with cmd+up as well', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  const isMac = process.platform === 'darwin';
  const metaUp = isMac ? 'Meta+ArrowUp' : 'Control+ArrowUp';
  const metaDown = isMac ? 'Meta+ArrowDown' : 'Control+ArrowDown';

  const initialValue = 'MATCH (n) RETURN n;';

  await mount(
    <CypherEditor
      value={initialValue}
      initialHistory={[
        `one
multiline
entry
.`,
        'second',
      ]}
      onExecute={() => {
        /* needed to turn on history movements */
      }}
    />,
  );

  await editorPage.getEditor().press(metaUp);
  await expect(page.getByText('multiline')).toBeVisible();

  // Single meta up moves all the way to top of editor on mac
  if (isMac) {
    await editorPage.getEditor().press(metaUp);
  } else {
    await editorPage.getEditor().press('ArrowUp');
    await editorPage.getEditor().press('ArrowUp');
    await editorPage.getEditor().press('ArrowUp');
    await editorPage.getEditor().press('ArrowUp');
  }
  // move in history
  await editorPage.getEditor().press(metaUp);
  await expect(page.getByText('second')).toBeVisible();

  await editorPage.getEditor().press(metaDown);
  await expect(page.getByText('multiline')).toBeVisible();
});
