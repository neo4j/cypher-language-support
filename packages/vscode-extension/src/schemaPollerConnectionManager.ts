import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { Neo4jSchemaPoller } from '@neo4j-cypher/schema-poller';
import { ConnnectionResult } from '@neo4j-cypher/schema-poller/dist/cjs/src/schemaPoller';
import {
  onConnectionErroredHandler,
  onConnectionReconnectedHandler,
} from './commandHandlers';

export class SchemaPollerConnectionManager {
  public _schemaPoller: Neo4jSchemaPoller;

  constructor(schemaPoller?: Neo4jSchemaPoller) {
    this._schemaPoller = schemaPoller ?? new Neo4jSchemaPoller();
  }

  public async connect(
    connectionSettings: Neo4jSettings,
  ): Promise<ConnnectionResult> {
    this.disconnect();
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
      : this._attachReconnectionEventListener();

    return result;
  }

  public disconnect(): void {
    this._schemaPoller.disconnect();
    this._schemaPoller.events.removeAllListeners();
  }

  _attachErrorEventListener(): void {
    this._schemaPoller.events.once(
      'connectionErrored',
      (errorMessage: string) => this._handleConnectionError(errorMessage),
    );
  }

  _handleConnectionError(errorMessage: string): void {
    void onConnectionErroredHandler(errorMessage);
    this._attachReconnectionEventListener();
  }

  _attachReconnectionEventListener(): void {
    this._schemaPoller.events.once('connectionConnected', () =>
      this._handleConnectionReconnected(),
    );
  }

  _handleConnectionReconnected(): void {
    void onConnectionReconnectedHandler();
    this._attachErrorEventListener();
  }
}
