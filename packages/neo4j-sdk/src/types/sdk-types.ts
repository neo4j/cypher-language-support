import type { QueryConfig, QueryResult, ResultSummary } from 'neo4j-driver';

export const FIRST_ELEMENT_ID_VERSION = '5.0.0';

export type BasicNode = {
  id: string;
  labels: string[];
  properties: Record<string, string>;
  propertyTypes: Record<string, string>;
};

export const basicNodeSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    labels: { type: 'array', items: { type: 'string' } },
    properties: {
      type: 'object',
      required: [],
      additionalProperties: { type: 'string' },
    },
    propertyTypes: {
      type: 'object',
      required: [],
      additionalProperties: { type: 'string' },
    },
  },
  required: ['id', 'labels', 'properties', 'propertyTypes'],
} as const;

export type BasicRelationship = {
  id: string;
  startNodeId: string;
  endNodeId: string;
  type: string;
  properties: Record<string, string>;
  propertyTypes: Record<string, string>;
};

export const basicRelationshipSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    startNodeId: { type: 'string' },
    endNodeId: { type: 'string' },
    type: { type: 'string' },
    properties: {
      type: 'object',
      required: [],
      additionalProperties: { type: 'string' },
    },
    propertyTypes: {
      type: 'object',
      required: [],
      additionalProperties: { type: 'string' },
    },
  },
  required: [
    'id',
    'startNodeId',
    'endNodeId',
    'type',
    'properties',
    'propertyTypes',
  ],
} as const;

export type BasicNodesAndRels = {
  nodes: BasicNode[];
  relationships: BasicRelationship[];
};

export const basicNodesAndRelsSchema = {
  properties: {
    relationships: {
      type: 'array',
      items: {
        basicRelationshipSchema,
      },
    },
    nodes: {
      type: 'array',
      items: {
        basicNodeSchema,
      },
    },
  },
  type: 'object',
  required: ['nodes', 'relationships'],
};

export type DeduplicatedBasicNodesAndRels = {
  nodes: BasicNode[];
  relationships: BasicRelationship[];
  limitHit?: boolean;
};

export type BaseArguments = {
  queryCypher: (query: string) => Promise<QueryResult>;
  neo4jVersion: string;
};

export type ReturnDescription = {
  name: string;
  description: string;
  type: Neo4jStringType;
};

// we could parse this string for better types in the future
export type Neo4jStringType = string;
export type ArgumentDescription = ReturnDescription & { default?: string };

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
