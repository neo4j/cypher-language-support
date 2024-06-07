import { queries } from '@neo4j-cypher/schema-poller';
import { DataSummary } from '@neo4j-cypher/schema-poller/dist/cjs/src/queries/dataSummary';
import { Memento, SecretStorage } from 'vscode';
import { PersistentConnectionManager } from '../managers/persistentConnectionManager';
import { Connection } from '../types/connection';

type Connections = {
  [key: string]: Connection;
};

export class ConnectionRepository {
  private CONNECTIONS_KEY = 'connections';

  private static _instance: ConnectionRepository;

  private readonly _globalState: Memento;
  private readonly _secretStorage: SecretStorage;

  constructor(globalState: Memento, secretStorage: SecretStorage) {
    this._globalState = globalState;
    this._secretStorage = secretStorage;
  }

  public static set instance(value: ConnectionRepository) {
    ConnectionRepository._instance = value;
  }

  public static get instance(): ConnectionRepository {
    return ConnectionRepository._instance;
  }

  getCurrentConnection(): Connection {
    return Object.values(this.getConnectionsInternal()).find(
      (connection) => connection.connected,
    );
  }

  getConnections(): readonly Connection[] {
    return Object.values(this.getConnectionsInternal());
  }

  getConnection(key: string): Connection | undefined {
    const connections = this.getConnectionsInternal();
    return connections[key];
  }

  async resetConnections(): Promise<void> {
    const connections = this.getConnectionsInternal();
    Object.keys(connections).forEach((key: string) => {
      if (key) {
        const connection = connections[key];
        connections[key] = { ...connection, connected: false };
      }
    });
    await this._globalState.update(this.CONNECTIONS_KEY, connections);
  }

  async deleteConnection(key: string): Promise<void> {
    const connections = this.getConnectionsInternal();
    delete connections[key];
    await this._globalState.update(this.CONNECTIONS_KEY, connections);
    await this.deletePassword(key);
  }

  async setConnection(connection: Connection, password: string): Promise<void> {
    const connections = this.getConnectionsInternal();
    connections[connection.key] = { ...connection };
    await this._globalState.update(this.CONNECTIONS_KEY, connections);
    await this.setPassword(connection.key, password);
  }

  async toggleConnection(key: string, connected: boolean): Promise<void> {
    const connections = this.getConnectionsInternal();
    const connection = connections[key];
    connections[key] = { ...connection, connected: connected };
    await this._globalState.update(this.CONNECTIONS_KEY, connections);
  }

  async getPasswordForConnection(key: string): Promise<string> {
    return await this._secretStorage.get(key);
  }

  async getConnectionDataSummary(
    key: string,
  ): Promise<{ labels: string[]; relationshipTypes: string[] }> {
    const connection = this.getConnection(key);
    const password = await this.getPasswordForConnection(key);

    const result =
      await PersistentConnectionManager.instance.executeQuery<DataSummary>(
        connection,
        password,
        () => queries.getDataSummary(connection.database),
      );

    return result
      ? { labels: result.labels, relationshipTypes: result.relationshipTypes }
      : { labels: [], relationshipTypes: [] };
  }

  private async setPassword(key: string, password: string): Promise<void> {
    await this._secretStorage.store(key, password);
  }

  private async deletePassword(key: string): Promise<void> {
    await this._secretStorage.delete(key);
  }

  private getConnectionsInternal(): Connections {
    return this._globalState.get(this.CONNECTIONS_KEY, {});
  }
}
