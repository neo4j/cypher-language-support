import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'cypher-5',
      include: ['**/Cypher5/**/*test.ts'],
      globals: true,
    },
  },
  {
    test: {
      name: 'cypher-25',
      include: ['**/Cypher25/**/*test.ts'],
      globals: true,
    },
  },
  {
    test: {
      name: 'language-agnostic',
      include: ['src/tests/**/*test.ts'],
      globals: true,
    },
  },
]);
