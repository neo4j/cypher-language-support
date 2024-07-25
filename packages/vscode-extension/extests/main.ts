import * as path from 'path';
import { ExTester } from 'vscode-extension-tester';

async function main() {
  try {
    const exTester = new ExTester();
    const testsPath = path.join(__dirname, '**/**.e2e.js');

    // Bootstraps VS Code and executes the integration tests
    await exTester.downloadChromeDriver();
    await exTester.downloadCode();
    await exTester.installVsix({
      vsixFile: `${__dirname}/../../neo4j-for-vscode-1.2.6.vsix`,
      installDependencies: true,
      useYarn: false,
    });
    await exTester.runTests(testsPath, {
      config: `${__dirname}/config.js`,
      resources: [`${__dirname}/../../extests/fixtures`],
    });
  } catch (err) {
    console.error('Failed to run integration tests');
    console.error(err);
    process.exit(1);
  }
}

void main();
