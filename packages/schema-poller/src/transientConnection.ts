import { Config, Driver } from 'neo4j-driver';
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
}
