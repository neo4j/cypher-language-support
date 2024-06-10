import { Config, Driver } from 'neo4j-driver';
import { initializeDriver } from './driverInitializer';

export async function testConnectionTransiently(
  url: string,
  credentials: { username: string; password: string },
  config: { driverConfig?: Config; appName: string },
) {
  let driver: Driver | undefined = undefined;
  try {
    driver = await initializeDriver(url, credentials, config);
  } catch {
    return false;
  }

  await driver?.close();
  return true;
}
