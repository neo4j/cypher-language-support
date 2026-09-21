import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    globals: true,

    projects: [
      {
        test: {
          name: 'unit',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/tests/e2e/**'],
        },
      },
      // {
      //   test: {
      //     name: 'e2e',
      //     include: ['src/tests/e2e/**/*.test.{ts,tsx}'],
      //     //   exclude: [
      //     //     ...configDefaults.exclude,
      //     //     '**/.{idea,cache,output,temp}/**',
      //     //     '**/dist/**',
      //     //     '**/e2e_tests/**',
      //     //   ],
      //     // Fix for error in pipeline, see https://github.com/vitest-dev/vitest/discussions/6131
      //     maxWorkers: 1,
      //   },
      // },
    ],
  },
});
