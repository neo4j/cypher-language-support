// This script is run from package.json in the root of the project before
// dependencies are installed, it needs to be a node script to keep it OS
// agnostic.
const fs = require('node:fs/promises');
const path = require('node:path');

const WORKSPACE_DIRS = ['vendor', 'packages'];
const DIRS_TO_REMOVE = [
  'node_modules',
  'dist',
];

async function clean() {
  const promises = WORKSPACE_DIRS.map(async (workspaceDir) => {
    const files = await fs.readdir(path.join(__dirname, `../${workspaceDir}`), { withFileTypes: true });
    return files.filter((f) => f.isDirectory()).map((f) => path.join(__dirname, `../${workspaceDir}`, f.name));
  });

  const packages = (await Promise.all(promises)).flat();
  packages.push(path.join(__dirname, '../'));

  await Promise.all(
    packages.flatMap((packagePath) =>
      DIRS_TO_REMOVE.map((dir) => {
        return fs.rm(path.join(packagePath, dir), { recursive: true, force: true });
      }),
    ),
  );
}

clean()
  .then(() => console.log('Done'))
  .catch((err) => console.error(err));