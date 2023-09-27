import neo4j, { Config } from 'neo4j-driver';
import { MetadataPoller } from './metadata-poller';
import { Neo4jConnection } from './neo4j-connection';
import { listDatabases } from './queries/databases.js';

export class Neo4jSchemaPoller {
  public connection?: Neo4jConnection;
  public metadata?: MetadataPoller;

  async connect(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
  ) {
    const driver = neo4j.driver(
      url,
      neo4j.auth.basic(credentials.username, credentials.password),
      { userAgent: config.appName, ...config.driverConfig },
    );

    await driver.verifyConnectivity();

    if (await driver.supportsSessionAuth()) {
      if (!(await driver.verifyAuthentication())) {
        throw new Error('Invalid credentials');
      }
    }

    const { query, queryConfig } = listDatabases();
    const { databases, summary } = await driver.executeQuery(
      query,
      {},
      queryConfig,
    );

    const protocolVersion =
      summary.server.protocolVersion?.toString() ?? 'unknown';

    this.connection = new Neo4jConnection(
      credentials.username,
      protocolVersion,
      databases,
      driver,
    );

    this.metadata = new MetadataPoller(databases, this.connection);
    this.metadata.startBackgroundPolling();
  }

  disconnect() {
    this.connection?.dispose();
    this.metadata?.stopBackgroundPolling();
    this.connection = undefined;
    this.metadata = undefined;
  }
}
