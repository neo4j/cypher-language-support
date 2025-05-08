import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// @ts-expect-error wrong ts config
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/webEntrypoint.ts'),
      name: 'lint-worker',
      fileName: 'lint-worker-node',
      formats: ['cjs'],
    },

    outDir: './dist/cjs',
    
  },
  base: './',
});
