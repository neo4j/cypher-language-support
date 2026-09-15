import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

const controllers: esbuild.BuildOptions = {
  entryPoints: [
    'src/webviews/controllers/connectionPanelController.ts',
    'src/webviews/controllers/queryDetails.tsx',
    'src/webviews/controllers/queryVisualization.tsx',
  ],
  bundle: true,
  outdir: 'dist/webviews',
  platform: 'browser',
  logLevel: 'info',
};

const ndlStyles: esbuild.BuildOptions = {
  entryPoints: ['src/ndl.ts'],
  bundle: true,
  outdir: 'dist/webviews',
  platform: 'browser',
  logLevel: 'info',
  loader: { '.woff2': 'dataurl' },
};

if (watch) {
  const [controllersCtx, ndlStylesCtx] = await Promise.all([
    esbuild.context(controllers),
    esbuild.context(ndlStyles),
  ]);
  await Promise.all([controllersCtx.watch(), ndlStylesCtx.watch()]);
} else {
  await Promise.all([esbuild.build(controllers), esbuild.build(ndlStyles)]);
}
