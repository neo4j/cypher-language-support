import { Neo4jContainer } from '@testcontainers/neo4j';
import { runTests } from '@vscode/test-electron';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

function setSetting(file: string, variable: RegExp, value: string) {
  const data = fs.readFileSync(file).toString();
  const result = data.replace(variable, value);
  fs.writeFileSync(file, result);
}

function updateDotenvFile(port: number, password: string) {
  const dotenvPath = path.join(__dirname, '../../e2e_tests/fixtures/');
  const dotenvTemplate = path.join(dotenvPath, '.env');
  const dotenvFile = path.join(dotenvPath, '.env.test');
  fs.copyFileSync(dotenvTemplate, dotenvFile);
  setSetting(dotenvFile, /\{PORT\}/g, port.toString());
  setSetting(dotenvFile, /\{PASSWORD\}/g, password);
  dotenv.config({ path: dotenvFile });
}

async function main() {
  const password = 'password';

  const container = await new Neo4jContainer('neo4j:5')
    .withExposedPorts(7474, 7687)
    .withApoc()
    .withPassword(password)
    // Giving it a name prevents us from spinning up a different
    // container every time we run the tests and allows us
    // closing a lingering one when the tests finish
    .withName('vscode-integration-tests')
    .start();

  const port = container.getMappedPort(7687);
  // This sets up a settings.json file based on the settings-template.json
  // replacing the random port and password we have given the container
  updateDotenvFile(port, password);

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
