import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './tests/web/globalSetup.ts',
  globalTeardown: './tests/web/globalTeardown.ts',
  testDir: './tests/web',
  testMatch: '**/*.web.spec.ts',
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Web extension tests must be serial (single VS Code instance)
  use: {
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10_000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report-web', open: 'never' }],
  ],
});
