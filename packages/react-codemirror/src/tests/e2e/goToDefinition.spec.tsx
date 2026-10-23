import { expect, test } from '@playwright/experimental-ct-react';
import type { Page } from 'playwright/test';
import { CypherEditor } from '../../CypherEditor';
import { CypherEditorPage } from './e2eUtils';

test.use({ viewport: { width: 1000, height: 500 } });

// Center and left edge of the character at the given line and column
async function charCoords(page: Page, line: number, column: number) {
  return page.evaluate(
    ([line, column]) => {
      const lineElement = document.querySelectorAll('.cm-line')[line];
      const walker = document.createTreeWalker(
        lineElement,
        NodeFilter.SHOW_TEXT,
      );
      let remaining = column;
      while (walker.nextNode()) {
        const text = walker.currentNode as Text;
        if (remaining < text.length) {
          const range = document.createRange();
          range.setStart(text, remaining);
          range.setEnd(text, remaining + 1);
          const rect = range.getBoundingClientRect();
          return {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
            left: rect.x,
          };
        }
        remaining -= text.length;
      }
      throw new Error(`No character at ${line}:${column}`);
    },
    [line, column],
  );
}

async function clickWith(
  page: Page,
  { x, y }: { x: number; y: number },
  modifier: string,
) {
  await page.keyboard.down(modifier);
  await page.mouse.click(x, y);
  await page.keyboard.up(modifier);
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
  const definition = await charCoords(page, 0, 7);

  // Symbol tables are computed asynchronously, so retry until they're ready
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
    await clickWith(page, reference, 'ControlOrMeta');
    await expectCaretAt(page, definition);
  }).toPass({ timeout: 20000 });
  await expect(hover).toBeHidden();
  // Well past the hover delay, it must not reopen without real mouse movement
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
