import { Neo4jSettings } from '@neo4j-cypher/language-server/src/types';
import { Neo4jSchemaPoller } from '@neo4j-cypher/schema-poller';
import { ConnnectionResult } from '@neo4j-cypher/schema-poller/dist/cjs/src/schemaPoller';

export class SchemaPollerConnectionManager {
  public readonly _schemaPoller: Neo4jSchemaPoller;

  constructor() {
    this._schemaPoller = new Neo4jSchemaPoller();
  }

  async connect(connectionSettings: Neo4jSettings): Promise<ConnnectionResult> {
    this._schemaPoller.disconnect();
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
}
