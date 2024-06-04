import { Config } from 'neo4j-driver';
import { initializeDriver } from './initializers/driverIntializer';
import { Neo4jConnection } from './neo4jConnection';
import { listDatabases } from './queries/databases';
import { getDataSummary } from './queries/dataSummary';

export class PersistentConnection {
  public connection?: Neo4jConnection;
  private reconnectionTimeout?: ReturnType<typeof setTimeout>;

  async connect(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
    database: string,
    firstAttempt: boolean = true,
  ): Promise<boolean> {
    const shouldHaveConnection = this.connection !== undefined;
    const connectionAlive = await this.connection?.healthcheck();

    if (!connectionAlive) {
      if (shouldHaveConnection) {
        console.error('Connection to Neo4j dropped');
        this.disconnect();
      }

      try {
        await this.initializeConnection(url, credentials, config, database);
        // eslint-disable-next-line no-console
        console.log('Established connection to Neo4j');
      } catch (error) {
        const errorMessage = `Unable to connect to Neo4j: ${String(error)}.`;
        if (firstAttempt) {
          console.error(errorMessage);
          return false;
        }
        console.error(`${errorMessage}. Retrying in 30 seconds.`);
      }
    }

    this.reconnectionTimeout = setTimeout(() => {
      void this.connect(url, credentials, config, database, false);
    }, 30000);

    return true;
  }

  async getDatabaseDataSummary(): Promise<{
    labels: string[];
    relationshipTypes: string[];
  }> {
    if (this.connection && this.connection.driver) {
      const { query: summaryQuery, queryConfig: summaryQueryConfig } =
        getDataSummary(this.connection.currentDb);
      const { labels, relationshipTypes } =
        await this.connection.driver.executeQuery(
          summaryQuery,
          {},
          summaryQueryConfig,
        );
      return { labels, relationshipTypes };
    }

    return { labels: [], relationshipTypes: [] };
  }

  disconnect() {
    this.connection?.dispose();
    this.connection = undefined;
    clearTimeout(this.reconnectionTimeout);
  }

  private async initializeConnection(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
    database: string,
  ) {
    const driver = await initializeDriver(url, credentials, config);
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
  }
}
