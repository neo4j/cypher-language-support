import neo4j, { Config } from 'neo4j-driver';
import { MetadataPoller } from './metadataPoller';
import { Neo4jConnection } from './neo4jConnection';
import { listDatabases } from './queries/databases.js';

export class Neo4jSchemaPoller {
  public connection?: Neo4jConnection;
  public metadata?: MetadataPoller;
  private reconnectionTimeout?: ReturnType<typeof setTimeout>;

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

  async persistentConnect(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
  ) {
    const shouldHaveConnection = this.connection !== undefined;
    const connectionAlive = await this.connection?.healthcheck();

    if (!connectionAlive) {
      if (shouldHaveConnection) {
        console.error('Connection to Neo4j dropped');
        this.disconnect();
      }

      try {
        await this.connect(url, credentials, config);
        // eslint-disable-next-line no-console
        console.log('Established connection to Neo4j');
      } catch (error) {
        console.error(
          `Unable to connect to Neo4j: ${String(
            error,
          )}. Retrying in 30 seconds.`,
        );
      }
    }

    this.reconnectionTimeout = setTimeout(() => {
      void this.persistentConnect(url, credentials, config);
    }, 30000);
  }

  disconnect() {
    this.connection?.dispose();
    this.metadata?.stopBackgroundPolling();
    this.connection = undefined;
    this.metadata = undefined;
    clearTimeout(this.reconnectionTimeout);
  }
}
