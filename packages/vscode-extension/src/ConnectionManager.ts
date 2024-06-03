import { Memento } from 'vscode';

export class ConnectionManager {
  static globalState: Memento;

  static getConnections(): readonly string[] {
    return this.globalState.keys();
  }

  // TODO - add a type for connection
  static async getConnection(connectionName: string): Promise<{
    connectionName: string;
    scheme: string;
    host: string;
    port: string;
    user: string;
    password: string;
    database: string;
  }> {
    return await this.globalState.get(connectionName);
  }

  // TODO - add a type for connection
  static async setConnection(
    connectionName: string,
    connection: {
      connectionName: string;
      scheme: string;
      host: string;
      port: string;
      user: string;
      password: string;
      database: string;
    },
  ): Promise<void> {
    await this.globalState.update(connectionName, connection);
  }
}
