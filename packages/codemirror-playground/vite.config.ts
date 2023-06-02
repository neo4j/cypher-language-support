import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

export default defineConfig({
  // antlr4 build reference some node features that are not available in the browser
  plugins: [react(), nodePolyfills()],
  resolve: {
    alias: {
      // vite wants to build the language-support package itself
      'language-support': 'language-support/src/index.ts',
      'antlr4-c3': 'antlr4-c3/index.ts',
      'react-codemirror-experimental':
        'react-codemirror-experimental/src/index.ts',
    },
  },
});
