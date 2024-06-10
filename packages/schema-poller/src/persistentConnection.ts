import sha256 from 'crypto-js/sha256';
import { Driver } from 'neo4j-driver';
import { initializeDriver } from './initializers/driverInitializer';
import { ExecuteQueryArgs } from './types/sdkTypes';

export class PersistentConnection {
  private _driver: Driver | undefined | null = undefined;
  private _driverKey: string | undefined = undefined;

  constructor(readonly appName: string) {}

  async ensureConnection(
    url: string,
    credentials: { username: string; password: string },
  ): Promise<boolean> {
    if (
      !this._driver ||
      this.driverRequiresReinitialization(url, credentials)
    ) {
      this._driver = await this.initializeDriver(url, credentials);
    }

    return !!this._driver;
  }

  async executeQuery<T>({ query, queryConfig }: ExecuteQueryArgs<T>) {
    if (!this._driver) {
      throw new Error('No connection to execute query');
    }

    return await this._driver.executeQuery(query, {}, queryConfig);
  }

  async updateConnection(
    url: string,
    credentials: { username: string; password: string },
  ): Promise<void> {
    if (this.driverRequiresReinitialization(url, credentials)) {
      this._driver = await this.initializeDriver(url, credentials);
    }
  }

  async closeConnection(): Promise<void> {
    await this._driver?.close();
    this._driver = undefined;
    this._driverKey = undefined;
  }

  private async initializeDriver(
    url: string,
    credentials: { username: string; password: string },
  ): Promise<Driver | null> {
    try {
      this._driverKey = this.getDriverKey(url, credentials);
      return await initializeDriver(url, credentials, {
        appName: this.appName,
      });
    } catch {
      return null;
    }
  }

  private driverRequiresReinitialization(
    url: string,
    credentials: { username: string; password: string },
  ): boolean {
    return this._driverKey !== this.getDriverKey(url, credentials);
  }

  private getDriverKey(
    url: string,
    credentials: { username: string; password: string },
  ): string {
    return sha256(
      `${url}:${credentials.username}:${credentials.password}`,
    ).toString();
  }
}
