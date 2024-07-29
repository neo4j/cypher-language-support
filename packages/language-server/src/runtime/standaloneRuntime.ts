import { DbSchema } from '@neo4j-cypher/language-support';
import { Neo4jSchemaPoller } from '@neo4j-cypher/schema-poller';
import { _Connection } from 'vscode-languageserver';
import { Neo4jSettings } from '../types';
import { RuntimeStrategy } from './runtimeStrategy';

export class StandaloneRuntime implements RuntimeStrategy {
  private _schemaPoller: Neo4jSchemaPoller;

  constructor(connection: _Connection) {
    this._schemaPoller = new Neo4jSchemaPoller();

    connection.onDidChangeConfiguration(
      (params: { settings: { neo4j: Neo4jSettings } }) => {
        this.changeConnection(params.settings.neo4j);
      },
    );
  }

  getDbSchema(): DbSchema {
    return this._schemaPoller.metadata?.dbSchema ?? {};
  }

  changeConnection(connectionSettings: Neo4jSettings): void {
    this.disconnect();

    if (
      this._schemaPoller.connection === undefined &&
      connectionSettings.connect &&
      connectionSettings.password &&
      connectionSettings.connectURL &&
      connectionSettings.user
    ) {
      void this._schemaPoller.persistentConnect(
        connectionSettings.connectURL,
        {
          username: connectionSettings.user,
          password: connectionSettings.password,
        },
        { appName: 'cypher-language-server' },
        connectionSettings.database,
      );
    }
  }

  disconnect(): void {
    this._schemaPoller.disconnect();
  }
}
