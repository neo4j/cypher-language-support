import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  // antlr4 build reference some node features that are not available in the browser
  plugins: [react(), nodePolyfills()],
  build: { minify: false },
});
