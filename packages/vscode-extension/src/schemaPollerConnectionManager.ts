import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { Neo4jSchemaPoller } from '@neo4j-cypher/schema-poller';
import {
  connectionConnectedHandler,
  connectionReconnectingHandler,
} from './commandHandlers';

export class SchemaPollerConnectionManager {
  public readonly _schemaPoller: Neo4jSchemaPoller;

  constructor() {
    this._schemaPoller = new Neo4jSchemaPoller();
    this._schemaPoller.events.on(
      'schemaPoller.persistentConnect.reconnecting',
      (error: string) => void connectionReconnectingHandler(error),
    );
    this._schemaPoller.events.on(
      'schemaPoller.persistentConnect.connected',
      () => void connectionConnectedHandler(),
    );
  }

  async connect(connectionSettings: Neo4jSettings) {
    this._schemaPoller.disconnect();
    await this._schemaPoller.persistentConnect(
      connectionSettings.connectURL,
      {
        username: connectionSettings.user,
        password: connectionSettings.password,
      },
      { appName: 'vscode-extension' },
      connectionSettings.database,
    );
  }

  disconnect() {
    this._schemaPoller.disconnect();
  }
}
