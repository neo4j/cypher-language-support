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
    this._schemaPoller.events.on(
      'connectionErrored',
      (errorMessage: string) => void onConnectionErroredHandler(errorMessage),
    );
    this._schemaPoller.events.on(
      'connectionReconnected',
      () => void onConnectionReconnectedHandler(),
    );
  }

  async connect(connectionSettings: Neo4jSettings): Promise<ConnnectionResult> {
    this.disconnect();
    return await this._schemaPoller.persistentConnect(
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

  dispose() {
    this.disconnect();
    this._schemaPoller.events.removeAllListeners();
    this._schemaPoller = undefined;
  }
}
