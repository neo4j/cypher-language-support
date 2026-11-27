import type {
  Constraint,
  CypherVersion,
  Neo4jFunction,
  Neo4jProcedure,
} from './types.js';

export type Registry<T> = Record<string, T>;
export type ScopedRegistry<T> = Partial<Record<CypherVersion, Registry<T>>>;

/** Display name of the Cypher type of a property value */
export type CypherPropertyName =
  | 'Float'
  | 'null'
  | 'String'
  | 'Bigint'
  | 'Boolean'
  | `List${string}`
  | 'LocalTime'
  | 'Time'
  | 'Date'
  | 'LocalDateTime'
  | 'DateTime'
  | 'Integer'
  | 'Duration'
  | 'Point'
  | 'ByteArray'
  | 'Vector'
  | 'Unknown';

/** Display name of the Cypher type of any value */
export type CypherDataTypeName =
  | CypherPropertyName
  | 'Node'
  | 'Relationship'
  | 'Path'
  | 'Map';

/**
 * A query parameter. `toCypherParameter` from `@neo4j-cypher/query-tools`
 * creates one from a value returned by the neo4j driver.
 */
export interface CypherParameter {
  /**
   * Cypher type of the parameter, used to filter parameter completions.
   * Parameters without a type are suggested everywhere.
   */
  type?: CypherDataTypeName;
  /** The parameter value formatted as a string, shown on hover */
  stringValue?: string;
}

export interface DbSchema {
  labels?: string[];
  relationshipTypes?: string[];
  databaseNames?: string[];
  aliasNames?: string[];
  userNames?: string[];
  roleNames?: string[];
  parameters?: Record<string, CypherParameter>;
  propertyKeys?: string[];
  procedures?: ScopedRegistry<Neo4jProcedure>;
  functions?: ScopedRegistry<Neo4jFunction>;
  defaultLanguage?: CypherVersion;
  graphSchema?: { from: string; to: string; relType: string }[];
  constraintInfo?: {
    fieldNames: string[] | undefined;
    constraints: Constraint[];
  };
}
