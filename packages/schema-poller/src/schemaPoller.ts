import { EventEmitter } from 'events';
import neo4j, { Config, Driver } from 'neo4j-driver';
import {
  getFriendlyErrorMessage,
  isRetriableNeo4jError,
} from './connectionErrorHandler';
import { MetadataPoller } from './metadataPoller';
import { Neo4jConnection } from './neo4jConnection';
import { listDatabases } from './queries/databases.js';

type ConnectionError = {
  message: string;
  code: string;
};

export type ConnnectionResult = {
  success: boolean;
  retriable?: boolean;
  error?: ConnectionError;
};

const maxRetryAttempts = 5;
const retryIntervalMs = 30000;

export class Neo4jSchemaPoller {
  public connection?: Neo4jConnection;
  public metadata?: MetadataPoller;
  public events: EventEmitter = new EventEmitter();
  private driver?: Driver;
  private reconnectionTimeout?: ReturnType<typeof setTimeout>;
  private retries = maxRetryAttempts;
  private lastError?: { message: string; code: string };

  async persistentConnect(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
    database?: string,
  ): Promise<ConnnectionResult> {
    const shouldHaveConnection = this.connection !== undefined;
    const connectionAlive = await this.connection?.healthcheck();

    if (!connectionAlive) {
      if (shouldHaveConnection) {
        console.error('Connection to Neo4j dropped');
        this.disconnect();
      }

      try {
        await this.connectAndStartMetadataPoller(
          url,
          credentials,
          config,
          database,
        );

        this.reconnectionTimeout = this.setReconnectionTimeout(
          url,
          credentials,
          config,
          database,
        );

        return this.handleSuccessfulConnection();
      } catch (error) {
        console.error('Error connecting to Neo4j.', error);
        this.retries -= 1;
        this.lastError = getFriendlyErrorMessage(error);

        if (!isRetriableNeo4jError(error)) {
          return this.handlePermanentlyFailingConnection();
        }

        if (this.retries > 0) {
          this.reconnectionTimeout = this.setReconnectionTimeout(
            url,
            credentials,
            config,
            database,
          );

          return this.handleNonSuccessfulConnection();
        }

        return this.handlePermanentlyFailingConnection();
      }
    }

    this.reconnectionTimeout = this.setReconnectionTimeout(
      url,
      credentials,
      config,
      database,
    );

    return { success: true };
  }

  async connect(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
    database?: string,
  ): Promise<ConnnectionResult> {
    try {
      this.driver = await this.initializeDriver(
        url,
        credentials,
        config,
        database,
      );
    } catch (error: unknown) {
      console.error('Error connecting to Neo4j.', error);
      return {
        success: false,
        retriable: isRetriableNeo4jError(error),
        error: getFriendlyErrorMessage(error),
      };
    }

    return { success: true };
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
    this.driver = undefined;
    clearTimeout(this.reconnectionTimeout);
  }

  private async connectAndStartMetadataPoller(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
    database?: string,
  ) {
    this.driver =
      this.driver ??
      (await this.initializeDriver(url, credentials, config, database));

    const { query, queryConfig } = listDatabases();
    const { databases, summary } = await this.driver.executeQuery(
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
      this.driver,
      database,
    );

    this.metadata = new MetadataPoller(databases, this.connection);
    this.metadata.startBackgroundPolling();
  }

  private async initializeDriver(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
    database?: string,
  ): Promise<Driver> {
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

    return driver;
  }

  private setReconnectionTimeout(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
    database?: string,
  ): NodeJS.Timeout {
    return setTimeout(() => {
      void this.persistentConnect(url, credentials, config, database);
    }, retryIntervalMs);
  }

  private handleSuccessfulConnection(): ConnnectionResult {
    this.resetRetries();

    // eslint-disable-next-line no-console
    console.log('Established connection to Neo4j');
    this.events.emit('connectionConnected');

    return { success: true };
  }

  private handleNonSuccessfulConnection(): ConnnectionResult {
    const errorMessage = this.getFormattedErrorMessage(this.lastError, true);

    this.events.emit('connectionErrored', errorMessage);

    return {
      success: false,
      retriable: true,
      error: { message: errorMessage, code: this.lastError?.code ?? '' },
    };
  }

  private handlePermanentlyFailingConnection(): ConnnectionResult {
    this.resetRetries();

    const errorMessage = this.getFormattedErrorMessage(this.lastError, false);

    this.events.emit('connectionFailed', errorMessage);

    return {
      success: false,
      retriable: false,
      error: { message: errorMessage, code: this.lastError?.code ?? '' },
    };
  }

  private getFormattedErrorMessage(
    error: ConnectionError | undefined = { message: 'Unknown error', code: '' },
    retriable: boolean,
  ): string {
    return `${error.message}. ${
      retriable
        ? `Retrying in ${retryIntervalMs / 1000} seconds`
        : 'Not trying again'
    }.`;
  }

  private resetRetries(): void {
    this.retries = maxRetryAttempts;
  }
}
