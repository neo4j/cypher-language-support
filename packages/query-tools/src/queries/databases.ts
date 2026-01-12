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

  const resultTransformer = resultTransformers.mapped({
    map(record) {
      const obj = record.toObject();
      if (obj.defaultLanguage) {
        obj.defaultLanguage = (obj.defaultLanguage as string).toUpperCase();
      }
      return obj as Database;
    },
    collect(databases, summary) {
      const instancesRecord: Record<string, Database> = databases.reduce<
        Record<string, Database>
      >((acc, db) => {
        const instanceId: string = `${db.name}@${db.address}`;
        acc[instanceId] = db;
        return acc;
      }, {});
      const logicalDatabases: Record<string, Database> =
        getLogicalDatabases(instancesRecord);
      const dbs: Database[] = Object.values(logicalDatabases);

      return {
        databases: sortDatabases(dbs),
        summary,
      };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: 'system' },
  };
}

/**
 * In clustered environments a single logical database can be backed by multiple physical database instances
 * running on a different servers.
 * This function returns a record of logical databases.
 * A database instance is uniquely identified by its name and address.
 * A logical database is uniquely identified by its name.
 * @input instances - a record of database instances
 * @output a record of logical databases
 */
export function getLogicalDatabases(
  instances: Record<string, Database>,
): Record<string, Database> {
  // Two databases with the same name but different properties will be merged into one
  // merging rules:
  // - if writer (leader) is present, use it, otherwise use the first one

  // Merge db2 into db1
  const mergeDatabases = (db1: Database, db2: Database): Database => {
    let mergedDatabase = { ...db1 };
    if (db2.role === 'leader' || db2.writer === true) {
      mergedDatabase = { ...db2 };
    }

    return mergedDatabase;
  };

  return Object.values(instances).reduce<Record<string, Database>>(
    (databases, instance) => {
      const key = instance.name;
      const existingDatabase = databases[key];
      const mergedDatabase = existingDatabase
        ? mergeDatabases(existingDatabase, instance)
        : instance;

      return {
        ...databases,
        [key]: mergedDatabase,
      };
    },
    {},
  );
}

export function sortDatabases(databases: Database[]) {
  function databaseComparator(a: Database, b: Database) {
    // disable eslint to make code more readable
    /* eslint-disable curly */
    // home is greater than default
    if (a.default && b.home) return 1;

    // otherwiser default is greater than anything else
    if (a.default) return -1;
    if (b.default) return 1;

    // system is less than anything else
    if (a.name === 'system') return 1;
    if (b.name === 'system') return -1;
    /* eslint-enable curly */

    // else sort alphabetically
    return a.name.localeCompare(b.name);
  }

  return databases.sort(databaseComparator);
}
