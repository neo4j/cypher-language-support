module.exports = {
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/typescript',
    // todo 'plugin:node/recommended',
  ],
  env: {
    browser: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./**/tsconfig.json', './**/tsconfig.node.json'],
  },
  settings: {
    'import/resolver': {
      // You will also need to install and configure the TypeScript resolver
      // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
      typescript: true,
      node: true,
    },
  },
  plugins: ['import'],
  rules: {
    '@typescript-eslint/consistent-type-exports': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    /*  TODO
    'import/extensions': [
      'error',
      'never',
      {
        ts: 'always',
        tsx: 'always',
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
      },
    ],
    */
  },
};
