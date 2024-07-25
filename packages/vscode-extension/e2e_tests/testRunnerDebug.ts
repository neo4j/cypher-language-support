import { createAndStartTestContainer } from './setupTestContainer';
import { run as testRunner } from './testRunner';

export async function run(): Promise<void> {
  await createAndStartTestContainer('../../e2e_tests');
  return testRunner();
}
