/* Script to do all the heavy lifting of releasing canary packages on every merge to main for:

  - language-support
  - react-codemirror

On every merge to main we will release a new version x.y.z-canary-{git commit hash} of those packages.
*/
const semver = require('semver');
const fs = require('fs');
const childProcess = require('child_process');
const wd = process.cwd();
const gitRevision = childProcess
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim();

function exec(command) {
  try {
    console.log(`Executing: ${command}`);
    childProcess.execSync(command);
  } catch (error) {
    throw new Error(`Error while executing ${command}\n` + error);
  }
}

function getCanaryVersion(package) {
  const pkgVersion = semver.coerce(
    require(`${wd}/${package}/package.json`).version,
  );

  // If the version is 2.0.0-next.6, coerce it to 2.0.0
  const version = semver.coerce(pkgVersion).version;

  return version + '-canary-' + gitRevision;
}

function replaceDependency(package, dependency, newVersion) {
  console.log(
    `Updating dependency ${dependency} in ${package} to ${newVersion}\n`,
  );
  const jsonFile = `${wd}/${package}/package.json`;
  const packageJson = require(jsonFile);
  packageJson.dependencies[dependency] = newVersion;
  const data = JSON.stringify(packageJson, null, '  ');
  try {
    fs.writeFileSync(jsonFile, data);
  } catch (error) {
    throw new Error(
      `Error while updating dependency ${dependency} in ${package} to ${newVersion}\n` +
        error,
    );
  }
}

function updateVersion(package, version) {
  exec(`
    cd ${wd}/${package} &&
    npm version ${version}
  `);
}

function publishCanaryVersion(package) {
  exec(`
    cd ${wd}/${package} &&
    npm publish --tag canary
  `);
}

function buildProject() {
  console.log('Running npm install and re-building the packages\n');
  exec(`
    cd ${wd} &&
    npm i &&
    npm run build -- --filter=react-codemirror --filter=language-support
  `);
}

const langSupport = 'packages/language-support';
const reactCodemirror = 'packages/react-codemirror';
const reactCodemirrorPlayground = 'packages/react-codemirror-playground';
const langSupportVersion = getCanaryVersion(langSupport);
const reactCodemirrorVersion = getCanaryVersion(reactCodemirror);

updateVersion(langSupport, langSupportVersion);
/* We need to update the dependency on the language support for 
   react-codemirror to the newly released canary package,
   reading its package.json manually and replacing it

   We tried to do this using 

      npm i @neo4j-cypher/language-support@${langSupportVersion}
  
   but since npm seems eventually consistent, it wasn't setting the 
   version to the correct one.
*/
replaceDependency(
  reactCodemirror,
  '@neo4j-cypher/language-support',
  langSupportVersion,
);
replaceDependency(
  reactCodemirrorPlayground,
  '@neo4j-cypher/react-codemirror',
  reactCodemirrorVersion,
);
updateVersion(reactCodemirror, reactCodemirrorVersion);
// We need to rebuild everything with the newly generated versions
buildProject();
publishCanaryVersion(langSupport);
publishCanaryVersion(reactCodemirror);
