import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const baseURL = `http://localhost:${PORT}`;

/**
 * Smoke tests for the production bundle that gets deployed to GitHub Pages.
 * Everything else in the repo tests a vite dev server, which does not
 * tree-shake and keeps each dependency in its own module, so bundler-only
 * breakage (e.g. mis-ordered CJS side effects) never shows up there.
 */
export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: { baseURL, trace: 'on-first-retry' },
  webServer: {
    command: `pnpm preview --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
