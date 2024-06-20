import { Driver } from 'neo4j-driver';
import { version } from '../package.json';
import { Database } from './queries/databases.js';
import { ExecuteQueryArgs, QueryType } from './types/sdkTypes';

const METADATA_BASE = {
  app: 'neo4j-sdk',
  version: version,
};

function resolveInitialDatabase(
  databases: Database[],
  database?: string,
): string | undefined {
  if (database) {
    return databases.find((d) => d.name === database)?.name;
  }

  const home = databases.find((d) => d.home);
  const def = databases.find((d) => d.default);
  const system = databases.find((d) => d.name === 'system');

  return home?.name ?? def?.name ?? system?.name ?? databases[0]?.name;
}

type SdkQueryArgs = {
  queryType: QueryType;
  abortSignal?: AbortSignal;
};
export class Neo4jConnection {
  public currentDb: string | undefined;

  constructor(
    public connectedUser: string,
    public protocolVersion: string,
    databases: Database[],
    public driver: Driver,
    database?: string,
  ) {
    this.currentDb = resolveInitialDatabase(databases, database);
  }

  async runSdkQuery<T>(
    { query, queryConfig }: ExecuteQueryArgs<T>,
    { queryType, abortSignal }: SdkQueryArgs,
  ) {
    // we'd like to use the drivers `executeQuery` method, but it doesn't support transaction metadata or cancelations yet
    const session = this.driver.session({
      database: queryConfig?.database ?? this.currentDb,
    });

    if (abortSignal !== undefined) {
      abortSignal.addEventListener('abort', () => {
        void session.close();
      });
    }

    try {
      const executeInTransaction =
        queryConfig.routing === 'READ'
          ? session.executeRead.bind(session)
          : session.executeWrite.bind(session);

      return await executeInTransaction(
        async (tx) => {
          const result = tx.run(query, {});
          return await queryConfig.resultTransformer(result);
        },
        { metadata: { ...METADATA_BASE, type: queryType } },
      );
    } finally {
      await session.close();
    }
  }

  async healthcheck() {
    try {
      await this.driver.verifyConnectivity({ database: this.currentDb });
      return true;
    } catch (error) {
      return false;
    }
  }

  dispose() {
    void this.driver.close();
  }
}
