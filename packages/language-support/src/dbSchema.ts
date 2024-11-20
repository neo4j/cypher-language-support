import { DbInfo, Neo4jFunction, Neo4jProcedure } from './types';

export interface DbSchema {
  labels?: string[];
  relationshipTypes?: string[];
  currentDatabase?: string;
  dbInfos?: DbInfo[];
  aliasNames?: string[];
  userNames?: string[];
  roleNames?: string[];
  parameters?: Record<string, unknown>;
  propertyKeys?: string[];
  procedures?: Record<string, Neo4jProcedure>;
  functions?: Record<string, Neo4jFunction>;
}
