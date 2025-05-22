import { resultTransformers } from 'neo4j-driver';
import { ExecuteQueryArgs } from '../types/sdkTypes';

export function getCypherVersions(): ExecuteQueryArgs<{
  languageVersions: string[] | undefined;
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
          return { languageVersions: row.versions, summary };
        }
      });
      return { languageVersions: ['5'], summary };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: 'system' },
  };
}
