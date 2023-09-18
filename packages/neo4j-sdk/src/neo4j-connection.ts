import { Driver } from 'neo4j-driver';
import { Database } from './queries/databases.js';

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
  public currentDb: string;

  constructor(
    public connectedUser: string,
    public protocolVersion: string,
    databases: Database[],
    public driver: Driver,
  ) {
    this.currentDb = resolveInitialDatabase(databases);
  }

  async runQuery(query: string, databaseTarget?: string) {
    const result = await this.driver.executeQuery(
      query,
      {},
      { database: databaseTarget ?? this.currentDb },
    );
    return result;
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
