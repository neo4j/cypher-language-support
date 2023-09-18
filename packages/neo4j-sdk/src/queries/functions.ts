import { QueryResult } from 'neo4j-driver';
import type { ArgumentDescription, SdkQuery } from '../types/sdk-types.js';

export type Neo4jFunction = {
  name: string;
  category: string;
  description: string;
  isBuiltIn: boolean;
  argumentDescription: ArgumentDescription[];
  returnDescription: string;
  signature: string;
  aggregating: boolean;
};

/**
 * Gets available functions in your database
 * https://neo4j.com/docs/cypher-manual/current/clauses/listing-functions/
 */
export function listFunctions(): SdkQuery<Neo4jFunction[]> {
  const cypher = `SHOW FUNCTIONS
YIELD name, category, description, isBuiltIn, argumentDescription, signature, returnDescription, aggregating`;

  function parseResult(result: QueryResult) {
    // Type is verified in integration tests
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return result.records.map((rec) => rec.toObject() as Neo4jFunction);
  }

  return { cypher, parseResult, dbType: 'system' };
}
