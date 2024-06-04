import { PersistentConnection } from '@neo4j-cypher/schema-poller';
import { Config } from 'neo4j-driver';

export class PersistentConnectionManager {
  private static _instance: PersistentConnectionManager;
  private readonly _persistentConnection: PersistentConnection;

  constructor(persistentConnection: PersistentConnection) {
    this._persistentConnection = persistentConnection;
  }

  public static set instance(value: PersistentConnectionManager) {
    PersistentConnectionManager._instance = value;
  }

  public static get instance(): PersistentConnectionManager {
    return PersistentConnectionManager._instance;
  }

  async connect(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
    database: string,
  ) {
    this._persistentConnection.disconnect();
    await this._persistentConnection.connect(
      url,
      credentials,
      config,
      database,
    );
  }

  currentDatabase(): string | undefined {
    return this._persistentConnection.connection?.currentDb;
  }

  async getDatabaseDataSummary() {
    return await this._persistentConnection.getDatabaseDataSummary();
  }
}
