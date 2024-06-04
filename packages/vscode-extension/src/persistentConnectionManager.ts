import { PersistentConnection } from '@neo4j-cypher/schema-poller';
import { Config } from 'neo4j-driver';

/**
 * Singleton class to manage a single persistent connection to a Neo4j database
 *
 * Wraps a PersistentConnection instance and exposes functions to connect and query database metadata
 */
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
  ): Promise<boolean> {
    this._persistentConnection.disconnect();
    return await this._persistentConnection.connect(
      url,
      credentials,
      config,
      database,
      true,
    );
  }

  disconnect() {
    this._persistentConnection.disconnect();
  }

  currentDatabase(): string | undefined {
    return this._persistentConnection.connection?.currentDb;
  }

  async getDatabaseDataSummary() {
    return await this._persistentConnection.getDatabaseDataSummary();
  }
}
