import { DbSchema } from '@neo4j-cypher/language-support';
import { _Connection } from 'vscode-languageserver';
import { RuntimeStrategy } from './runtimeStrategy';

export class ExtensionRuntime implements RuntimeStrategy {
  private _dbSchema: DbSchema | undefined;

  constructor(connection: _Connection) {
    connection.onNotification('schemaFetched', (dbSchema: DbSchema) => {
      this._dbSchema = dbSchema;
    });
  }

  getDbSchema(): DbSchema {
    return this._dbSchema ?? {};
  }
}
