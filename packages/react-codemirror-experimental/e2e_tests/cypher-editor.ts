import { expect, Locator, type Page } from '@playwright/test';

import type { CypherEditorProps } from '../src/CypherEditor.js';

/**
 * Testing just react components in playwright is still in experimental mode
 * currently it requires a react app. This is a workaround to be able to
 * control the editor props directly
 */
declare global {
  interface Window {
    renderCodemirror: (props: CypherEditorProps) => void;
  }
}
export class CypherEditorPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  createEditor = async (props: CypherEditorProps) => {
    await this.page.evaluate((p) => {
      window.renderCodemirror(p as unknown);
    }, props);
  };

  getEditor() {
    return this.page.getByRole('textbox');
  }

  async focusEditor() {
    await this.getEditor().focus();
  }

  editorBackgroundIsUnset() {
    return this.page.locator('.cm-editor').evaluate((e: Element) => {
      const browserDefaultBackgroundColor = 'rgba(0, 0, 0, 0)';
      return (
        window.getComputedStyle(e).getPropertyValue('background-color') ===
        browserDefaultBackgroundColor
      );
    });
  }

  getHexColorOfLocator(locator: Locator) {
    return locator.evaluate((e: Element) => {
      // https://stackoverflow.com/questions/49974145/how-to-convert-rgba-to-hex-color-code-using-javascript
      function RGBAToHexA(rgba: string, forceRemoveAlpha = false) {
        return (
          '#' +
          rgba
            .replace(/^rgba?\(|\s+|\)$/g, '')
            .split(',')
            .filter((string, index) => !forceRemoveAlpha || index !== 3)
            .map((string) => parseFloat(string))
            .map((number, index) =>
              index === 3 ? Math.round(number * 255) : number,
            )
            .map((number) => number.toString(16))
            .map((string) => (string.length === 1 ? '0' + string : string))
            .join('')
        );
      }

      const color = window.getComputedStyle(e).getPropertyValue('color');
      return RGBAToHexA(color);
    });
  }

  async checkErrorMessage(queryChunk: string, expectedMsg: string) {
    return this.checkNotificationMessage('error', queryChunk, expectedMsg);
  }

  async checkWarningMessage(queryChunk: string, expectedMsg: string) {
    return this.checkNotificationMessage('warning', queryChunk, expectedMsg);
  }

  private async checkNotificationMessage(
    type: 'error' | 'warning',
    queryChunk: string,
    expectedMsg: string,
  ) {
    const locator = this.page.getByText(queryChunk, { exact: true });
    await expect(this.page.locator('.cm-lintRange-' + type).last()).toBeVisible(
      {
        timeout: 2000,
      },
    );

    await locator.hover();
    const hoverMessage = this.page.locator('.cm-tooltip-hover');
    await expect(hoverMessage).toBeVisible();
    await expect(hoverMessage.getByText(expectedMsg)).toBeVisible();
  }
}
