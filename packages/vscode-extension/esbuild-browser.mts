import * as esbuild from 'esbuild';

const production = process.argv.includes('--production');

const ctx = await esbuild.context({
  entryPoints: ['src/browserExtension.ts'],
  bundle: true,
  format: 'cjs',
  minify: production,
  sourcemap: !production,
  sourcesContent: false,
  platform: 'browser',
  outfile: 'dist/browserExtension.js',
  external: ['vscode'],
  logLevel: 'info',
});

if (production) {
  await ctx.rebuild();
  await ctx.dispose();
} else {
  await ctx.watch();
}
