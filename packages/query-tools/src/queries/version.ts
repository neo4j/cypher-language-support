import { resultTransformers } from 'neo4j-driver';
import { ExecuteQueryArgs } from '../types/sdkTypes';

export function getCypherVersions(): ExecuteQueryArgs<{
  cypherVersions: string[] | undefined;
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
          return { cypherVersions: row.versions, summary };
        }
      });
      return { cypherVersions: ['5'], summary };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: 'system' },
  };
}
