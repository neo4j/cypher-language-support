/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

export default defineConfig({
  test: { exclude: ['e2e_tests'] },
  // antlr4 build reference some node features that are not available in the browser
  plugins: [react(), nodePolyfills()],
  server: { port: 3000 },
  resolve: {
    // vite wants to build the language-support package itself
    alias: [
      {
        find: 'language-support',
        replacement: resolve(__dirname, '../language-support/src/index.ts'),
      },
      {
        find: 'antlr4-c3',
        replacement: resolve(__dirname, '../antlr4-c3/index.ts'),
      },
      {
        find: '@neo4j-cypher/react-codemirror-experimental',
        replacement: resolve(
          __dirname,
          '../react-codemirror-experimental/src/index.ts',
        ),
      },
    ],
  },
});
