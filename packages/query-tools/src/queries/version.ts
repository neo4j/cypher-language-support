import { resultTransformers } from 'neo4j-driver';
import type { ExecuteQueryArgs } from '../types/sdkTypes.js';

/**
 * Get dbms version and edition
 */
export function getVersion(): ExecuteQueryArgs<{
  serverVersion: string | undefined;
  serverEdition: string | undefined;
}> {
  const query = 'CALL dbms.components() YIELD name, versions, edition';

  const resultTransformer = resultTransformers.mapped({
    map(record) {
      const obj = record.toObject();
      const name = obj.name as string;
      const versions = obj.versions as string[];
      const edition = obj.edition as string;
      return { name, versions, edition };
    },
    collect(rows, summary) {
      for (const row of rows) {
        if (row.name === 'Neo4j Kernel') {
          return {
            serverVersion: row.versions[0],
            serverEdition: row.edition,
            summary,
          };
        }
      }

      //We should not reach this unless the "name" field changes
      return { serverVersion: undefined, serverEdition: undefined, summary };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: 'system' },
  };
}
