import { resultTransformers } from 'neo4j-driver';
import { ExecuteQueryArgs } from '../types/sdkTypes';

/**
 * Get dbms version
 */
export function getVersion(): ExecuteQueryArgs<{
  serverVersion: string | undefined;
}> {
  const query = 'CALL dbms.components() YIELD name, versions';

  const resultTransformer = resultTransformers.mappedResultTransformer({
    map(record) {
      const obj = record.toObject();
      const name = obj.name as string;
      const versions = obj.versions as string[];
      return { name, versions };
    },
    collect(rows, summary) {
      for (const row of rows) {
        if (row.name === 'Neo4j Kernel') {
          return { serverVersion: row.versions[0], summary };
        }
      }

      //We should not reach this unless the "name" field changes
      return { serverVersion: undefined, summary };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: 'system' },
  };
}
