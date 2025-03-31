import * as esbuild from 'esbuild';
import * as fs from 'fs/promises';

// Main server build
await esbuild.build({
  entryPoints: ['./src/server.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: 'dist/cypher-language-server.js',
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

// Create executable server file
await fs.chmod('dist/cypher-language-server.js', 0o755);

// Create a launcher script
await fs.writeFile(
  'dist/cypher-language-server',
  `#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Import the server module
import('./cypher-language-server.js').catch(err => {
  console.error('Failed to start language server:', err);
  process.exit(1);
});
`,
);

await fs.chmod('dist/cypher-language-server', 0o755);

console.log('Build complete!');
