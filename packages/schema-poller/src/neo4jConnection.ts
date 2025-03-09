import { Driver, QueryResult } from 'neo4j-driver';
import { version } from '../package.json';
import { Database } from './queries/databases.js';
import { ExecuteQueryArgs, QueryType } from './types/sdkTypes';

const METADATA_BASE = {
  app: 'neo4j-sdk',
  version: version,
};
const RECORD_LIMIT = 5000;

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

type RunCypherQueryArgs = {
  query: string;
  parameters: Record<string, unknown>;
  database?: string;
  abortSignal?: AbortSignal;
};

export type QueryResultWithLimit = QueryResult & { recordLimitHit: boolean };
export class Neo4jConnection {
  public currentDb: string | undefined;

  constructor(
    public connectedUser: string,
    public protocolVersion: string,
    public databases: Database[],
    public driver: Driver,
    database?: string,
  ) {
    this.currentDb = resolveInitialDatabase(databases, database);
  }

  async runCypherQuery({
    query,
    parameters,
    database,
    abortSignal,
  }: RunCypherQueryArgs): Promise<QueryResultWithLimit> {
    // we'd like to use the drivers `executeQuery` method, but it doesn't support transaction metadata or cancelations yet
    const session = this.driver.session({
      database: database ?? this.currentDb,
    });

    if (abortSignal !== undefined) {
      abortSignal.addEventListener('abort', () => {
        void session.close();
      });
    }

    try {
      const result = await session.executeWrite(
        async (tx) => {
          const result = tx.run(query, parameters);

          const records = [];
          let recordLimitHit = false;

          for await (const record of result) {
            if (records.length < RECORD_LIMIT) {
              records.push(record);
            } else {
              recordLimitHit = true;
              break;
            }
          }

          const summary = await result.summary();

          return { records, summary, recordLimitHit };
        },
        {
          metadata: {
            ...METADATA_BASE,
            type: 'user-direct' satisfies QueryType,
          },
        },
      );
      return result;
    } finally {
      await session.close();
    }
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
    void this.driver?.close();
  }
}
