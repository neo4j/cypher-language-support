import { createAndStartTestContainer } from './setupTestContainer';
import { run as testRunner } from './testRunner';

export async function run(): Promise<void> {
  const container = await createAndStartTestContainer();
  process.env.NEO4J_PORT = container.getMappedPort(7687).toString();
  process.env.CYPHER_25 = 'true';
  return testRunner();
}
