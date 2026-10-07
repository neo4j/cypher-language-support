import type { Neo4jConnection } from '../../neo4jConnection.js';
import type { ExecuteQueryArgs } from '../../types/sdkTypes.js';

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

export class QueryPoller<T> {
  public status: PollingStatus = 'not-started';
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
      this.status = 'fetched';
    }
  }

  async refetch() {
    if (this.status === 'fetching') return;

    this.status = 'fetching';

    try {
      const data = await this.connection.runSdkQuery(this.queryArgs, {
        queryType: 'system',
      });
      this.status = 'fetched';
      this.onRefetchDone?.({ success: true, data });
    } catch (e) {
      const errorMessage = String(e);
      this.status = 'error';
      this.onRefetchDone?.({ success: false, errorMessage });
    }
  }
}
