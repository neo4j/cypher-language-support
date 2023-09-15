import type {
  ArgumentDescription,
  BaseArguments,
} from '../neo4j-sdk/types/sdk-types.js';

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
export async function listFunctions({ queryCypher }: BaseArguments) {
  // Syntax holds for v4.3+
  const query = `SHOW FUNCTIONS
YIELD name, category, description, isBuiltIn, argumentDescription, signature, returnDescription, aggregating`;

  const res = await queryCypher(query);

  return res.records.map((rec) => {
    // Type is verified in integration tests
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return rec.toObject() as Neo4jFunction;
  });
}
