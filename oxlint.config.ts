import { defineConfig } from 'oxlint';

export default defineConfig({
  ignorePatterns: [
    'semanticAnalysis.js',
    'vendor/**',
    'packages/vscode-extension/tests/fixtures/textmate/simple-match.js',
    'packages/react-codemirror/playwright/index.tsx',
  ],
  plugins: ['typescript'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    // These rules produce systematic false positives because neo4j-driver
    // types use `any` internally, causing cascading type issues in unions.
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/no-duplicate-type-constituents': 'off',
    '@typescript-eslint/no-misused-spread': 'off',
  },
});
