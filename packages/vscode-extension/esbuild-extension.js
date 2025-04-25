const esbuild = require('esbuild');
const production = process.argv.includes('--production');

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: 'node',
    outfile: 'dist/extension.js',
    external: ['vscode'],
    logLevel: 'silent',
    conditions: ['require'],
  });
  // exited
  await ctx.watch();
  // await ctx.rebuild();
  await ctx.dispose();
}
// yeah it's not watching.

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
