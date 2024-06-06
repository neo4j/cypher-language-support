import { Memento } from 'vscode';
import { Connection } from '../types';

/**
 * Singleton class to manage global state
 *
 * Wraps a Memento instance and exposes a number of functions to
 * get and update connections stored in the global workspace
 *
 * Connections are stored in the following format:
 *
 * 'connections': {
 *  'connection1': {
 *    key: 'connection1',
 *    scheme: 'bolt',
 *    host: 'localhost',
 *    port: 7687,
 *    database: 'neo4j',
 *    user: 'neo4j',
 *    connected: true,
 *  },
 *  'connection2': {
 *    key: 'connection2',
 *    scheme: 'bolt',
 *    host: 'localhost',
 *    port: 7687,
 *    database: 'neo4j',
 *    user: 'neo4j',
 *    connected: false,
 *  }
 * }
 */
type Connections = {
  [key: string]: Connection;
};
export class GlobalStateManager {
  private CONNECTIONS_KEY = 'connections';
  private static _instance: GlobalStateManager;
  private readonly _globalState: Memento;

  constructor(globalState: Memento) {
    this._globalState = globalState;
  }

  public static set instance(value: GlobalStateManager) {
    GlobalStateManager._instance = value;
  }

  public static get instance(): GlobalStateManager {
    return GlobalStateManager._instance;
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
  }

  async setConnection(connection: Connection): Promise<void> {
    const connections = this.getConnectionsInternal();
    connections[connection.key] = { ...connection };
    await this._globalState.update(this.CONNECTIONS_KEY, connections);
  }

  async toggleConnection(key: string, connected: boolean): Promise<void> {
    const connection = this.getConnection(key);
    connection.connected = connected;
    await this.setConnection(connection);
  }

  private getConnectionsInternal(): Connections {
    return this._globalState.get(this.CONNECTIONS_KEY, {});
  }
}
