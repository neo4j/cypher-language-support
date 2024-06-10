import {
  DbSchema,
  Neo4jFunction,
  Neo4jProcedure,
} from '@neo4j-cypher/language-support';
import { EventEmitter } from 'events';
import { Neo4jConnection } from './neo4jConnection.js';
import {
  Database,
  listDatabases,
  Neo4jDatabases,
} from './queries/databases.js';
import { getDataSummary, Neo4jDataSummary } from './queries/dataSummary.js';
import { listFunctions, Neo4jFunctions } from './queries/functions.js';
import { listProcedures, Neo4jProcedures } from './queries/procedures.js';
import { listRoles, Neo4jRoles } from './queries/roles.js';
import { listUsers, Neo4jUsers } from './queries/users.js';
import { ExecuteQueryArgs } from './types/sdkTypes.js';

export type PollingStatus = 'not-started' | 'fetching' | 'fetched' | 'error';

export enum PollingEvent {
  POLLING_REFETCHED_DONE = 'POLLING_REFETCHED_DONE',
}

type FetchCallback<T> = (
  result: { success: true; data: T } | { success: false; errorMessage: string },
) => void;

type PollerConfig<T> = {
  queryArgs: ExecuteQueryArgs<T>;
  connection: Neo4jConnection;
  prefetchedData?: T;
  eventEmitter: EventEmitter;
  onRefetchDone?: FetchCallback<T>;
  database?: string;
  eventName?: string;
};

class QueryPoller<T> {
  public status: PollingStatus = 'not-started';
  public data?: T;
  public lastFetchStart?: number;
  public errorMessage?: string;
  private connection: Neo4jConnection;
  private eventEmitter: EventEmitter;
  private onRefetchDone?: FetchCallback<T>;
  private queryArgs: ExecuteQueryArgs<T>;

  constructor({
    prefetchedData,
    queryArgs,
    connection,
    eventEmitter,
    onRefetchDone,
  }: PollerConfig<T>) {
    this.connection = connection;
    this.queryArgs = queryArgs;
    this.eventEmitter = eventEmitter;
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
      this.eventEmitter.emit(PollingEvent.POLLING_REFETCHED_DONE, data);
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
  private databases: QueryPoller<Neo4jDatabases>;
  private dataSummary: QueryPoller<Neo4jDataSummary>;
  private functions: QueryPoller<Neo4jFunctions>;
  private procedures: QueryPoller<Neo4jProcedures>;
  private users: QueryPoller<Neo4jUsers>;
  private roles: QueryPoller<Neo4jRoles>;
  private dbPollingInterval: NodeJS.Timer | undefined;

  public dbSchema: DbSchema = {};

  constructor(
    databases: Database[],
    connection: Neo4jConnection,
    eventEmitter: EventEmitter,
  ) {
    this.databases = new QueryPoller({
      connection,
      queryArgs: listDatabases(),
      prefetchedData: { databases },
      eventEmitter: eventEmitter,
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
      eventEmitter: eventEmitter,
      onRefetchDone: (result) => {
        if (result.success) {
          this.dbSchema.userNames = result.data.users.map((user) => user.user);
        }
      },
    });

    this.roles = new QueryPoller({
      connection,
      queryArgs: listRoles(),
      eventEmitter: eventEmitter,
      onRefetchDone: (result) => {
        if (result.success) {
          this.dbSchema.roleNames = result.data.roles.map((role) => role.role);
        }
      },
    });

    this.dataSummary = new QueryPoller({
      connection,
      queryArgs: getDataSummary(connection.currentDb),
      eventEmitter: eventEmitter,
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
      eventEmitter: eventEmitter,
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
      eventEmitter: eventEmitter,
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
