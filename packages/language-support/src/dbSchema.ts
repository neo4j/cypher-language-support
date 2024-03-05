import { Neo4jFunction, Neo4jProcedure } from './types';

export interface DbSchema {
  labels?: string[];
  relationshipTypes?: string[];
  databaseNames?: string[];
  aliasNames?: string[];
  parameters?: Record<string, unknown>;
  propertyKeys?: string[];
  procedures?: Record<string, Neo4jProcedure>;
  functions?: Record<string, Neo4jFunction>;
}
