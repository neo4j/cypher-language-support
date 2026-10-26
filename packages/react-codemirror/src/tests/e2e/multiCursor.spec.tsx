import { expect, test } from '@playwright/experimental-ct-react';
import { CypherEditor } from '../../CypherEditor.js';
import { charCoords, clickWith, CypherEditorPage } from './e2eUtils';

test('Alt-click adds a cursor', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  await mount(<CypherEditor value="MATCH (n) RETURN n" />);
  await editorPage.getEditor().focus();
  await editorPage.getEditor().press('End');

  const { x, y } = await charCoords(page, 0, 0);
  await clickWith(page, { x: x - 2, y }, 'Alt');

  await editorPage.getEditor().press('x');
  await expect(page.locator('.cm-content')).toHaveText('xMATCH (n) RETURN nx');
});

test('Shift-Alt-drag makes a rectangular selection', async ({
  page,
  mount,
}) => {
  const editorPage = new CypherEditorPage(page);
  await mount(<CypherEditor value={'RETURN 1\nRETURN 2\nRETURN 3'} />);

  const start = await charCoords(page, 0, 0);
  const end = await charCoords(page, 2, 0);
  await page.keyboard.down('Shift');
  await page.keyboard.down('Alt');
  await page.mouse.move(start.x - 2, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x - 2, end.y, { steps: 5 });
  await page.mouse.up();
  await page.keyboard.up('Alt');
  await page.keyboard.up('Shift');

  await editorPage.getEditor().press('x');
  await expect(page.locator('.cm-line')).toHaveText([
    'xRETURN 1',
    'xRETURN 2',
    'xRETURN 3',
  ]);
});

test('Shift-Alt shows a crosshair cursor, Alt alone does not', async ({
  page,
  mount,
}) => {
  await mount(<CypherEditor value="RETURN 1" />);
  const content = page.locator('.cm-content');
  const { x, y } = await charCoords(page, 0, 2);
  const cursorStyle = () => content.evaluate((e) => getComputedStyle(e).cursor);

  await page.keyboard.down('Alt');
  await page.mouse.move(x, y);
  expect(await cursorStyle()).not.toBe('crosshair');

  await page.keyboard.down('Shift');
  await page.mouse.move(x + 1, y);
  await expect.poll(cursorStyle).toBe('crosshair');

  await page.keyboard.up('Shift');
  await page.keyboard.up('Alt');
  await page.mouse.move(x + 2, y);
  await expect.poll(cursorStyle).not.toBe('crosshair');
});
