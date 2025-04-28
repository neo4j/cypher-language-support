/** @type {import('tailwindcss').Config} */
export default {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access
  presets: [require('@neo4j-ndl/base').tailwindConfig],
  darkMode: 'class',
  content: ['index.html', './src/**/*.tsx'],
  theme: {
    extend: {},
  },
  plugins: [],
  prefix: '',
  corePlugins: {
    preflight: false,
  },
};
