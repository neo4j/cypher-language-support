import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
});
