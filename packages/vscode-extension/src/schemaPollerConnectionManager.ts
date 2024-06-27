import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import {
  ConnnectionResult,
  Neo4jSchemaPoller,
} from '@neo4j-cypher/schema-poller';
import {
  saveConnectionStateAsConnectedAndShowInfoMessage,
  saveConnectionStateAsDisconnectedAndShowErrorMessage,
  saveConnectionStateAsErroredAndShowWarningMessage,
} from './commandHandlers';

/**
 * Manages an instance of the Neo4jSchemaPoller and handles connection attempts.
 */
export class SchemaPollerConnectionManager {
  public _schemaPoller: Neo4jSchemaPoller;

  constructor(schemaPoller?: Neo4jSchemaPoller) {
    this._schemaPoller = schemaPoller ?? new Neo4jSchemaPoller();
  }

  /**
   * Used to initialize and verify a connection to a Neo4j database.
   * Initially disconnects the current schema poller connection.
   * Then attempts to establish a new connection to a Neo4j database.
   * @param connectionSettings The connection settings for the database connection.
   * @returns A promise that resolves with the result of the connection attempt.
   */
  public async connect(
    connectionSettings: Neo4jSettings,
  ): Promise<ConnnectionResult> {
    this.disconnect();
    const result = await this._schemaPoller.connect(
      connectionSettings.connectURL,
      {
        username: connectionSettings.user,
        password: connectionSettings.password,
      },
      { appName: 'vscode-extension' },
      connectionSettings.database,
    );

    return result;
  }

  /**
   * Used to establish a persistent connection to a Neo4j database.
   * If the connection attempt fails, a reconnection event listener is attached which fires once the connection is re-established.
   * If the connection attempt is successful, an error event listener is attached to handle any future connection errors.
   * @param connectionSettings The connection settings for the database connection.
   * @returns A promise that resolves with the result of the connection attempt.
   */
  public async persistentConnect(
    connectionSettings: Neo4jSettings,
  ): Promise<ConnnectionResult> {
    const result = await this._schemaPoller.persistentConnect(
      connectionSettings.connectURL,
      {
        username: connectionSettings.user,
        password: connectionSettings.password,
      },
      { appName: 'vscode-extension' },
      connectionSettings.database,
    );

    result.success
      ? this._attachErrorEventListener()
      : this._attachReconnectionOrFailedEventListeners();

    return result;
  }

  /**
   * Disconnects the current schema poller connection and removes all event listeners.
   */
  public disconnect(): void {
    this._schemaPoller.disconnect();
    this._schemaPoller.events.removeAllListeners();
  }

  /**
   * Attaches an event listener to handle connection errors.
   * This event is only handled once.
   */
  _attachErrorEventListener(): void {
    this._schemaPoller.events.once(
      'connectionErrored',
      (errorMessage: string) => this._handleConnectionError(errorMessage),
    );
  }

  /**
   * Handles a connection errored event. Delegates to the onConnectionErroredHandler,
   * and attaches reconnection/failed event listeners.
   * This event is fired when the schema poller encounters an issue with an existing database connection.
   * @param errorMessage The error message to display.
   */
  _handleConnectionError(errorMessage: string): void {
    void saveConnectionStateAsErroredAndShowWarningMessage(errorMessage);
    this._attachReconnectionOrFailedEventListeners();
  }

  /**
   * Attaches event listeners to handle reconnection and connection failed events.
   * These events are only handled once.
   */
  _attachReconnectionOrFailedEventListeners(): void {
    this._schemaPoller.events.once('connectionConnected', () =>
      this._handleConnectionReconnected(),
    );
    this._schemaPoller.events.once('connectionFailed', (errorMessage: string) =>
      this._handleConnectionFailed(errorMessage),
    );
  }

  /**
   * Handles a reconnection event. Delegates to the onConnectionReconnectedHandler, and removes all event listeners.
   * This event is fired when the schema poller successfully re-establishes a database connection.
   */
  _handleConnectionReconnected(): void {
    void saveConnectionStateAsConnectedAndShowInfoMessage();
    this._schemaPoller.events.removeAllListeners();
    this._attachErrorEventListener();
  }

  /**
   * Handles a connection failed event. Delegates to the onConnectionFailedHandler, and removes all event listeners.
   * This event is fired when the schema poller gives up retrying a database connection.
   * @param errorMessage The error message to display.
   */
  _handleConnectionFailed(errorMessage: string): void {
    void saveConnectionStateAsDisconnectedAndShowErrorMessage(errorMessage);
    this._schemaPoller.events.removeAllListeners();
  }
}
