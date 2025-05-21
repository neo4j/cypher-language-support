// Taken from https://code.visualstudio.com/api/working-with-extensions/testing-extension#the-test-runner-script
import { glob } from 'glob';
import Mocha from 'mocha';
import path from 'path';

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
  });
  mocha.timeout(
    process.env.DEBUG_VSCODE_TESTS === 'true'
      ? Number.POSITIVE_INFINITY
      : 30000,
  );

  const testsRoot = __dirname;

  return new Promise((resolve, reject) => {
    glob('**/{api,unit}/**/*.spec.js', { cwd: testsRoot })
      .then((files) => {
        // Add files to the test suite
        files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

        try {
          // Run the mocha test
          mocha.run((failures) => {
            if (failures > 0) {
              reject(new Error(`${failures} tests failed.`));
            } else {
              resolve();
            }
          });
        } catch (err) {
          console.error(err);
          reject(err);
        }
      })
      .catch(reject);
  });
}
