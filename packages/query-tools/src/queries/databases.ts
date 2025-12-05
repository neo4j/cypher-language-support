import type { CypherVersion } from '@neo4j-cypher/language-support';
import { resultTransformers } from 'neo4j-driver';
import { ExecuteQueryArgs } from '../types/sdkTypes';

export type DatabaseStatus =
  | 'online'
  | 'offline'
  | 'starting'
  | 'stopping'
  | 'store copying'
  | 'initial'
  | 'dirty'
  | 'quarantined'
  | 'unknown'
  | 'dropped'
  | 'deallocating';

export type Database = {
  name: string;
  address: string;
  role: string;
  requestedStatus: DatabaseStatus;
  currentStatus: DatabaseStatus;
  statusMessage?: string;
  error: string;
  default: boolean;
  home: boolean;
  aliases?: string[]; // introduced in neo4j 4.4
  type?: 'system' | 'composite' | 'standard'; // introduced in neo4j 5
  // "new keys", not sure which version introduced
  writer?: boolean;
  access?: string;
  constituents?: string[];
  defaultLanguage?: CypherVersion;
};

/**
 * List available databases in your dbms
 * https://neo4j.com/docs/cypher-manual/current/administration/databases/#administration-databases-show-databases
 */
export function listDatabases(): ExecuteQueryArgs<{
  databases: Database[];
}> {
  const query = 'SHOW DATABASES YIELD *';

  const resultTransformer = resultTransformers.mappedResultTransformer({
    map(record) {
      const obj = record.toObject();
      if (obj.defaultLanguage) {
        obj.defaultLanguage = (obj.defaultLanguage as string).toUpperCase();
      }
      return obj as Database;
    },
    collect(databases, summary) {
      return {
        databases: databases.filter((x) => x?.writer === true),
        summary,
      };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: 'system' },
  };
}
