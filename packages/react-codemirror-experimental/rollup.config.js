import typescript from 'rollup-plugin-ts';

import alias from '@rollup/plugin-alias';
import { resolve } from 'path';
import pkg from './package.json';

const depsToBundle = ['language-support', 'antlr4-c3'];
const dependenciesNotToBundle = Object.keys({
  ...pkg.dependencies,
  ...pkg.peerDependencies,
})
  .concat(['react/jsx-runtime'])
  .filter((n) => !depsToBundle.includes(n));
const aliases = [
  {
    find: 'language-support',
    replacement: resolve(__dirname, '../language-support/src/index.ts'),
  },
  {
    find: 'antlr4-c3',
    replacement: resolve(__dirname, '../antlr4-c3/index.ts'),
  },
  {
    find: 'antlr4',
    replacement: resolve(__dirname, '../antlr4/dist/antlr4.web.mjs'),
  },
  {
    find: '@neo4j-cypher/react-codemirror-experimental',
    replacement: resolve(
      __dirname,
      '../react-codemirror-experimental/src/index.ts',
    ),
  },
];

export default {
  input: 'src/index.ts',
  external: (id) => dependenciesNotToBundle.includes(id),
  output: [
    { file: 'out/index.cjs', format: 'cjs' },
    { dir: './out', format: 'es' },
  ],
  plugins: [typescript(), alias({ entries: aliases })],
};
