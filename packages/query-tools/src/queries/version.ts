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
      const versions = obj.versions as string[];
      const version = versions?.at(0);
      return version;
    },
    collect(versions, summary) {
      return { serverVersion: versions.at(0), summary };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: 'system' },
  };
}
