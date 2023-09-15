import type { QueryResult } from 'neo4j-driver';
import { coerce, lt } from 'semver';

import type { ConnectNodesOwnArgs } from '../queries/connect-nodes';
import { connectNodes } from '../queries/connect-nodes';
import { getDataSummary } from '../queries/data-summary';
import { listFunctions } from '../queries/functions';
import type { GetNeighboursOwnArgs } from '../queries/get-neighbours';
import { getNeighbours } from '../queries/get-neighbours';
import { listProcedures } from '../queries/procedures';
import { getVersionAndEdition } from '../queries/version-and-edition';

type InitNeo4jSDKBaseArgs = {
  queryCypher: (query: string) => Promise<QueryResult>;
};
type InitNeo4jSDKFullArgs = InitNeo4jSDKBaseArgs & { neo4jVersion: string };

export const MINIMUM_SUPPORTED_VERSION = '4.3.0';

export type Neo4jSDK = ReturnType<typeof createNeo4jSDK>;

export const createNeo4jSDK = (config: InitNeo4jSDKFullArgs) => {
  const coerceVersion = coerce(config.neo4jVersion);
  if (!coerceVersion) {
    throw new Error(`Invalid Neo4j Version ${config.neo4jVersion}`);
  }

  if (lt(coerceVersion, MINIMUM_SUPPORTED_VERSION)) {
    throw new Error(
      `Minumum supported version is ${MINIMUM_SUPPORTED_VERSION} got neo4jVersion ${coerceVersion.version}`,
    );
  }
  const args = { ...config, neo4jVersion: coerceVersion.version };

  return {
    getDataSummary: () => getDataSummary(args),
    getNeighbours: (own: GetNeighboursOwnArgs) =>
      getNeighbours({ ...args, ...own }),
    getVersionAndEdition: () => getVersionAndEdition(args),
    connectNodes: (own: ConnectNodesOwnArgs) =>
      connectNodes({ ...args, ...own }),
    listFunctions: () => listFunctions(args),
    listProcedures: () => listProcedures(args),
  };
};

/**
 * If neo4jVersion is not supplied we query neo4j for it first.
 */
export function initNeo4jSDK(config: InitNeo4jSDKBaseArgs): Promise<Neo4jSDK>;
export function initNeo4jSDK(config: InitNeo4jSDKFullArgs): Neo4jSDK;
export function initNeo4jSDK({
  neo4jVersion,
  queryCypher,
}: InitNeo4jSDKBaseArgs & { neo4jVersion?: string }):
  | Neo4jSDK
  | Promise<Neo4jSDK> {
  if (neo4jVersion === undefined) {
    return getVersionAndEdition({
      queryCypher,
      neo4jVersion: MINIMUM_SUPPORTED_VERSION,
    }).then(({ version }) =>
      createNeo4jSDK({ queryCypher, neo4jVersion: version }),
    );
  }
  return createNeo4jSDK({ neo4jVersion, queryCypher });
}
