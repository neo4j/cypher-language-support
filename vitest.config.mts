import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/language-support',
      'packages/lint-worker',
      'packages/react-codemirror',
      'packages/query-tools',
    ],
  },
});
