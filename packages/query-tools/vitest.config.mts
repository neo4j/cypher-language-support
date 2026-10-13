import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/tests/unit/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: ['src/tests/integration/**/*.test.ts'],
          hookTimeout: 90000,
        },
      },
    ],
  },
});
