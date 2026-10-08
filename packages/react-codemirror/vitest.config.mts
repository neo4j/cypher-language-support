import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    globals: true,

    projects: [
      {
        test: {
          name: 'unit',
           include: ['src/tests/unit/**/*.test.{ts,tsx}'],
        },
      },
    ],
  },
});
