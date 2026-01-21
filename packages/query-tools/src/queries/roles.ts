import { resultTransformers } from 'neo4j-driver';
import type { ExecuteQueryArgs } from '../types/sdkTypes.js';

export type Neo4jRole = {
  role: string;
};

/**
 * Gets available roles in your database
 * https://neo4j.com/docs/operations-manual/current/authentication-authorization/manage-roles/#access-control-list-roles
 */
export function listRoles(): ExecuteQueryArgs<{
  roles: Neo4jRole[];
}> {
  const query = `SHOW ROLES`;

  const resultTransformer = resultTransformers.mapped({
    map(record) {
      return record.toObject() as Neo4jRole;
    },
    collect(roles, summary) {
      return { roles, summary };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: 'system' },
  };
}
