import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../CypherEditor';
import { CypherEditorPage } from './e2e-utils';

test.use({ viewport: { width: 500, height: 500 } });

test('can add extra keybinding statically', async ({ mount, page }) => {
  const editorPage = new CypherEditorPage(page);
  let hasRun = false;
  const component = await mount(
    <CypherEditor
      extraKeybindings={[
        {
          key: 'a',
          preventDefault: true,
          run: () => {
            hasRun = true;
            return true;
          },
        },
      ]}
    />,
  );

  await editorPage.getEditor().press('a');

  await expect(component).not.toHaveText('a');
  expect(hasRun).toBe(true);
});

test('can add extra keybinding dymanically', async ({ mount, page }) => {
  const editorPage = new CypherEditorPage(page);
  let hasRun = false;
  const component = await mount(<CypherEditor />);
  await editorPage.getEditor().press('a');
  await editorPage.getEditor().press('Escape');
  await expect(component).toContainText('a');

  await component.update(
    <CypherEditor
      extraKeybindings={[
        {
          key: 'a',
          preventDefault: true,
          run: () => {
            hasRun = true;
            return true;
          },
        },
      ]}
    />,
  );

  await editorPage.getEditor().press('a');
  await expect(component).not.toContainText('aa');
  expect(hasRun).toBe(true);
});
