import neo4j, { Config, Driver } from 'neo4j-driver';

export async function initializeDriver(
  url: string,
  credentials: { username: string; password: string },
  config: { driverConfig?: Config; appName: string },
): Promise<Driver> {
  const driver = neo4j.driver(
    url,
    neo4j.auth.basic(credentials.username, credentials.password),
    { userAgent: config.appName, ...config.driverConfig },
  );

  await driver.verifyConnectivity();

  if (await driver.supportsSessionAuth()) {
    if (!(await driver.verifyAuthentication())) {
      throw new Error('Invalid credentials');
    }
  }

  return driver;
}
