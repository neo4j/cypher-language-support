import { runTests } from '@vscode/test-electron';
import * as path from 'path';
import { createAndStartTestContainer } from './setupTestContainer';

async function main() {
  const [neo4j5Instance, neo4j2025Instance] = await Promise.all([
    createAndStartTestContainer({
      containerName: 'vscode-it-neo4j-5',
      neo4jVersion: 'neo4j:5.20-enterprise',
    }),
    createAndStartTestContainer({
      containerName: 'vscode-it-neo4j-2025',
      neo4jVersion: 'neo4j:2025-enterprise',
    }),
  ]);

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
      extensionTestsEnv: {
        CYPHER_25: 'true',
        NEO4J_5_PORT: neo4j5Instance.getMappedPort(7687).toString(),
        NEO4J_2025_PORT: neo4j2025Instance.getMappedPort(7687).toString(),
        DEBUG_VSCODE_TESTS: process.env.DEBUG_VSCODE_TESTS,
      },
    });
  } catch (err) {
    console.error('Failed to run integration tests');
    process.exit(1);
  } finally {
    await Promise.all([neo4j5Instance.stop(), neo4j2025Instance.stop()]);
  }
}

void main();
