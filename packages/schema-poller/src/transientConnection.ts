import { Config, Driver, QueryConfig } from 'neo4j-driver';
import { initializeDriver } from './initializers/driverIntializer';

export class TransientConnection {
  async testConnection(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
  ): Promise<boolean> {
    let driver: Driver | undefined = undefined;

    try {
      driver = await initializeDriver(url, credentials, config);
    } catch {
      return false;
    } finally {
      await driver?.close();
    }

    return true;
  }

  async executeCommand<T>(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
    query: string,
    queryConfig?: QueryConfig<T>,
  ): Promise<T> {
    let driver: Driver | undefined = undefined;
    let result: T;
    try {
      driver = await initializeDriver(url, credentials, config);
      result = await driver.executeQuery<T>(query, {}, queryConfig);
    } finally {
      await driver?.close();
    }
    return result;
  }
}
