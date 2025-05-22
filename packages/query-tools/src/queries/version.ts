import { resultTransformers } from 'neo4j-driver';
import { ExecuteQueryArgs } from '../types/sdkTypes';

/**
 * Get dbms version
 */
export function getVersion(): ExecuteQueryArgs<{
  serverVersion: string | undefined;
}> {
  const query = 'CALL dbms.components() YIELD versions';

  const resultTransformer = resultTransformers.mappedResultTransformer({
    map(record) {
      const obj = record.toObject();
      const name = obj.name as string;
      const versions = obj.versions as string[];
      return { name, versions };
    },
    collect(rows, summary) {
      rows.forEach((row) => {
        if (row.name === 'Neo4j Kernel') {
          return { serverVersion: row.versions, summary };
        }
      });
      //We should not reach this unless the "name" field changes
      return { serverVersion: undefined, summary };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: 'system' },
  };
}

export function getCypherVersions(): ExecuteQueryArgs<{
  serverCypherVersions: string[] | undefined;
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
      rows.forEach((row) => {
        if (row.name === 'Cypher') {
          return { serverCypherVersions: row.versions, summary };
        }
      });
      return { serverCypherVersions: ['5'], summary };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: 'system' },
  };
}
