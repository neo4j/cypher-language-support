import { Neo4jContainer } from '@testcontainers/neo4j';
import { runTests } from '@vscode/test-electron';
import * as fs from 'fs';
import * as path from 'path';

function setSetting(file: string, variable: RegExp, value: string) {
  const data = fs.readFileSync(file).toString();
  const result = data.replace(variable, value);
  fs.writeFileSync(file, result);
}

function updateSettingsFile(port: number, password: string) {
  const settingsPath = path.join(
    __dirname,
    '../../e2e_tests/fixtures/.vscode/',
  );
  const settingsTemplate = path.join(settingsPath, 'settings-template.json');
  const settingsFile = path.join(settingsPath, 'settings.json');
  fs.copyFileSync(settingsTemplate, settingsFile);
  setSetting(settingsFile, /\{PORT\}/g, port.toString());
  setSetting(settingsFile, /\{PASSWORD\}/g, password);
}

async function main() {
  const password = 'password';

  // TODO Nacho Give this container a name and see whether we can clean it up
  // just in case we leave it open
  const container = await new Neo4jContainer('neo4j:5')
    .withExposedPorts(7474, 7687)
    .withApoc()
    .withPassword(password)
    .start();

  const port = container.getMappedPort(7687);
  // This sets up a settings.json file based on the settings-template.json
  // replacing the random port and password we have given the container
  updateSettingsFile(port, password);

  try {
    /* This is equivalent to running from a command line: 

       code \
        --extensionDevelopmentPath=<EXTENSION-ROOT-PATH> \
        --extensionTestsPath=<TEST-RUNNER-SCRIPT-PATH>

      The architecture of these e2e tests is slightly different than
      the ones from the codemirror project. Here we need to provide
      VSCode (via code in the terminal) a test file to execute, we 
      cannot just open a VSCode and then type in it and fetch the 
      results like in codemirror
    */
    const extensionDevelopmentPath = path.resolve(__dirname, '../..');
    const extensionTestsPath = path.resolve(__dirname, './testRunner');

    // Bootstraps VS Code and executes the integration tests
    await runTests({
      launchArgs: [path.join(__dirname, '../../e2e_tests/fixtures/')],
      extensionDevelopmentPath,
      extensionTestsPath,
    });
  } catch (err) {
    console.error('Failed to run integration tests');
    process.exit(1);
  }

  await container.stop();
}

void main();
