import { Memento } from 'vscode';
import { Connection } from './types/connection';

/**
 * Singleton class to manage global state
 *
 * Wraps a Memento instance and exposes a number of functions to
 * get and update connections stored in the global workspace
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

  async setConnection(connection: Connection): Promise<void> {
    const connections = this.getConnectionsInternal();
    connections[connection.key] = { connected: true, ...connection };
    await this._globalState.update(this.CONNECTIONS_KEY, connections);
  }

  private getConnectionsInternal(): Connections {
    return this._globalState.get(this.CONNECTIONS_KEY, {});
  }
}
