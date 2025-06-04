import { EventEmitter } from 'events';
import neo4j, { Config, Driver } from 'neo4j-driver';
import {
  ConnectionError,
  FRIENDLY_ERROR_MESSAGES,
  getConnectionError,
  isRetriableNeo4jError,
} from './connectionErrorHandler';
import {
  ConnectedMetadataPoller,
  DisconnectedMetadataPoller,
  MetadataPoller,
} from './metadataPoller';
import { Neo4jConnection } from './neo4jConnection';
import { listDatabases } from './queries/databases.js';
import { getCypherVersions } from './queries/version';

export type ConnnectionResult = {
  success: boolean;
  retriable?: boolean;
  error?: ConnectionError;
};

const MAX_RETRY_ATTEMPTS = 5;
const RETRY_INTERVAL_MS = 30000;

export class Neo4jSchemaPoller {
  public connection?: Neo4jConnection;
  public metadata?: MetadataPoller;
  public events: EventEmitter = new EventEmitter();
  public driver?: Driver;
  public serverVersion?: string;
  private reconnectionTimeout?: ReturnType<typeof setTimeout>;
  private retries = MAX_RETRY_ATTEMPTS;
  private lastError?: ConnectionError;
  private parameters: Record<string, unknown> = {};

  setParameters(parameters: Record<string, unknown>) {
    this.parameters = parameters;

    if (this.metadata) {
      this.metadata.dbSchema.parameters = parameters;
    } else {
      this.metadata = new DisconnectedMetadataPoller(parameters);
    }
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
        error: getConnectionError(error),
      };
    }

    return { success: true };
  }

  async persistentConnect(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
    database?: string,
  ): Promise<ConnnectionResult> {
    const shouldHaveConnection = this.connection !== undefined;
    const connectionAlive = await this.connection?.healthcheck();
    const shouldUpdateConnection =
      this.connection && database && this.connection?.currentDb !== database;

    if (!connectionAlive || shouldUpdateConnection) {
      if (shouldHaveConnection && !shouldUpdateConnection) {
        console.error('Connection to Neo4j dropped');
        this.disconnect();
      } else if (shouldUpdateConnection) {
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

        this.serverVersion = undefined; //So when checking serverversion, we dont use the one from the last connection

        return this.handleSuccessfulConnection();
      } catch (error) {
        console.error('Error connecting to Neo4j.', error);
        this.retries -= 1;
        this.lastError = getConnectionError(error);

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

  disconnect() {
    if (this.connection) {
      // eslint-disable-next-line no-console
      console.log('Disconnected from Neo4j');
    }
    this.connection?.dispose();
    this.metadata?.stopBackgroundPolling();
    this.connection = undefined;
    const parameters = this.metadata?.dbSchema?.parameters ?? {};
    this.metadata = new DisconnectedMetadataPoller(parameters);
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

    const { query: dbQuery, queryConfig: dbQueryConfig } = listDatabases();
    const { databases, summary } = await this.driver.executeQuery(
      dbQuery,
      {},
      dbQueryConfig,
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

    const { query: cypherVersionQuery, queryConfig: cypherVersionQueryConfig } =
      getCypherVersions();
    const { serverCypherVersions } = await this.driver.executeQuery(
      cypherVersionQuery,
      {},
      cypherVersionQueryConfig,
    );

    this.metadata = new ConnectedMetadataPoller(
      databases,
      this.parameters,
      serverCypherVersions,
      this.connection,
      this.events,
    );

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
    }, RETRY_INTERVAL_MS);
  }

  private handleSuccessfulConnection(): ConnnectionResult {
    this.resetRetries();

    // eslint-disable-next-line no-console
    console.log('Established connection to Neo4j');
    this.events.emit('connectionConnected');

    return { success: true };
  }

  private handleNonSuccessfulConnection(): ConnnectionResult {
    const connectionError = this.formatConnectionErrorFriendlyMessage(
      this.lastError,
      true,
    );

    this.events.emit('connectionErrored', connectionError);

    return {
      success: false,
      retriable: true,
      error: connectionError,
    };
  }

  private handlePermanentlyFailingConnection(): ConnnectionResult {
    this.resetRetries();

    const connectionError = this.formatConnectionErrorFriendlyMessage(
      this.lastError,
      false,
    );

    this.events.emit('connectionFailed', connectionError);

    return {
      success: false,
      retriable: false,
      error: connectionError,
    };
  }

  private formatConnectionErrorFriendlyMessage(
    connectionError: ConnectionError = {
      message: '',
      friendlyMessage: FRIENDLY_ERROR_MESSAGES.Default,
      code: '',
    },
    retriable: boolean,
  ): ConnectionError {
    const friendlyMessage = retriable
      ? `${connectionError.friendlyMessage}. Retrying in ${
          RETRY_INTERVAL_MS / 1000
        } seconds`
      : connectionError.friendlyMessage;

    return {
      ...connectionError,
      friendlyMessage: friendlyMessage,
    };
  }

  private resetRetries(): void {
    this.retries = MAX_RETRY_ATTEMPTS;
  }
}
