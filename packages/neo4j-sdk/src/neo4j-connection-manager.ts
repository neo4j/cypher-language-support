import neo4j, { Config, Driver, Session } from 'neo4j-driver';
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

const pollingMethods = {
  databases: listDatabases,
  dataSummary: getDataSummary,
} as const;
type PolledData = keyof typeof pollingMethods;

type Polled<T> =
  | { state: 'not-started' }
  | { state: 'fetching'; startedAt: number; oldData?: T }
  | { state: 'fetched'; data: T }
  | { state: 'error'; errorMessage: string };

export class Neo4jConnectionManager {
  private databases: Polled<Database[]>;
  private dataSummary: Polled<DataSummary> = { state: 'not-started' };

  private dbPollingInterval: NodeJS.Timer | undefined;

  public dbSchema: DbSchema = {};
  constructor(
    public connectedUser: string,
    public protocolVersion: string,
    databases: Database[],
    public currentDb: string,
    public driver: Driver,
  ) {
    this.databases = { state: 'fetched', data: databases };
  }

  static async initialize(
    url: string,
    credentials: { username: string; password: string },
    config: { driverConfig?: Config; appName: string },
  ): Promise<Neo4jConnectionManager> {
    const driver = neo4j.driver(
      url,
      neo4j.auth.basic(credentials.username, credentials.password),
      config.driverConfig,
    );

    await driver.verifyConnectivity();

    if (await driver.supportsSessionAuth()) {
      if (!(await driver.verifyAuthentication())) {
        // @oskar TODO check how this works with first time login for both 4 and 5
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
      throw new Error('Connected user has no database access ');
    }

    return new Neo4jConnectionManager(
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

  private async fetchDbs() {
    // last fetch not done yet
    if (this.databases.state === 'fetching') return;

    this.databases = {
      state: 'fetching',
      startedAt: Date.now(),
      oldData: 'data' in this.databases ? this.databases.data : undefined,
    };

    const { query, parseResult } = listDatabases();
    try {
      const result = await this.driver.executeQuery(
        query,
        {},
        { database: 'system' },
      );

      this.databases = {
        state: 'fetched',
        data: parseResult(result),
      };
    } catch (e) {
      this.databases = {
        state: 'error',
        errorMessage: String(e),
      };
    } finally {
      this.updateSchema('aliasNames');
      this.updateSchema('databaseNames');
    }
  }

  private async polldb<T>(datatype: PolledData) {
    const previousState = this[datatype] as Polled<T>;
    if (previousState.state === 'fetching') return;

    this[datatype] = {
      state: 'fetching',
      startedAt: Date.now(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      oldData:
        'data' in previousState ? previousState.data : (undefined as any),
    };

    const { query, parseResult } = pollingMethods[datatype]();
    try {
      const result = await this.driver.executeQuery(
        query,
        {},
        { database: 'system' },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this[datatype] = { state: 'fetched', data: parseResult(result) as any };
    } catch (e) {
      this[datatype] = {
        state: 'error',
        errorMessage: String(e),
      };
    }
  }

  private updateSchema(
    schemaKey: 'databaseNames' | 'aliasNames' /*keyof DbSchema */,
  ) {
    const schemaMapping = {
      databaseNames: {
        dbData: this.databases,
        accessor: (dbs: Database[]) => dbs.flatMap((db) => db.name),
      },
      aliasNames: {
        dbData: this.databases,
        accessor: (dbs: Database[]) => dbs.flatMap((db) => db.aliases ?? []),
      },
    };

    const { dbData, accessor } = schemaMapping[schemaKey];

    if (dbData.state === 'not-started' || dbData.state === 'error') {
      this.dbSchema[schemaKey] = undefined;
    }

    if (dbData.state === 'fetched') {
      this.dbSchema[schemaKey] = accessor(dbData.data);
    }
  }

  async fetchDbSchema() {
    return await Promise.allSettled([
      this.polldb('databases'),
      this.polldb('dataSummary'),
    ]);
  }

  dispose() {
    void this.driver.close();
  }

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

import {
  ParameterInformation,
  SignatureInformation,
} from 'vscode-languageserver/node';

import { DbSchema } from 'language-support';
import { session } from 'neo4j-driver';
import { DataSummary, getDataSummary } from './queries/data-summary.js';
export class DbSchemaImpl implements DbSchema {
  public procedureSignatures: Record<string, SignatureInformation> = {};
  public functionSignatures: Record<string, SignatureInformation> = {};
  public labels: string[] = [];
  public relationshipTypes: string[] = [];
  public aliasNames: string[] = [];
  public databaseNames: string[] = [];
  public parameterNames: string[] = [];
  public propertyKeys: string[] = [];
  private dbPollingInterval: NodeJS.Timer | undefined;

  private neo4j: Driver | undefined;

  public stopPolling(): void {
    clearInterval(this.dbPollingInterval);
    this.dbPollingInterval = undefined;
  }

  public async startSignaturesPolling() {
    this.stopPolling();

    if (!this.neo4j) return;
    // We do not need to update procedures and functions because they are cached
    const updateAllDbSchema = async () => {
      await Promise.allSettled([
        this.updateLabels(),
        this.updateRelationshipTypes(),
        this.updatePropertyKeys(),
        this.updateMethodsCache(this.procedureSignatures),
        this.updateMethodsCache(this.functionSignatures),
      ]);
    };

    await updateAllDbSchema();

    this.dbPollingInterval = setInterval(() => void updateAllDbSchema(), 20000);
    return;
  }

  private getParamsInfo = (param: string) => {
    // FIXME: There are cases where this doesn't work:
    // paramslabels :: LIST? OF STRING?,groupByProperties :: LIST? OF STRING?,aggregations = [{*=count},{*=count}] :: LIST? OF MAP?,config = {} :: MAP?
    const [headerInfo] = param.split(' :: ');
    const [paramName] = headerInfo.split(' = ');

    return ParameterInformation.create(paramName, param);
  };

  private async updatePropertyKeys() {
    if (!this.neo4j) return;

    try {
      const result = await this.neo4j.executeQuery('call db.propertyKeys()', {
        session: session.READ,
      });

      this.databaseNames = result.records.map(
        (record) => record.get('propertyKey') as string,
      );
    } catch (error) {
      console.warn('failed to fetch propertyKeys: ' + String(error));
    }
  }

  private async updateLabels() {
    if (!this.neo4j) return;
    const s: Session = this.neo4j.session({ defaultAccessMode: session.WRITE });

    try {
      const result = await s.run('CALL db.labels()');
      this.labels = result.records.map(
        (record) => record.get('label') as string,
      );
    } catch (error) {
      console.warn('could not contact the database to fetch labels');
    } finally {
      await s.close();
    }
  }
  private async updateRelationshipTypes() {
    if (!this.neo4j) return;
    const s: Session = this.neo4j.session({ defaultAccessMode: session.WRITE });

    try {
      const result = await s.run('CALL db.relationshipTypes()');
      this.relationshipTypes = result.records.map(
        (record) => record.get('relationshipType') as string,
      );
    } catch (error) {
      console.warn(
        'could not contact the database to fetch relationship types',
      );
    } finally {
      await s.close();
    }
  }

  private async updateMethodsCache(
    cache: Record<string, SignatureInformation>,
  ) {
    if (!this.neo4j) return;
    const s: Session = this.neo4j.session({ defaultAccessMode: session.WRITE });
    const updateTarget =
      cache === this.functionSignatures ? 'functions' : 'procedures';

    try {
      const result = await s.run(
        'SHOW ' +
          updateTarget +
          ' EXECUTABLE BY CURRENT USER yield name, signature, description;',
      );

      result.records.map((record) => {
        const methodName = record.get('name') as string;
        const signature = record.get('signature') as string;
        const description = record.get('description') as string;

        const [header] = signature.split(') :: ');
        const paramsString = header
          .replace(methodName, '')
          .replace('(', '')
          .replace(')', '')
          .trim();

        const params: string[] =
          paramsString.length > 0 ? paramsString.split(', ') : [];

        cache[methodName] = SignatureInformation.create(
          methodName,
          description,
          ...params.map(this.getParamsInfo),
        );
      });
    } catch (error) {
      console.warn('could not contact the database to fetch ' + updateTarget);
    } finally {
      await s.close();
    }
  }
}
