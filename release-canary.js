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
    console.log(`Error while executing ${command}\n` + error);
    throw new Error();
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
    // logging the error
    console.error(error);
    throw new Error();
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
    npm run build
  `);
}

const langSupport = 'packages/language-support';
const reactCodemirror = 'packages/react-codemirror';
const langSupportVersion = getCanaryVersion(langSupport);
const reactCodemirrorVersion = getCanaryVersion(reactCodemirror);

updateVersion(langSupport, langSupportVersion);
replaceDependency(
  reactCodemirror,
  '@neo4j-cypher/language-support',
  langSupportVersion,
);
updateVersion(reactCodemirror, reactCodemirrorVersion);
buildProject();
publishCanaryVersion(langSupport);
publishCanaryVersion(reactCodemirror);
