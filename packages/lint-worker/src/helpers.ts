import { compareMajorMinorVersions } from './version';
import {
  DbSchema as DbSchema2,
  Neo4jFunction,
  Neo4jProcedure,
} from '@neo4j-cypher/language-support';
import { Neo4jSchemaPoller } from '@neo4j-cypher/query-tools';
import { DbSchema as DbSchema1 } from 'languageSupport-next.13';

export function convertDbSchema(
  originalSchema: DbSchema2,
  neo4j: Neo4jSchemaPoller,
): DbSchema2 | DbSchema1 {
  let oldFunctions: Record<string, Neo4jFunction> = {};
  let oldProcedures: Record<string, Neo4jProcedure> = {};
  if (!originalSchema) {
    return originalSchema;
  }
  if (
    originalSchema.functions['CYPHER 5'] &&
    originalSchema.procedures['CYPHER 5']
  ) {
    oldFunctions = originalSchema.functions['CYPHER 5'];
    oldProcedures = originalSchema.procedures['CYPHER 5'];
  }

  const serverVersion = neo4j.connection?.serverVersion;
  const linterVersion = serverVersionToLinter(serverVersion);

  if (compareMajorMinorVersions(linterVersion, '5.21.0') < 0) {
    const dbSchemaOld: DbSchema1 = {
      ...originalSchema,
      functions: oldFunctions,
      procedures: oldProcedures,
    };
    return dbSchemaOld;
  } else {
    return originalSchema;
  }
}

export function serverVersionToLinter(serverVersion: string) {
  const oldLinter = '5.20.0';

  let candidate: string = undefined;
  if (compareMajorMinorVersions(serverVersion, oldLinter) <= 0) {
    candidate = oldLinter;
  }
  return candidate;
}
