import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    globals: true,

    projects: [
      {
        test: {
          name: 'unit',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/tests/e2e/**'],
        },
      },
    ],
  },
});
