import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    hookTimeout: 90000,
    dir: fileURLToPath(new URL('./src', import.meta.url)),
  },
});
