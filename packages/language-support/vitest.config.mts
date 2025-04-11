import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@vendor/antlr4-c3': path.resolve(
        __dirname,
        '../../vendor/antlr4-c3/dist/esm',
      ),
    },
  },
});
