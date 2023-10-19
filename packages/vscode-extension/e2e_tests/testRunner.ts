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
  mocha.timeout(100000);

  const testsRoot = __dirname;

  return glob('**/**.spec.js', { cwd: testsRoot }).then((files) => {
    // Add files to the test suite
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
    files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

    // Run the mocha test
    mocha.run((failures) => {
      if (failures > 0) {
        throw new Error(`${failures} tests failed.`);
      }
    });
  });
}
