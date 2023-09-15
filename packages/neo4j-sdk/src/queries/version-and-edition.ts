import type { BaseArguments } from '../neo4j-sdk/types/sdk-types';

export type VersionAndEdition = {
  version: string;
  edition: 'enterprise' | 'community';
};

/**
 * Procedure documented here
 * https://neo4j.com/docs/operations-manual/current/reference/procedures/
 */
export async function getVersionAndEdition({
  queryCypher,
}: BaseArguments): Promise<VersionAndEdition> {
  const query =
    'CALL dbms.components() YIELD versions, edition unwind versions as version return version, edition;';

  const res = await queryCypher(query);

  // Type is verified in integration tests
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return res.records[0].toObject() as VersionAndEdition;
}
