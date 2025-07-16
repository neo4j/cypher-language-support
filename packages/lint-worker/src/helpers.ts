import { compareMajorMinorVersions } from './version';
import {
  DbSchema as DbSchemaV2,
  Neo4jFunction,
  Neo4jProcedure,
} from '@neo4j-cypher/language-support';
import axios from 'axios';
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
  // Extract only the major and minor
  const versionRegex = /^\d+\.\d+/;
  const linterVersion = serverVersion.match(versionRegex)?.[0];

  if (compareMajorMinorVersions(serverVersion, '5.23') <= 0) {
    return '5.23';
  } else
    return {
      linterVersion,
    };
}

export function linterFileToServerVersion(fileName: string) {
  const linterFileRegex = /^([\d.]+)-lintWorker-([\d.]+)\.cjs$/;
  return fileName ? fileName.match(linterFileRegex)?.[1] : undefined;
}

//The data object we get from npm contains more fields than this, but we only need dist-tags here
export type NpmData = {
  'dist-tags'?: Record<string, string>;
};

export type NpmRelease = {
  tag: string;
  version: string;
};

export const npmTagToLinterVersion = (tag: string) =>
  tag.match(/^neo4j-([\d.]+)$/)?.[1];

export async function getTaggedRegistryVersions(): Promise<NpmRelease[]> {
  const registryUrl = 'https://registry.npmjs.org/@neo4j-cypher/lint-worker';
  try {
    const response = await axios.get<NpmData>(registryUrl);
    const data: NpmData = response.data;
    const taggedVersions: { tag: string; version: string }[] = [];
    if (data !== null && data['dist-tags'] !== null) {
      for (const [tag, version] of Object.entries(data['dist-tags'])) {
        if (typeof tag === 'string' && typeof version === 'string') {
          taggedVersions.push({ tag, version });
        }
      }
    }

    return taggedVersions;
  } catch (error) {
    return [];
  }
}
