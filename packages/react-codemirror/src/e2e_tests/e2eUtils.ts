import { expect } from '@playwright/experimental-ct-react';
import type { Locator, Page } from 'playwright/test';

export class CypherEditorPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

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
    await expect(this.page.locator('.cm-lintRange-' + type).last()).toBeVisible(
      { timeout: 2000 },
    );

    await this.page.getByText(queryChunk, { exact: true }).hover();
    await expect(this.page.locator('.cm-tooltip-hover').last()).toBeVisible();
    await expect(this.page.getByText(expectedMsg)).toBeVisible();
  }
}
