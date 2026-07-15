import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    dir: fileURLToPath(new URL('./src/tests', import.meta.url)),
  },
});
