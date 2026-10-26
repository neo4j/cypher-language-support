import { expect, test } from '@playwright/experimental-ct-react';
import type { Page } from 'playwright/test';
import { CypherEditor } from '../../CypherEditor';
import { charCoords, clickWith, CypherEditorPage } from './e2eUtils';

test.use({ viewport: { width: 1000, height: 500 } });

// Fails unless the drawn caret sits at the start of the given character
async function expectCaretAt(page: Page, char: { left: number }) {
  const caret = await page.locator('.cm-cursor-primary').boundingBox();
  expect(Math.abs((caret?.x ?? -100) - char.left)).toBeLessThan(2);
}

test('F12 moves the caret to the start of the definition', async ({
  page,
  mount,
}) => {
  const editorPage = new CypherEditorPage(page);
  await mount(<CypherEditor value="MATCH (n) RETURN n" />);
  await editorPage.getEditor().focus();
  await editorPage.getEditor().press('End');
  const definition = await charCoords(page, 0, 7);

  await expect(async () => {
    await editorPage.getEditor().press('F12');
    await expectCaretAt(page, definition);
  }).toPass({ timeout: 20000 });

  await editorPage.getEditor().press('x');
  await expect(page.locator('.cm-content')).toHaveText('MATCH (xn) RETURN n');
});

test('F12 on a non-variable does nothing', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  await mount(<CypherEditor value="MATCH (n) RETURN n" />);
  await editorPage.getEditor().focus();
  await editorPage.getEditor().press('Home');
  // Give the symbol tables time to arrive
  await page.waitForTimeout(3000);

  await editorPage.getEditor().press('F12');
  await editorPage.getEditor().press('x');
  await expect(page.locator('.cm-content')).toHaveText('xMATCH (n) RETURN n');
});

test('Mod-click on a variable jumps to its definition', async ({
  page,
  mount,
}) => {
  const editorPage = new CypherEditorPage(page);
  await mount(<CypherEditor value="MATCH (n) RETURN n" />);
  const reference = await charCoords(page, 0, 17);
  const definition = await charCoords(page, 0, 7);

  await expect(async () => {
    await clickWith(page, reference, 'ControlOrMeta');
    await expectCaretAt(page, definition);
  }).toPass({ timeout: 20000 });

  await editorPage.getEditor().press('x');
  await expect(page.locator('.cm-content')).toHaveText('MATCH (xn) RETURN n');
});

test('Mod-click hides the hover until the mouse moves again', async ({
  page,
  mount,
}) => {
  await mount(<CypherEditor value="MATCH (n) RETURN n" />);
  const reference = await charCoords(page, 0, 17);
  const definition = await charCoords(page, 0, 7);
  const hover = page.locator('.cm-hover-tooltip');

  // Variable hovers need the symbol tables, and the hover is only requested
  // once per mouse position, so re-hover until they've arrived
  await expect(async () => {
    await page.mouse.move(0, 0);
    await page.mouse.move(reference.x, reference.y);
    await expect(hover).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 20000 });

  await expect(async () => {
    await page.keyboard.down('ControlOrMeta');
    await page.mouse.down();
    await page.mouse.up();
    await page.keyboard.up('ControlOrMeta');
    await expectCaretAt(page, definition);
  }).toPass({ timeout: 20000 });
  await expect(hover).toBeHidden();
  // Wait past the hover delay, hover should not reopen without real mouse movement
  await page.waitForTimeout(1000);
  await expect(hover).toBeHidden();

  await page.mouse.move(reference.x - 1, reference.y);
  await expect(hover).toBeVisible({ timeout: 10000 });
});

test('Mod-click on a non-variable does nothing', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  await mount(<CypherEditor value="MATCH (n) RETURN n" />);
  await editorPage.getEditor().focus();
  await editorPage.getEditor().press('End');
  await page.waitForTimeout(3000);

  await clickWith(page, await charCoords(page, 0, 2), 'ControlOrMeta');

  await editorPage.getEditor().press('x');
  await expect(page.locator('.cm-content')).toHaveText('MATCH (n) RETURN nx');
});
