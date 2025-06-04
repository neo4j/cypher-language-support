import {
  compareMajorMinorVersions,
  DbSchema,
  Neo4jFunction,
  Neo4jProcedure,
  toSignatureInformation,
} from '@neo4j-cypher/language-support';
import { getVersion, Neo4jSchemaPoller } from '@neo4j-cypher/query-tools';
import { SignatureInformation } from 'vscode-languageserver';
import { DbSchema as NoCyphVerSchema } from 'languageSupport-next.13';
import { DbSchema as FuncOnlySigSchema } from 'languageSupport-next.3';

export async function convertDbSchema(
  originalSchema: DbSchema,
  neo4j: Neo4jSchemaPoller,
): Promise<DbSchema | NoCyphVerSchema | FuncOnlySigSchema> {
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

  const serverVersion = await getServerVersion(neo4j);
  const linterVersion = serverVersionToLinter(serverVersion);

  if (compareMajorMinorVersions(linterVersion, '5.18.0') < 0) {
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
    const functionSignatures: Record<string, SignatureInformation> =
      Object.fromEntries(
        Object.entries(oldFunctions).map(([key, func]) => [
          key,
          toSignatureInformation(func),
        ]),
      );

    const procedureSignatures: Record<string, SignatureInformation> =
      Object.fromEntries(
        Object.entries(oldProcedures).map(([key, proc]) => [
          key,
          toSignatureInformation(proc),
        ]),
      );

    const dbSchemaOld = {
      ...originalSchema,
      functionSignatures,
      procedureSignatures,
    };
    return dbSchemaOld;
  } else if (compareMajorMinorVersions(linterVersion, '2025.1.0') < 0) {
    const dbSchemaOld: NoCyphVerSchema = {
      ...originalSchema,
      functions: oldFunctions,
      procedures: oldProcedures,
    };
    return dbSchemaOld;
  } else {
    return originalSchema;
  }
}

export async function getServerVersion(
  neo4j: Neo4jSchemaPoller,
): Promise<string> {
  if (neo4j.serverVersion) {
    return neo4j.serverVersion;
  } else {
    const { query: versionQuery, queryConfig: versionQueryConfig } =
      getVersion();
    const driver = neo4j.driver;
    if (driver) {
      const { serverVersion } = await driver.executeQuery(
        versionQuery,
        {},
        versionQueryConfig,
      );
      neo4j.serverVersion = serverVersion;
      return serverVersion;
    }
  }
}

export function serverVersionToLinter(serverVersion: string) {
  //This can be made into an array (the key is not needed) but having it this way helps see what lang-supp release we would use
  const availableLinters: Record<string, string> = {
    //We should probably have version comparison where patches are lumped in with the original release
    '2.0.0-next.20': '2025.4.0', // 29/4 - 2025.04.0=30/4
    //"2.0.0-next.19": "", // 22/4 - maybe SKIP
    //"2.0.0-next.18": "", // 7/4  - skip because next release is 2025.04.0
    '2.0.0-next.17': '2025.3.0', // 25/3 - 2025.03.0=27/3
    '2.0.0-next.16': '2025.2.0', // 17/2 - 2025.02.0=27/2
    //"2.0.0-next.15": "", // 10/2 - maybe SKIP
    '2.0.0-next.14': '2025.1.0', // 4/2  - 2025.01.0=6/2
    //"2.0.0-next.13": "", // 23/12 2024 - skip, next is 01.0
    '2.0.0-next.12': '5.26.0', // 13/12 - 5.26(.x)=9/12 (very close to initial 5.26, if after)
    //"2.0.0-next.11": "", // 13/11 - SKIP
    //"2.0.0-next.10": "", // 13/11 - SKIP
    '2.0.0-next.9': '5.25.0', // 28/10 - 5.25 = 31/10
    '2.0.0-next.8': '5.24.0', // 14/9 - 5.24 = 27/9
    '2.0.0-next.7': '5.23.0', // 29/7 - 5.23 = 22/8
    '2.0.0-next.6': '5.20.0', // 3/5 - 5.20 = 23/5
    '2.0.0-next.5': '5.19.0', // 2/4 - 5.19 = 12/4
    '2.0.0-next.4': '5.18.0', // 6/3 - 5.18 = 13/3
    '2.0.0-next.3': '5.17.0', // 7/2 - 5.17 = 23/2
    '2.0.0-next.2': '5.14.0', // 24/11 2023 - 5.14 = 24/11
    //"2.0.0-next.1": "",  // 22/11 - SKIP
    '2.0.0-next.0': '5.13.0', // 25/10 - 5.13 = 23/10
  };
  let candidate: string = undefined;
  for (const x in availableLinters) {
    if (compareMajorMinorVersions(serverVersion, availableLinters[x]) <= 0) {
      candidate = availableLinters[x];
    } else {
      break;
    }
  }
  return candidate;
}
