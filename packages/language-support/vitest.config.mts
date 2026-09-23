import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          // include: ['src/tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
          include: ['src/tests/**/*.test.ts'],
        },
      },
    ],
  },
});
