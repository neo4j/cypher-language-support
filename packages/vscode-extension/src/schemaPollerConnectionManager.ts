import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { Neo4jSchemaPoller } from '@neo4j-cypher/schema-poller';
import { ConnnectionResult } from '@neo4j-cypher/schema-poller/dist/cjs/src/schemaPoller';
import {
  onConnectionErroredHandler,
  onConnectionReconnectedHandler,
} from './commandHandlers';

export class SchemaPollerConnectionManager {
  public _schemaPoller: Neo4jSchemaPoller;

  constructor() {
    this._schemaPoller = new Neo4jSchemaPoller();
  }

  async connect(connectionSettings: Neo4jSettings): Promise<ConnnectionResult> {
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

    if (result.success) {
      this.attachErrorEventListener();
    } else {
      this.attachReconnectionEventListener();
    }

    return result;
  }

  disconnect(): void {
    this._schemaPoller.disconnect();
    this._schemaPoller.events.removeAllListeners();
  }

  private attachErrorEventListener(): void {
    this._schemaPoller.events.once(
      'connectionErrored',
      (errorMessage: string) => this.handleConnectionError(errorMessage),
    );
  }

  private handleConnectionError(errorMessage: string): void {
    void onConnectionErroredHandler(errorMessage);
    this.attachReconnectionEventListener();
  }

  private attachReconnectionEventListener(): void {
    this._schemaPoller.events.once('connectionConnected', () =>
      this.handleConnectionReconnected(),
    );
  }

  private handleConnectionReconnected(): void {
    void onConnectionReconnectedHandler();
    this.attachErrorEventListener();
  }
}
