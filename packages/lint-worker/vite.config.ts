import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// @ts-expect-error wrong config
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/webEntrypoint.ts'),
      name: 'lint-worker',
      fileName: 'lint-worker-web',
      formats: ['es'],
    },

    outDir: './dist/esm',
    commonjsOptions: {
      // ignore built-in modules in Node.js
      ignore: ['os', 'child_process', 'worker_threads'],
    },
  },
  base: './',
});
