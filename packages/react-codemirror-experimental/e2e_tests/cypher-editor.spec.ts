import { expect, test } from '@playwright/test';
import type { CypherEditorProps } from '../src/CypherEditor';

declare global {
  interface Window {
    renderCodemirror: (props: CypherEditorProps) => void;
  }
}

test('has title', async ({ page }) => {
  await page.goto('localhost:5173');
  await page.evaluate(() => window.renderCodemirror({ value: 'test' }));
  await expect(page.getByText('test')).toBeVisible();
});
