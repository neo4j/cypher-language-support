import { DbSchema } from 'language-support';
import { Driver, QueryResult } from 'neo4j-driver';
import {
  ParameterInformation,
  SignatureInformation,
} from 'vscode-languageserver/node';
import { DataSummary, getDataSummary } from './queries/data-summary.js';
import { Database, listDatabases } from './queries/databases.js';
import { listFunctions, Neo4jFunction } from './queries/functions.js';
import { listProcedures, Procedure } from './queries/procedures.js';

type PollingStatus = 'not-started' | 'fetching' | 'fetched' | 'error';

type FetchCallback<T> = (
  result: { success: true; data: T } | { success: false; errorMessage: string },
) => void;

type PollerConfig<T> = {
  queryConfig: { query: string; parseResult: (result: QueryResult) => T };
  driver: Driver;
  prefetchedData?: T;
  onRefetchDone?: FetchCallback<T>;
};

class QueryPoller<T> {
  public status: PollingStatus = 'not-started';
  public data?: T;
  public lastFetchStart?: number;
  public errorMessage?: string;
  private query: string;
  private parseResult: (result: QueryResult) => T;
  private driver: Driver;
  private onRefetchDone?: FetchCallback<T>;

  constructor({
    prefetchedData,
    queryConfig,
    driver,
    onRefetchDone,
  }: PollerConfig<T>) {
    this.driver = driver;
    this.query = queryConfig.query;
    this.parseResult = queryConfig.parseResult;

    if (onRefetchDone) {
      this.onRefetchDone = onRefetchDone;
    }

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
      const result = await this.driver.executeQuery(
        this.query,
        {},
        { database: 'system' },
      );

      const data = this.parseResult(result);
      this.data = data;
      this.status = 'fetched';
      this.onRefetchDone?.({ success: true, data });
    } catch (e) {
      const errorMessage = String(e);
      this.errorMessage = errorMessage;
      this.status = 'error';
      this.onRefetchDone?.({ success: false, errorMessage });
    }
  }
}

export class MetadataPoller {
  private databases: QueryPoller<Database[]>;
  private dataSummary: QueryPoller<DataSummary>;
  private functions: QueryPoller<Neo4jFunction[]>;
  private procedures: QueryPoller<Procedure[]>;

  private dbPollingInterval: NodeJS.Timer | undefined;

  public dbSchema: DbSchema = {};

  constructor(databases: Database[], driver: Driver) {
    this.databases = new QueryPoller({
      driver,
      queryConfig: listDatabases(),
      prefetchedData: databases,
      onRefetchDone: (result) => {
        if (result.success) {
          this.dbSchema.databaseNames = result.data.flatMap((db) => db.name);
          this.dbSchema.aliasNames = result.data.flatMap(
            (db) => db.aliases ?? [],
          );
        }
      },
    });

    this.dataSummary = new QueryPoller({
      driver,
      queryConfig: getDataSummary(),
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
      driver,
      queryConfig: listFunctions(),
      onRefetchDone: (result) => {
        if (result.success) {
          // todo better parsing
          const signatures = result.data.reduce<
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
      driver,
      queryConfig: listProcedures(),
      onRefetchDone: (result) => {
        if (result.success) {
          const signatures = result.data.reduce<
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

  startBackgroundPolling(intervalSeconds = 20) {
    this.stopBackgroundPolling();
    this.dbPollingInterval = setInterval(
      () => void this.fetchDbSchema(),
      intervalSeconds * 1000,
    );
  }
}
