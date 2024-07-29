import { runTests } from '@vscode/test-electron';
import * as path from 'path';
import { createAndStartTestContainer } from './setupTestContainer';

async function main() {
  const container = await createAndStartTestContainer();

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
      launchArgs: [path.join(__dirname, '../../tests/fixtures/')],
      extensionDevelopmentPath,
      extensionTestsPath,
    });
  } catch (err) {
    console.error('Failed to run integration tests');
    process.exit(1);
  } finally {
    await container.stop();
  }
}

void main();
