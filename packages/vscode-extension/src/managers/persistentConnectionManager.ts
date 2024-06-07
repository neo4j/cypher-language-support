import { PersistentConnection } from '@neo4j-cypher/schema-poller';
import { ExecuteQueryArgs } from '@neo4j-cypher/schema-poller/dist/cjs/src/types/sdkTypes';
import { Connection, getConnectionString } from '../types/connection';

export class PersistentConnectionManager {
  private static _instance: PersistentConnectionManager;
  private readonly _persistentConnection: PersistentConnection;

  constructor() {
    this._persistentConnection = new PersistentConnection('vscode-extension');
  }

  static set instance(value: PersistentConnectionManager) {
    PersistentConnectionManager._instance = value;
  }

  static get instance(): PersistentConnectionManager {
    return PersistentConnectionManager._instance;
  }

  async connectionIsSuccessful(
    connection: Connection,
    password: string,
  ): Promise<boolean> {
    try {
      await this.ensureConnection(connection, password);
    } catch {
      return false;
    }

    return true;
  }

  async executeQuery<T>(
    connection: Connection,
    password: string,
    queryFn: (database?: string) => ExecuteQueryArgs<T>,
  ) {
    try {
      await this.ensureConnection(connection, password);
      return await this._persistentConnection.executeQuery<T>(
        queryFn(connection.database),
      );
    } catch {
      return null;
    }
  }

  async updateConnection(
    connection: Connection,
    password: string,
  ): Promise<void> {
    const url = getConnectionString(connection);
    const credentials = { username: connection.user, password };
    await this._persistentConnection.updateConnection(url, credentials);
  }

  async closeConnection(): Promise<void> {
    await this._persistentConnection.closeConnection();
  }

  private async ensureConnection(
    connection: Connection,
    password: string,
  ): Promise<void> {
    const url = getConnectionString(connection);
    const credentials = { username: connection.user, password };
    const connected = await this._persistentConnection.ensureConnection(
      url,
      credentials,
    );

    if (!connected) {
      throw new Error('Failed to connect to database');
    }
  }
}
