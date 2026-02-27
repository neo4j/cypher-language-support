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
    // Preserve original ESLint overrides
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/unbound-method': 'off',
  },
});
