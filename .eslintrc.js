module.exports = {
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  env: {
    browser: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./**/tsconfig.json', './**/tsconfig.node.json'],
  },
  rules: {
    '@typescript-eslint/consistent-type-exports': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
