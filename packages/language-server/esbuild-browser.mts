import * as esbuild from 'esbuild';

const production = process.argv.includes('--production');

const ctx = await esbuild.context({
  entryPoints: ['src/browserServer.ts'],
  bundle: true,
  format: 'iife',
  minify: production,
  sourcemap: !production,
  sourcesContent: false,
  platform: 'browser',
  outfile: 'dist/browserServerMain.js',
  conditions: ['require'],
  logLevel: 'info',
});

if (production) {
  await ctx.rebuild();
  await ctx.dispose();
} else {
  await ctx.watch();
}
