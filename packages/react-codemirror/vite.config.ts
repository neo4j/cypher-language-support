/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // todo investigate if common js is back on the menu
  build: { lib: { entry: 'src/index.ts', formats: ['es'] } },
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/e2e_tests/**',
    ],
    // Fix for error in pipeline, see https://github.com/vitest-dev/vitest/discussions/6131
    minWorkers: 1,
    maxWorkers: 1,
  },
});
