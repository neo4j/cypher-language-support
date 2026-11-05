import { resultTransformers } from 'neo4j-driver';
import type { ExecuteQueryArgs } from '../types/sdkTypes.js';

/**
 * Check what queries we have permission to execute in polling
 */
export function getPermissions(): ExecuteQueryArgs<{
  permissions: { constraints: boolean };
}> {
  const query = 'SHOW USER PRIVILEGE';

  const resultTransformer = resultTransformers.mapped({
    collect(records, summary) {
      const permissions = { constraints: false };
      for (const record of records) {
        const obj = record.toObject();
        if (obj.action === 'constraint' && obj.access === 'GRANTED') {
          permissions.constraints = true;
        }
      }
      return { permissions, summary };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: 'system' },
  };
}
