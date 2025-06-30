import { compareMajorMinorVersions } from './version';
import {
  DbSchema as DbSchemaV2,
  Neo4jFunction,
  Neo4jProcedure,
} from '@neo4j-cypher/language-support';
import { DbSchema as DbSchemaV1 } from 'languageSupport-next.13';

const oldLinter = '5.20.0';

// for older versions of the language support, the dbschema was not the same,
// meaning old linters need conversion of the new schema
export function convertDbSchema(
  originalSchema: DbSchemaV2,
  linterVersion: string,
): DbSchemaV2 | DbSchemaV1 {
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

  if (compareMajorMinorVersions(linterVersion, oldLinter) <= 0) {
    const dbSchemaOld: DbSchemaV1 = {
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
  let candidate: string = undefined;
  if (compareMajorMinorVersions(serverVersion, oldLinter) <= 0) {
    candidate = oldLinter;
  }
  return candidate;
}

export function linterFileToVersion(fileName: string) {
  return fileName
    ? fileName.match(/^([\d.]+)-lintWorker\.cjs$/)?.[1]
    : undefined;
}
