import { createAndStartTestContainer } from './setupTestContainer';
import { run as testRunner } from './testRunner';

export async function run(): Promise<void> {
  const [neo4j5Instance, neo4j2025Instance] = await Promise.all([
    createAndStartTestContainer({
      containerName: 'vscode-it-neo4j-5',
      neo4jVersion: 'neo4j:5.20-enterprise',
    }),
    createAndStartTestContainer({
      containerName: 'vscode-it-neo4j-2025',
      neo4jVersion: 'neo4j:2025-enterprise',
      env: {
        NEO4J_internal_dbms_cypher_enable__experimental__versions: 'true',
      },
    }),
  ]);
  (process.env.NEO4J_5_PORT = neo4j5Instance.getMappedPort(7687).toString()),
    (process.env.NEO4J_2025_PORT = neo4j2025Instance
      .getMappedPort(7687)
      .toString()),
    (process.env.DEBUG_VSCODE_TESTS = 'true');
  return testRunner();
}
