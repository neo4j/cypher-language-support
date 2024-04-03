import { defineConfig } from 'turbowatch';

export default defineConfig({
  project: __dirname,
  debounce: {
    wait: 1000,
  },
  triggers: [
    {
      expression: [
        'allof',
        ['not', ['dirname', 'node_modules']],
        ['not', ['dirname', '**/generated-parser']],
        ['anyof', ['dirname', 'packages/*/src'], ['dirname', 'vendor/*/src']],
        ['anyof', ['match', '*.ts', 'basename'], ['match', '*.g4', 'basename']],
      ],
      initialRun: true,
      interruptible: true,
      name: 'build',
      onChange: async ({ spawn }) => {
        await spawn`npm run build`;
      },
      retry: {
        retries: 0,
      },
    },
  ],
});
