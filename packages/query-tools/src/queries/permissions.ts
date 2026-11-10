import { resultTransformers } from 'neo4j-driver';
import type { ExecuteQueryArgs } from '../types/sdkTypes.js';

export type PollingPermissions = {
  constraints: boolean;
  users: boolean;
  roles: boolean;
};

// Each polling query is allowed by its specific privilege, by the broader
// management privilege that includes it, or by ALL DBMS PRIVILEGES (dbms_actions)
const showUsersActions = ['show_user', 'user_management', 'dbms_actions'];
const showRolesActions = ['show_role', 'role_management', 'dbms_actions'];

type Privilege = { access: string; action: string };

/**
 * A DENY on any of the actions overrides a GRANT,
 * e.g. DENY SHOW USER still blocks SHOW USERS for a role with USER MANAGEMENT
 */
function isAllowed(privileges: Privilege[], actions: string[]): boolean {
  const relevant = privileges.filter((p) => actions.includes(p.action));
  return (
    relevant.some((p) => p.access === 'GRANTED') &&
    !relevant.some((p) => p.access === 'DENIED')
  );
}

/**
 * Investigate what queries we have permission to execute in polling
 */
export function getPermissions(): ExecuteQueryArgs<{
  permissions: PollingPermissions;
}> {
  const query = 'SHOW USER PRIVILEGE';

  const resultTransformer = resultTransformers.mapped({
    map(record) {
      const { access, action } = record.toObject() as Privilege;
      return { access, action };
    },
    collect(privileges, summary) {
      const permissions: PollingPermissions = {
        constraints: privileges.some(
          (p) => p.action === 'constraint' && p.access === 'GRANTED',
        ),
        users: isAllowed(privileges, showUsersActions),
        roles: isAllowed(privileges, showRolesActions),
      };
      return { permissions, summary };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: 'system' },
  };
}
