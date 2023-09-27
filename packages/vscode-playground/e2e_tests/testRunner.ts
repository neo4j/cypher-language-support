import { Config } from '@jest/types';
import { runCLI } from 'jest';
import * as path from 'path';

export function run(): Promise<void> {
  const projectRootPath = path.join(process.cwd(), './');
  const config = path.join(projectRootPath, 'jest.config.js');

  return runCLI({ config } as unknown as Config.Argv, [projectRootPath])
    .then((jestCliCallResult) => {
      jestCliCallResult.results.testResults.forEach((testResult) => {
        testResult.testResults
          .filter((assertionResult) => assertionResult.status === 'passed')
          .forEach(({ ancestorTitles, title, status }) => {
            // eslint-disable-next-line no-console
            console.log(
              `  ● ${ancestorTitles.join('›')} › ${title} (${status})`,
            );
          });
      });

      jestCliCallResult.results.testResults.forEach((testResult) => {
        if (testResult.failureMessage) {
          console.error(testResult.failureMessage);
        }
      });
    })
    .catch((errorCaughtByJestRunner) => {
      console.error(
        'An error happened when executing the integration tests: ' +
          (errorCaughtByJestRunner as Error).message,
      );
    });
}
