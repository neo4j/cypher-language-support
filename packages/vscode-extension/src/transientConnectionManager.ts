import { queries, TransientConnection } from '@neo4j-cypher/schema-poller';

const config = { appName: 'vscode-extension' };

export class TransientConnectionManager {
  private static _instance: TransientConnectionManager;

  constructor() {}

  public static set instance(value: TransientConnectionManager) {
    TransientConnectionManager._instance = value;
  }

  public static get instance(): TransientConnectionManager {
    return TransientConnectionManager._instance;
  }

  async testConnection(
    url: string,
    credentials: { username: string; password: string },
  ): Promise<boolean> {
    const transientConnection = new TransientConnection();
    return await transientConnection.testConnection(url, credentials, config);
  }

  async getDatabaseDataSummary(
    url: string,
    credentials: { username: string; password: string },
    database: string,
  ): Promise<{
    labels: string[];
    relationshipTypes: string[];
  }> {
    const transientConnection: TransientConnection = new TransientConnection();
    const { query, queryConfig } = queries.getDataSummary(database);
    return await transientConnection.executeCommand<{
      labels: string[];
      relationshipTypes: string[];
    }>(url, credentials, config, query, queryConfig);
  }
}
