import { resultTransformers } from 'neo4j-driver';
import type { ExecuteQueryArgs } from '../types/sdkTypes.js';

export type Neo4jPrivilege = {
  access: 'GRANTED' | 'DENIED';
  action: string;
};

/**
 * Lists the privileges of the current user. Users can always list their own
 * privileges, but the command is only supported on enterprise edition.
 * https://neo4j.com/docs/operations-manual/current/authentication-authorization/manage-privileges/
 */
export function listCurrentUserPrivileges(): ExecuteQueryArgs<{
  privileges: Neo4jPrivilege[];
}> {
  const query = 'SHOW USER PRIVILEGES YIELD access, action';

  const resultTransformer = resultTransformers.mapped({
    map(record) {
      return record.toObject() as Neo4jPrivilege;
    },
    collect(privileges, summary) {
      return { privileges, summary };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: 'system' },
  };
}

export type PollingPermissions = {
  users: boolean;
  roles: boolean;
};

// Each SHOW privilege is also implied by its management privilege and by ALL DBMS PRIVILEGES
const SHOW_USER_ACTIONS = ['show_user', 'user_management', 'dbms_actions'];
const SHOW_ROLE_ACTIONS = ['show_role', 'role_management', 'dbms_actions'];

// A deny on any implying privilege blocks the command, even if another one is granted
function isAllowed(privileges: Neo4jPrivilege[], actions: string[]): boolean {
  const relevant = privileges.filter((p) => actions.includes(p.action));
  return (
    relevant.some((p) => p.access === 'GRANTED') &&
    !relevant.some((p) => p.access === 'DENIED')
  );
}

export function getPollingPermissions(
  privileges: Neo4jPrivilege[],
): PollingPermissions {
  return {
    users: isAllowed(privileges, SHOW_USER_ACTIONS),
    roles: isAllowed(privileges, SHOW_ROLE_ACTIONS),
  };
}
