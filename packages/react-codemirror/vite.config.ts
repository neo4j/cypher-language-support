import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // todo investigate if common js is back on the menu
  build: { lib: { entry: 'src/index.ts', formats: ['es'] } },
});
