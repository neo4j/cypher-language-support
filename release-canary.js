const semver = require('semver');
const childProcess = require('child_process');
const wd = process.cwd();

function exec(command) {
  try {
    console.log(`Executing: ${command}`);
    childProcess.execSync(command);
  } catch (e) {
    console.log(`Error while executing ${command}\n` + e);
  }
}
const gitRevision = childProcess
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim();

function getCanaryVersion(package) {
  const pkgVersion = semver.coerce(
    require(`${wd}/${package}/package.json`).version,
  );

  // If the version is 2.0.0-next.6, coerce it to 2.0.0
  const version = semver.coerce(pkgVersion).version;

  return version + '-canary-' + gitRevision;
}

const langSupport = 'packages/language-support';
const reactCodemirror = 'packages/react-codemirror';

const langSupportVersion = getCanaryVersion(langSupport);
const reactCodemirrorVersion = getCanaryVersion(reactCodemirror);

exec(`
  cd ${wd}/${langSupport} && 
  npm version ${langSupportVersion} &&
  npm publish --tag canary
`);

exec(`
  cd ${wd}/${reactCodemirror} && 
  npm version ${reactCodemirrorVersion} && 
  npm i @neo4j-cypher/language-support@${langSupportVersion} &&
  npm publish --tag canary
`);
