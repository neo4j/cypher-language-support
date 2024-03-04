import {
  DbSchema,
  Neo4jFunction,
  Neo4jProcedure,
} from '@neo4j-cypher/language-support';
import { SignatureInformation } from 'vscode-languageserver/node';
import { Neo4jConnection } from './neo4jConnection.js';
import { Database, listDatabases } from './queries/databases.js';
import { listFunctions } from './queries/functions.js';
import { listProcedures } from './queries/procedures.js';
import { ExecuteQueryArgs } from './types/sdk-types.js';

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
          const rawFunctions = result.data.functions;
          const signatures = result.data.functions.reduce<
            Record<string, SignatureInformation>
          >((acc, curr) => {
            const { name, argumentDescription, description } = curr;

            acc[name] = SignatureInformation.create(
              name,
              description,
              ...argumentDescription.map((arg) => ({
                label: arg.name,
                documentation: arg.description,
              })),
            );

            return acc;
          }, {});
          this.dbSchema.rawFunctions = rawFunctions;
          this.dbSchema.functionSignatures = signatures;
        }
      },
    });

    this.procedures = new QueryPoller({
      connection,
      queryArgs: listProcedures({ executableByMe: true }),
      onRefetchDone: (result) => {
        if (result.success) {
          const rawProcedures = result.data.procedures;

          const signatures = rawProcedures.reduce<
            Record<string, SignatureInformation>
          >((acc, curr) => {
            const { name, argumentDescription, description } = curr;

            acc[name] = SignatureInformation.create(
              name,
              description,
              ...argumentDescription.map((arg) => ({
                label: arg.name,
                documentation: arg.description,
              })),
            );
            return acc;
          }, {});
          this.dbSchema.rawProcedures = rawProcedures;
          this.dbSchema.procedureSignatures = signatures;
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
