import { CypherVersion, Neo4jFunction, Neo4jProcedure } from './types';

export type Registry<T> = Record<string, T>;
type ScopedRegistry<T> = Partial<Record<CypherVersion, Registry<T>>>;

export interface DbSchema {
  labels?: string[];
  relationshipTypes?: string[];
  databaseNames?: string[];
  aliasNames?: string[];
  userNames?: string[];
  roleNames?: string[];
  parameters?: Record<string, unknown>;
  propertyKeys?: string[];
  procedures?: ScopedRegistry<Neo4jProcedure>;
  functions?: ScopedRegistry<Neo4jFunction>;
  defaultLanguage?: CypherVersion;
}
