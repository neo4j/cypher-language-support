import { resultTransformers } from 'neo4j-driver';
import type { YieldableShowCommand } from '@neo4j-cypher/language-support';
import type { ExecuteQueryArgs } from '../types/sdkTypes.js';

const showCommands: Record<YieldableShowCommand, string> = {
  constraints: 'SHOW CONSTRAINTS',
  users: 'SHOW USERS',
  roles: 'SHOW ROLES',
  databases: 'SHOW DATABASES',
};

/**
 * List YIELDable fields available on a SHOW command, or returns undefined if the command returns no rows.
 * Constraints are listed on the given database, the other commands run against the system database.
 */
export function listYieldFields(
  showCommand: YieldableShowCommand,
  currentDb: string,
): ExecuteQueryArgs<{
  fieldNames: string[] | undefined;
}> {
  const query = `${showCommands[showCommand]} YIELD * LIMIT 1`;

  const resultTransformer = resultTransformers.mapped({
    map(record) {
      const fieldNames: string[] = record.keys.map((x) => x.toString());
      return fieldNames;
    },
    collect(fieldNames, summary) {
      return {
        fieldNames: fieldNames[0],
        summary,
      };
    },
  });

  return {
    query,
    queryConfig: {
      resultTransformer,
      routing: 'READ',
      database: showCommand === 'constraints' ? currentDb : 'system',
    },
  };
}
