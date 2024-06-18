import { EventEmitter } from 'events';
import neo4j, { Config } from 'neo4j-driver';
import { MetadataPoller } from './metadataPoller';
import { Neo4jConnection } from './neo4jConnection';
import { listDatabases } from './queries/databases.js';

export type ConnnectionResult = {
  success: boolean;
  error?: string;
};

export class Neo4jSchemaPoller {
  public connection?: Neo4jConnection;
  public metadata?: MetadataPoller;
  public events: EventEmitter = new EventEmitter();
  private reconnectionTimeout?: ReturnType<typeof setTimeout>;

  async persistentConnect(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
    database?: string,
  ): Promise<ConnnectionResult> {
    const shouldHaveConnection = this.connection !== undefined;
    const connectionAlive = await this.connection?.healthcheck();
    let connectionResult: ConnnectionResult = { success: false };

    if (!connectionAlive) {
      if (shouldHaveConnection) {
        console.error('Connection to Neo4j dropped');
        this.disconnect();
      }

      try {
        await this.connect(url, credentials, config, database);
        connectionResult = { success: true };
        this.handleConnection();
      } catch (error) {
        const errorMessage = String(error);
        connectionResult = { success: false, error: errorMessage };
        this.handleConnectionError(errorMessage);
      }
    }

    this.reconnectionTimeout = setTimeout(() => {
      void this.persistentConnect(url, credentials, config, database);
    }, 30000);

    return connectionResult;
  }

  disconnect() {
    if (this.connection) {
      // eslint-disable-next-line no-console
      console.log('Disconnected from Neo4j');
    }
    this.connection?.dispose();
    this.metadata?.stopBackgroundPolling();
    this.connection = undefined;
    this.metadata = undefined;
    clearTimeout(this.reconnectionTimeout);
  }

  private async connect(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
    database?: string,
  ) {
    const driver = neo4j.driver(
      url,
      neo4j.auth.basic(credentials.username, credentials.password),
      { userAgent: config.appName, ...config.driverConfig },
    );

    await driver.verifyConnectivity({ database: database });

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
      database,
    );

    this.metadata = new MetadataPoller(databases, this.connection);
    this.metadata.startBackgroundPolling();
  }

  private handleConnection(): void {
    // eslint-disable-next-line no-console
    console.log('Established connection to Neo4j');
    this.events.emit('connectionConnected');
  }

  private handleConnectionError(errorMessage: string): void {
    console.error(
      `Unable to connect to Neo4j: ${errorMessage}. Retrying in 30 seconds.`,
    );
    this.events.emit('connectionErrored', errorMessage);
  }
}
