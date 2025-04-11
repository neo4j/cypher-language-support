import type { QueryConfig, ResultSummary } from 'neo4j-driver';

export type DbType = 'system' | 'standard' | 'composite';

export type QueryType =
  // Query automatically run by the app.
  | 'system'
  // Query the user directly submitted to/through the app.
  | 'user-direct'
  // Query resulting from an action the user performed.
  | 'user-action'
  // Query that has been derived from the user input.
  | 'user-transpiled';

export type CypherTransactionMetadata = {
  app: 'neo4j-sdk';
  type: QueryType;
  version?: string;
};

export type ExtendedQueryConfig<T> = QueryConfig<T> &
  Required<Pick<QueryConfig<T>, 'routing' | 'resultTransformer'>>;

type Result<T> = T & { summary: ResultSummary };

export type ExecuteQueryArgs<T> = {
  query: string;
  queryConfig: ExtendedQueryConfig<Result<T>>;
};
