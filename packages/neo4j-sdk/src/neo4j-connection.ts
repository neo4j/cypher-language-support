import neo4j, { Config, Driver } from 'neo4j-driver';
import { MetadataPoller } from './metadata-poller.js';
import { Database, listDatabases } from './queries/databases.js';

// TODO user agent and proper metadata on background queries
// TODO hold and eval parameters?
export const metadata = {
  metadata: { app: 'neo4j-language-server', type: 'system' },
};

function resolveInitialDatabase(databases: Database[]): string {
  const home = databases.find((d) => d.home);
  const def = databases.find((d) => d.default);
  const system = databases.find((d) => d.name === 'system');
  return home?.name ?? def?.name ?? system?.name ?? databases[0]?.name;
}

export class Neo4jConnection {
  public metadata: MetadataPoller;

  constructor(
    public connectedUser: string,
    public protocolVersion: string,
    databases: Database[],
    public currentDb: string,
    public driver: Driver,
  ) {
    // todo give function to query not driver to poller
    // todo validate connection before repolling?
    // tredje som äger båda
    this.metadata = new MetadataPoller(databases, driver);
  }

  static async initialize(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
  ): Promise<Neo4jConnection> {
    const driver = neo4j.driver(
      url,
      neo4j.auth.basic(credentials.username, credentials.password),
      config.driverConfig,
    );

    await driver.verifyConnectivity();

    if (await driver.supportsSessionAuth()) {
      if (!(await driver.verifyAuthentication())) {
        // @oskar TODO check how this works with first time login for both 4 and 5
        // TODO structured errors
        throw new Error('Invalid credentials');
      }
    }

    const { query, parseResult } = listDatabases();
    const result = await driver.executeQuery(query, {}, { database: 'system' });
    const databases = parseResult(result);

    const protocolVersion =
      result.summary.server.protocolVersion?.toString() ?? 'unknown';

    const currentDb = resolveInitialDatabase(databases);
    if (!currentDb) {
      throw new Error('Connected user has no database access');
    }

    return new Neo4jConnection(
      credentials.username,
      protocolVersion,
      databases,
      currentDb,
      driver,
    );
  }

  async healthcheck() {
    try {
      await this.driver.verifyConnectivity();
      return true;
    } catch (error) {
      return false;
    }
  }

  dispose() {
    void this.driver.close();
  }
}
