import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/tests/**',
        'src/generated-parser/**',
        'src/grass/generated-parser/**',
        'src/**/__fixtures__/**',
      ],
      all: true,
    },
  },
});
