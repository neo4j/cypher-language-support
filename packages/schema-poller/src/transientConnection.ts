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

  // async queryDatabases(
  //   url: string,
  //   credentials: { username: string; password: string },
  //   config: { driverConfig?: Config; appName: string },
  // ) {
  //   const driver = await initializeDriver(url, credentials, config);

  //   const { query: databaseQuery, queryConfig: databaseQueryConfig } =
  //     listDatabases();
  //   const { databases } = await driver.executeQuery(
  //     databaseQuery,
  //     {},
  //     databaseQueryConfig,
  //   );

  //   // const { query: summaryQuery, queryConfig: summaryQueryConfig } =
  //   //   getDataSummary();
  //   // const { labels, propertyKeys, relationshipTypes } =
  //   //   await driver.executeQuery(summaryQuery, {}, summaryQueryConfig);

  //   await driver.close();

  //   return { databases };
  // }

  // async queryDatabaseSummary()
}
