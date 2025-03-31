import * as esbuild from 'esbuild';
import * as fs from 'fs/promises';

// Main server build, made executable by adding a shebang
await esbuild.build({
  entryPoints: ['./src/server.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: 'dist/cypher-language-server',
  minify: true,
  banner: {
    js: `#!/usr/bin/env node
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);`,
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  // External packages that should not be bundled
  external: [
    'node:*',
    'vscode-languageserver',
    'vscode-languageserver-textdocument',
    'workerpool',
    'neo4j-driver',
  ],
  // Ensure sourcemaps are included for debugging
  sourcemap: true,
});

// Worker build
await esbuild.build({
  entryPoints: ['./src/lintWorker.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: 'dist/lintWorker.js',
  minify: true,
  banner: {
    js: `import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);`,
  },
  external: ['node:*', 'workerpool'],
  sourcemap: true,
});

await fs.chmod('dist/cypher-language-server', 0o755);
