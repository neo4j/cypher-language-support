import type { CypherVersion } from '@neo4j-cypher/language-support';
import {
  allCypherVersions,
  DbSchema,
  Neo4jFunction,
  Neo4jProcedure,
} from '@neo4j-cypher/language-support';
import { EventEmitter } from 'events';
import { Neo4jConnection } from './neo4jConnection.js';
import { Database, listDatabases } from './queries/databases.js';
import { DataSummary, getDataSummary } from './queries/dataSummary.js';
import { listFunctions } from './queries/functions.js';
import { listProcedures } from './queries/procedures.js';
import { listRoles, Neo4jRole } from './queries/roles.js';
import { listUsers, Neo4jUser } from './queries/users.js';
import { ExecuteQueryArgs } from './types/sdkTypes.js';
import { listGraphSchema } from './queries/graphSchema.js';

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

export abstract class MetadataPoller {
  public dbSchema: DbSchema = {};
  abstract stopBackgroundPolling(): void;
  abstract startBackgroundPolling(intervalSeconds?: number): void;
}

export class DisconnectedMetadataPoller extends MetadataPoller {
  public dbSchema: DbSchema = {};
  constructor(parameters: Record<string, unknown>) {
    super();
    this.dbSchema.parameters = parameters;
  }
  stopBackgroundPolling() {}
  startBackgroundPolling() {}
}

export class ConnectedMetadataPoller extends MetadataPoller {
  private databases: QueryPoller<{ databases: Database[] }>;
  private dataSummary: QueryPoller<DataSummary>;
  private functions: Partial<
    Record<CypherVersion, QueryPoller<{ functions: Neo4jFunction[] }>>
  > = {};
  private procedures: Partial<
    Record<CypherVersion, QueryPoller<{ procedures: Neo4jProcedure[] }>>
  > = {};
  private users: QueryPoller<{ users: Neo4jUser[] }>;
  private roles: QueryPoller<{ roles: Neo4jRole[] }>;
  private graphSchema: QueryPoller<{
    graphSchema: { from: string; to: string; relType: string }[];
  }>;
  private dbPollingInterval: NodeJS.Timeout | undefined;

  public dbSchema: DbSchema = {};

  constructor(
    databases: Database[],
    parameters: Record<string, unknown>,
    serverCypherVersions: string[] | undefined,
    private readonly connection: Neo4jConnection,
    private readonly events: EventEmitter,
  ) {
    super();

    this.dbSchema.parameters = parameters;

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
          const dbs = result.data.databases;
          const currentDb = dbs.find(
            (db) => db.name === this.connection.currentDb,
          );
          if (currentDb) {
            this.dbSchema.defaultLanguage = currentDb.defaultLanguage;
          }
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

    this.graphSchema = new QueryPoller({
      connection,
      queryArgs: listGraphSchema(connection.currentDb),
      onRefetchDone: (result) => {
        if (result.success) {
          const { graphSchema } = result.data;
          this.dbSchema.graphSchema = graphSchema;
        }
      },
    });

    this.dataSummary = new QueryPoller({
      connection,
      queryArgs: getDataSummary(connection.currentDb),
      onRefetchDone: (result) => {
        if (result.success) {
          const { labels, propertyKeys, relationshipTypes } = result.data;
          this.dbSchema.labels = labels;
          this.dbSchema.propertyKeys = propertyKeys;
          this.dbSchema.relationshipTypes = relationshipTypes;
        }
      },
    });

    const versions: (CypherVersion | undefined)[] =
      serverCypherVersions?.includes('25') ? allCypherVersions : [undefined];

    versions.forEach((cypherVersion) => {
      const effectiveCypherVersion: CypherVersion = cypherVersion ?? 'CYPHER 5';
      this.procedures[effectiveCypherVersion] = new QueryPoller({
        connection,
        queryArgs: listProcedures({
          executableByMe: true,
          cypherVersion: cypherVersion,
        }),
        onRefetchDone: (result) => {
          if (result.success) {
            const procedures = result.data.procedures.reduce<
              Record<string, Neo4jProcedure>
            >((acc, curr) => {
              const { name } = curr;
              acc[name] = curr;
              return acc;
            }, {});
            if (!this.dbSchema.procedures) {
              this.dbSchema.procedures = {};
            }
            this.dbSchema.procedures[effectiveCypherVersion] = procedures;
          }
        },
      });
      this.functions[effectiveCypherVersion] = new QueryPoller({
        connection,
        queryArgs: listFunctions({
          executableByMe: true,
          cypherVersion: cypherVersion,
        }),
        onRefetchDone: (result) => {
          if (result.success) {
            const functions = result.data.functions.reduce<
              Record<string, Neo4jFunction>
            >((acc, curr) => {
              const { name } = curr;
              acc[name] = curr;
              return acc;
            }, {});
            if (!this.dbSchema.functions) {
              this.dbSchema.functions = {};
            }
            this.dbSchema.functions[effectiveCypherVersion] = functions;
          }
        },
      });
    });
  }

  private async fetchDbSchema(): Promise<void> {
    await Promise.allSettled([
      this.databases.refetch(),
      this.dataSummary.refetch(),
      this.graphSchema.refetch(),
      ...Object.values(this.procedures).map((version) => version?.refetch()),
      ...Object.values(this.functions).map((version) => version?.refetch()),
    ]);
    this.events.emit('schemaFetched');
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
