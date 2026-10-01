import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/language-support',
      'packages/language-server',
      'packages/lint-worker',
      'packages/react-codemirror',
      'packages/query-tools',
    ],
  },
});
