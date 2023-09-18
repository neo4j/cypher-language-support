import { QueryResult } from 'neo4j-driver';
import { SdkQuery } from '../types/sdk-types';

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
};

/**
 * List available databases in your dbms
 * https://neo4j.com/docs/cypher-manual/current/administration/databases/#administration-databases-show-databases
 */
export function listDatabases(): SdkQuery<Database[]> {
  // Syntax holds for v4.3+
  return {
    cypher: 'SHOW DATABASES',
    parseResult: (res: QueryResult) =>
      res.records.map(
        (rec) =>
          // Type is verified in integration tests
          rec.toObject() as Database,
      ),
    dbType: 'system',
  };
}
