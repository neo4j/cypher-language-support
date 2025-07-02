import { Neo4jContainer, StartedNeo4jContainer } from '@testcontainers/neo4j';

type ContainerOpts = {
  containerName?: string;
  neo4jVersion: string;
};

export async function createAndStartTestContainer(
  opts: ContainerOpts = {
    containerName: 'vscode-integration-tests',
    neo4jVersion: 'neo4j:5-enterprise',
  },
): Promise<StartedNeo4jContainer> {
  const password = 'password';
  const container = await new Neo4jContainer(opts.neo4jVersion)
    .withExposedPorts(7474, 7687)
    .withApoc()
    .withPassword(password)
    .withEnvironment({ NEO4J_ACCEPT_LICENSE_AGREEMENT: 'yes' })
    // Giving it a name prevents us from spinning up a different
    // container every time we run the tests and allows us
    // closing a lingering one when the tests finish
    .withName(opts.containerName)
    .start();

  return container;
}
