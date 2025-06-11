import { compareMajorMinorVersions } from './version';
import {
  DbSchema as DbSchema3,
  Neo4jFunction,
  Neo4jProcedure,
  toSignatureInformation,
} from '@neo4j-cypher/language-support';
import { Neo4jSchemaPoller } from '@neo4j-cypher/query-tools';
import { SignatureInformation } from 'vscode-languageserver';
import { DbSchema as DbSchema2 } from 'languageSupport-next.13';
import { DbSchema as DbSchema1 } from 'languageSupport-next.3';
import axios from 'axios';
import semver from 'semver';

export async function convertDbSchema(
  originalSchema: DbSchema3,
  neo4j: Neo4jSchemaPoller,
): Promise<DbSchema3 | DbSchema2 | DbSchema1> {
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
  const linterVersion = await serverVersionToLinter(serverVersion);

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

    const dbSchemaOld: DbSchema1 = {
      ...originalSchema,
      functionSignatures,
      procedureSignatures,
    };
    return dbSchemaOld;
  } else if (compareMajorMinorVersions(linterVersion, '2025.1.0') < 0) {
    const dbSchemaOld: DbSchema2 = {
      ...originalSchema,
      functions: oldFunctions,
      procedures: oldProcedures,
    };
    return dbSchemaOld;
  } else {
    return originalSchema;
  }
}

interface NpmPackageInfo {
  versions: Record<string, Record<string, string>>;
  //I don't think the value being Record<string,string> is quite true, but eslint wont let me have "any"
}

export async function fetchNPMVersions(): Promise<string[]> {
  //TODO : replace with //"https://registry.npmjs.org/" when npm published
  const URL = 'http://localhost:4873/@neo4j-cypher/lint-worker';

  const returnVal = axios.get<NpmPackageInfo>(URL).then((response) => {
    return response?.data?.versions ? Object.keys(response.data.versions) : [];
  });
  return returnVal;
}

export function filterLinterVersions(allLinters: string[]): string[] {
  return allLinters.filter((version) => {
    const semVer: semver.SemVer | null = semver.coerce(version, {
      includePrerelease: false,
    });
    return semVer ? semVer.major > 4 && semVer.major < 2300 : false;
  });
}

export async function serverVersionToLinter(serverVersion: string) {
  const linters = filterLinterVersions(await fetchNPMVersions());

  //This can be made into an array (the key is not needed) but having it this way helps see what lang-supp release we would use

  let candidate: string = undefined;
  for (const linterVersion of linters) {
    if (compareMajorMinorVersions(serverVersion, linterVersion) <= 0) {
      candidate = linterVersion;
    } else {
      break;
    }
  }
  return candidate;
}
