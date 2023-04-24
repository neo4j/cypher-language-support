import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  resolve: {
    alias: {
      'language-support': 'language-support/src/index.ts',
    },
  },
});
