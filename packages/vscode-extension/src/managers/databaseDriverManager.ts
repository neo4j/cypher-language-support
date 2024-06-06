import { initializeDriver } from '@neo4j-cypher/schema-poller';
import { Driver } from 'neo4j-driver';
import { getConnectionString, getCredentials } from '../helpers';
import { Connection } from '../types';

export class DatabaseDriverManager {
  private static _instance: DatabaseDriverManager;
  private _driver: Driver | undefined;
  private _currentDriverConnection: string | undefined;

  public static set instance(value: DatabaseDriverManager) {
    DatabaseDriverManager._instance = value;
  }

  public static get instance(): DatabaseDriverManager {
    return DatabaseDriverManager._instance;
  }

  public async acquireDriver(
    connection: Connection,
  ): Promise<Driver | undefined> {
    const url = getConnectionString(connection);
    const credentials = getCredentials(connection);
    let success: boolean = true;

    if (
      !this._driver ||
      this.driverRequiresReinitialization(url, credentials)
    ) {
      success = await this.initializeDriver(url, credentials);
    }

    return success ? this._driver : undefined;
  }

  public async updateDriver(connection: Connection): Promise<void> {
    const url = getConnectionString(connection);
    const credentials = getCredentials(connection);

    if (this.driverRequiresReinitialization(url, credentials)) {
      await this.initializeDriver(url, credentials);
    }
  }

  private async initializeDriver(
    url: string,
    credentials: { username: string; password: string },
  ): Promise<boolean> {
    try {
      this._driver = await initializeDriver(url, credentials, {
        appName: 'vscode-extension',
      });
      this._currentDriverConnection = `${url}:${credentials.username}`;
    } catch {
      this._driver = undefined;
      return false;
    }

    return true;
  }

  private driverRequiresReinitialization(
    url: string,
    credentials: { username: string; password: string },
  ): boolean {
    return this._currentDriverConnection !== `${url}:${credentials.username}`;
  }
}
