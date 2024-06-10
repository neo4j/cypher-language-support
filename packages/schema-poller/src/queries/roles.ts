import { resultTransformers } from 'neo4j-driver';
import type { ExecuteQueryArgs } from '../types/sdkTypes.js';

export type Neo4jRole = {
  role: string;
};

export type Neo4jRoles = {
  roles: Neo4jRole[];
};

/**
 * Gets available roles in your database
 * https://neo4j.com/docs/operations-manual/current/authentication-authorization/manage-roles/#access-control-list-roles
 */
export function listRoles(): ExecuteQueryArgs<Neo4jRoles> {
  const query = `SHOW ROLES`;

  const resultTransformer = resultTransformers.mappedResultTransformer({
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
