import { resultTransformers } from 'neo4j-driver';
import type { ExecuteQueryArgs } from '../types/sdkTypes.js';

export type Neo4jUser = {
  user: string;
  roles: string[];
  // below are enterprise only
  passwordChangeRequired: string;
  suspended?: boolean;
  home?: string;
};

/**
 * Gets available users in your database
 * https://neo4j.com/docs/cypher-manual/current/administration/access-control/manage-users/#access-control-list-users
 */
export function listUsers(): ExecuteQueryArgs<{
  users: Neo4jUser[];
}> {
  const query = `SHOW USERS`;

  const resultTransformer = resultTransformers.mapped({
    map(record) {
      return record.toObject() as Neo4jUser;
    },
    collect(users, summary) {
      return { users, summary };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: 'system' },
  };
}
