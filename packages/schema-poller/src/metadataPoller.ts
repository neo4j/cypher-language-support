import {
  DbSchema,
  Neo4jFunction,
  Neo4jProcedure,
} from '@neo4j-cypher/language-support';
import { Neo4jConnection } from './neo4jConnection.js';
import { Database, listDatabases } from './queries/databases.js';
import { DataSummary, getDataSummary } from './queries/dataSummary.js';
import { listFunctions } from './queries/functions.js';
import { listProcedures } from './queries/procedures.js';
import { listRoles, Neo4jRole } from './queries/roles.js';
import { listUsers, Neo4jUser } from './queries/users.js';
import { ExecuteQueryArgs } from './types/sdkTypes.js';

type PollingStatus = 'not-started' | 'fetching' | 'fetched' | 'error';

type FetchCallback<T> = (
  result: { success: true; data: T } | { success: false; errorMessage: string },
) => void;

type PollerConfig<T> = {
  queryArgs: ExecuteQueryArgs<T>;
  connection: Neo4jConnection;
  prefetchedData?: T;
  onRefetchDone?: FetchCallback<T>;
  database?: string;
};

class QueryPoller<T> {
  public status: PollingStatus = 'not-started';
  public data?: T;
  public lastFetchStart?: number;
  public errorMessage?: string;
  private connection: Neo4jConnection;
  private onRefetchDone?: FetchCallback<T>;
  private queryArgs: ExecuteQueryArgs<T>;

  constructor({
    prefetchedData,
    queryArgs,
    connection,
    onRefetchDone,
  }: PollerConfig<T>) {
    this.connection = connection;
    this.queryArgs = queryArgs;
    this.onRefetchDone = onRefetchDone;

    if (prefetchedData) {
      this.data = prefetchedData;
      this.lastFetchStart = Date.now();
      this.status = 'fetched';
    }
  }

  async refetch() {
    if (this.status === 'fetching') return;

    this.status = 'fetching';
    this.lastFetchStart = Date.now();
    delete this.errorMessage;

    try {
      const data = await this.connection.runSdkQuery(this.queryArgs, {
        queryType: 'system',
      });
      this.data = data;
      this.status = 'fetched';
      this.onRefetchDone?.({ success: true, data });
    } catch (e) {
      const errorMessage = String(e);
      this.errorMessage = errorMessage;
      this.status = 'error';
      console.error(e);
      this.onRefetchDone?.({ success: false, errorMessage });
    }
  }
}

export class MetadataPoller {
  private databases: QueryPoller<{ databases: Database[] }>;
  private dataSummary: QueryPoller<DataSummary>;
  private functions: QueryPoller<{ functions: Neo4jFunction[] }>;
  private procedures: QueryPoller<{ procedures: Neo4jProcedure[] }>;
  private users: QueryPoller<{ users: Neo4jUser[] }>;
  private roles: QueryPoller<{ roles: Neo4jRole[] }>;
  private dbPollingInterval: NodeJS.Timer | undefined;

  public dbSchema: DbSchema = {};

  constructor(databases: Database[], connection: Neo4jConnection) {
    this.databases = new QueryPoller({
      connection,
      queryArgs: listDatabases(),
      prefetchedData: { databases },
      onRefetchDone: (result) => {
        if (result.success) {
          this.dbSchema.databaseNames = result.data.databases.flatMap(
            (db) => db.name,
          );
          this.dbSchema.aliasNames = result.data.databases.flatMap(
            (db) => db.aliases ?? [],
          );
        }
      },
    });

    this.users = new QueryPoller({
      connection,
      queryArgs: listUsers(),
      onRefetchDone: (result) => {
        if (result.success) {
          this.dbSchema.userNames = result.data.users.map((user) => user.user);
        }
      },
    });

    this.roles = new QueryPoller({
      connection,
      queryArgs: listRoles(),
      onRefetchDone: (result) => {
        if (result.success) {
          this.dbSchema.roleNames = result.data.roles.map((role) => role.role);
        }
      },
    });

    this.dataSummary = new QueryPoller({
      connection,
      queryArgs: getDataSummary(),
      onRefetchDone: (result) => {
        if (result.success) {
          const { labels, propertyKeys, relationshipTypes } = result.data;
          this.dbSchema.labels = labels;
          this.dbSchema.propertyKeys = propertyKeys;
          this.dbSchema.relationshipTypes = relationshipTypes;
        }
      },
    });

    this.functions = new QueryPoller({
      connection,
      queryArgs: listFunctions({ executableByMe: true }),
      onRefetchDone: (result) => {
        if (result.success) {
          const functions = result.data.functions.reduce<
            Record<string, Neo4jFunction>
          >((acc, curr) => {
            const { name } = curr;
            acc[name] = curr;
            return acc;
          }, {});
          this.dbSchema.functions = functions;
        }
      },
    });

    this.procedures = new QueryPoller({
      connection,
      queryArgs: listProcedures({ executableByMe: true }),
      onRefetchDone: (result) => {
        if (result.success) {
          const procedures = result.data.procedures.reduce<
            Record<string, Neo4jProcedure>
          >((acc, curr) => {
            const { name } = curr;
            acc[name] = curr;
            return acc;
          }, {});
          this.dbSchema.procedures = procedures;
        }
      },
    });
  }

  async fetchDbSchema() {
    return await Promise.allSettled([
      this.databases.refetch(),
      this.dataSummary.refetch(),
      this.procedures.refetch(),
      this.functions.refetch(),
    ]);
  }

  stopBackgroundPolling() {
    clearInterval(this.dbPollingInterval);
    this.dbPollingInterval = undefined;
  }

  startBackgroundPolling(intervalSeconds = 30) {
    this.stopBackgroundPolling();
    void this.fetchDbSchema();
    this.dbPollingInterval = setInterval(
      () => void this.fetchDbSchema(),
      intervalSeconds * 1000,
    );
  }
}
