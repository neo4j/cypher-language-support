import { DbSchema } from 'language-support';
import {
  ParameterInformation,
  SignatureInformation,
} from 'vscode-languageserver/node';
import { Neo4jConnection } from './neo4j-connection.js';
import { DataSummary, getDataSummary } from './queries/data-summary.js';
import { Database, listDatabases } from './queries/databases.js';
import { listFunctions, Neo4jFunction } from './queries/functions.js';
import { listProcedures, Procedure } from './queries/procedures.js';
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
  private procedures: QueryPoller<{ procedures: Procedure[] }>;

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
          // todo better parsing
          const signatures = result.data.functions.reduce<
            Record<string, SignatureInformation>
          >((acc, curr) => {
            const { name, signature, description } = curr;

            const [header] = signature.split(') :: ');
            const paramsString = header
              .replace(name, '')
              .replace('(', '')
              .replace(')', '')
              .trim();

            const params: string[] =
              paramsString.length > 0 ? paramsString.split(', ') : [];

            acc[name] = SignatureInformation.create(
              name,
              description,
              ...params.map(this.getParamsInfo),
            );
            return acc;
          }, {});
          this.dbSchema.functionSignatures = signatures;
        }
      },
    });

    // TODO executbale by me only
    // TODO parsing
    this.procedures = new QueryPoller({
      connection,
      queryArgs: listProcedures({ executableByMe: true }),
      onRefetchDone: (result) => {
        if (result.success) {
          const signatures = result.data.procedures.reduce<
            Record<string, SignatureInformation>
          >((acc, curr) => {
            const { name, signature, description } = curr;

            const [header] = signature.split(') :: ');
            const paramsString = header
              .replace(name, '')
              .replace('(', '')
              .replace(')', '')
              .trim();

            const params: string[] =
              paramsString.length > 0 ? paramsString.split(', ') : [];

            acc[name] = SignatureInformation.create(
              name,
              description,
              ...params.map(this.getParamsInfo),
            );
            return acc;
          }, {});
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

  private getParamsInfo = (param: string) => {
    // FIXME: There are cases where this doesn't work:
    // paramslabels :: LIST? OF STRING?,groupByProperties :: LIST? OF STRING?,aggregations = [{*=count},{*=count}] :: LIST? OF MAP?,config = {} :: MAP?
    const [headerInfo] = param.split(' :: ');
    const [paramName] = headerInfo.split(' = ');

    return ParameterInformation.create(paramName, param);
  };

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
