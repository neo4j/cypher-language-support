import { initializeDriver } from '@neo4j-cypher/schema-poller';
import { Driver } from 'neo4j-driver';
import { Connection, getConnectionString } from '../types/connection';

/**
 * Singleton class that manages the database driver
 *
 * Persists a driver for a given connection to avoid reinitializing.
 * Reinitializes the driver if the connection changes.
 */
export class DatabaseDriverManager {
  private static _instance: DatabaseDriverManager;
  private _driver: Driver | undefined | null;
  private _currentDriverConnection: string | undefined;

  static set instance(value: DatabaseDriverManager) {
    DatabaseDriverManager._instance = value;
  }

  static get instance(): DatabaseDriverManager {
    return DatabaseDriverManager._instance;
  }

  async ensureDriver(
    connection: Connection,
    password: string,
  ): Promise<boolean> {
    const driver = await this.acquireDriver(connection, password);
    return !!driver;
  }

  async acquireDriver(
    connection: Connection,
    password: string,
  ): Promise<Driver | null> {
    const url = getConnectionString(connection);
    const credentials = { username: connection.user, password };

    if (
      !this._driver ||
      this.driverRequiresReinitialization(url, credentials)
    ) {
      return await this.initializeDriver(url, credentials);
    }

    return this._driver;
  }

  async updateDriver(connection: Connection, password: string): Promise<void> {
    const url = getConnectionString(connection);
    const credentials = { username: connection.user, password };

    if (this.driverRequiresReinitialization(url, credentials)) {
      this._driver = await this.initializeDriver(url, credentials);
    }
  }

  async closeDriver(): Promise<void> {
    await this._driver?.close();
  }

  private async initializeDriver(
    url: string,
    credentials: { username: string; password: string },
  ): Promise<Driver | null> {
    try {
      this._currentDriverConnection = `${url}:${credentials.username}`;
      return await initializeDriver(url, credentials, {
        appName: 'vscode-extension',
      });
    } catch {
      return null;
    }
  }

  private driverRequiresReinitialization(
    url: string,
    credentials: { username: string; password: string },
  ): boolean {
    return this._currentDriverConnection !== `${url}:${credentials.username}`;
  }
}
