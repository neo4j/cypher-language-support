import nkzw from '@nkzw/oxlint-config';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [nkzw],
  ignorePatterns: [
    'semanticAnalysis.js',
    'vendor/**',
    'packages/vscode-extension/tests/fixtures/textmate/simple-match.js',
    'packages/react-codemirror/playwright/index.tsx',
  ],
  rules: {
    // Preserve current custom rules (upgraded from warn to error per @nkzw philosophy)
    'no-console': ['error', { allow: ['warn', 'error'] }],

    // ── Rules below are disabled because they go beyond the original ESLint
    //    setup and would require codebase changes (conservative migration) ──

    // unused-imports: crashes on TSMappedType due to @typescript-eslint compat
    // issue in oxlint's JS plugin runner; not in original config anyway
    'unused-imports/no-unused-imports': 'off',

    // perfectionist: sorting rules not in original config
    'perfectionist/sort-enums': 'off',
    'perfectionist/sort-interfaces': 'off',
    'perfectionist/sort-jsx-props': 'off',
    'perfectionist/sort-object-types': 'off',
    'perfectionist/sort-objects': 'off',

    // @nkzw-specific rules not in original config
    '@nkzw/no-instanceof': 'off',

    // import plugin rules not in original config
    'import-x/export': 'off',
    'import-x/no-namespace': 'off',

    // unicorn rules not in original config
    'unicorn/catch-error-name': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-abusive-eslint-disable': 'off',
    'unicorn/no-typeof-undefined': 'off',
    'unicorn/no-unnecessary-slice-end': 'off',
    'unicorn/no-useless-promise-resolve-reject': 'off',
    'unicorn/numeric-separators-style': 'off',
    'unicorn/prefer-array-some': 'off',
    'unicorn/prefer-at': 'off',
    'unicorn/prefer-dom-node-append': 'off',
    'unicorn/prefer-native-coercion-functions': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/prefer-number-properties': 'off',
    'unicorn/prefer-optional-catch-binding': 'off',
    'unicorn/prefer-string-raw': 'off',
    'unicorn/prefer-string-replace-all': 'off',
    'unicorn/prefer-string-slice': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/text-encoding-identifier-case': 'off',

    // react / react-hooks rules not in original config
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'off',
    'react-hooks-js/immutability': 'off',
    'react-hooks-js/set-state-in-effect': 'off',

    // Base ESLint rules enabled by @nkzw but not in eslint:recommended or
    // overridden to off by @typescript-eslint/recommended in original setup
    curly: 'off',
    'no-array-constructor': 'off',
    'no-undef': 'off',
    'no-unused-expressions': 'off',

    // @typescript-eslint rules configured differently from original:
    //   - array-type: original used T[] style (eslint recommended default),
    //     @nkzw switches to Array<T> style — disable to avoid mass changes
    //   - no-require-imports: original disabled no-var-requires (predecessor),
    //     intent was to allow require() in plain JS files like genTextMate.js
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/no-require-imports': 'off',
  },
});
