import react from '@vitejs/plugin-react';
import { defineConfig, type PluginOption } from 'vite';

import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      include: [{ file: '*/**/*.js' }, { file: '*/**/*.mjs' }],
      exclude: { file: '**/node_modules/**/*' },
    }) as PluginOption,
  ],
  base: './',
});
