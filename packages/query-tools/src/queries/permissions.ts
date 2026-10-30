import { resultTransformers } from 'neo4j-driver';
import type { ExecuteQueryArgs } from '../types/sdkTypes.js';

/**
 * Investigate what queries we have permission to execute in polling
 */
export function getPermissions(): ExecuteQueryArgs<{
  permissions: { constraints: boolean };
}> {
  const query = 'SHOW USER PRIVILEGE';

  const resultTransformer = resultTransformers.mapped({
    map(record) {
      const obj = record.toObject();
      if (obj.action === 'constraint' && obj.access === 'GRANTED') {
        return { constraints: true };
      }
      return {};
    },
    collect(privileges, summary) {
      const permissions = { constraints: false };
      for (const privilege of privileges) {
        if (privilege.constraints) {
          permissions.constraints = privilege.constraints;
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
