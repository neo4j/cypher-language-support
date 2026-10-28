import { expect, test } from '@playwright/experimental-ct-react';
import type { Page } from 'playwright/test';
import { CypherEditor } from '../../CypherEditor';
import { charCoords, clickWith, CypherEditorPage } from './e2eUtils';

test.use({ viewport: { width: 1000, height: 500 } });

/** Wait for symbol table to appear, by waiting for hover info to appear at variable reference coordinates */
async function waitForSymbolTable(
  page: Page,
  variableCoordinates: { x: number; y: number },
) {
  await expect(async () => {
    await page.mouse.move(0, 0);
    await page.mouse.move(variableCoordinates.x, variableCoordinates.y);
    await expect(page.locator('.cm-hover-tooltip')).toBeVisible({
      timeout: 1000,
    });
  }).toPass({ timeout: 20000 });
}

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
  const definitionCoordinates = await charCoords(page, 0, 7);

  await expect(async () => {
    await editorPage.getEditor().press('F12');
    await expectCaretAt(page, definitionCoordinates);
  }).toPass({ timeout: 20000 });

  await editorPage.getEditor().press('x');
  await expect(page.locator('.cm-content')).toHaveText('MATCH (xn) RETURN n');
});

test('F12 on a non-variable does nothing', async ({ page, mount }) => {
  const editorPage = new CypherEditorPage(page);
  await mount(<CypherEditor value="MATCH (n) RETURN n" />);
  await editorPage.getEditor().focus();
  const referenceCoordinates = await charCoords(page, 0, 17);
  await waitForSymbolTable(page, referenceCoordinates);
  await editorPage.getEditor().press('Home');

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
  const referenceCoordinates = await charCoords(page, 0, 17);
  const definitionCoordinates = await charCoords(page, 0, 7);

  await expect(async () => {
    await clickWith(page, referenceCoordinates, 'ControlOrMeta');
    await expectCaretAt(page, definitionCoordinates);
  }).toPass({ timeout: 20000 });

  await editorPage.getEditor().press('x');
  await expect(page.locator('.cm-content')).toHaveText('MATCH (xn) RETURN n');
});

test('Mod-click hides the hover until the mouse moves again', async ({
  page,
  mount,
}) => {
  await mount(<CypherEditor value="MATCH (n) RETURN n" />);
  const referenceCoordinates = await charCoords(page, 0, 17);
  const definitionCoordinates = await charCoords(page, 0, 7);
  const hover = page.locator('.cm-hover-tooltip');

  await waitForSymbolTable(page, referenceCoordinates);

  await expect(async () => {
    await page.keyboard.down('ControlOrMeta');
    await page.mouse.down();
    await page.mouse.up();
    await page.keyboard.up('ControlOrMeta');
    await expectCaretAt(page, definitionCoordinates);
  }).toPass({ timeout: 20000 });
  await expect(hover).toBeHidden();
  // Wait past the hover delay, hover should not reopen without real mouse movement
  await page.waitForTimeout(1000);
  await expect(hover).toBeHidden();

  await page.mouse.move(referenceCoordinates.x - 1, referenceCoordinates.y);
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

test('Mod-press while hovering a variable reference underlines it with a pointer cursor', async ({
  page,
  mount,
}) => {
  const editorPage = new CypherEditorPage(page);
  await mount(<CypherEditor value="MATCH (n) RETURN n" />);
  // Key events only reach the editor while it has focus
  await editorPage.getEditor().focus();
  const referenceCoordinates = await charCoords(page, 0, 17);
  const clickableSymbol = page.locator('.cm-clickableSymbol');

  await waitForSymbolTable(page, referenceCoordinates);

  await page.keyboard.down('ControlOrMeta');
  await expect(clickableSymbol).toHaveText('n');
  const style = await clickableSymbol.evaluate((e) => {
    const computed = getComputedStyle(e);
    return { cursor: computed.cursor, decoration: computed.textDecorationLine };
  });
  expect(style).toEqual({ cursor: 'pointer', decoration: 'underline' });

  await page.keyboard.up('ControlOrMeta');
  await expect(clickableSymbol).toHaveCount(0);
});
