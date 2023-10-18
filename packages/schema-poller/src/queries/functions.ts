import { resultTransformers } from 'neo4j-driver';
import type {
  ArgumentDescription,
  ExecuteQueryArgs,
} from '../types/sdk-types.js';

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

type ListFunctionArgs = { executableByMe: boolean };
/**
 * Gets available functions in your database
 * https://neo4j.com/docs/cypher-manual/current/clauses/listing-functions/
 */
export function listFunctions(
  { executableByMe }: ListFunctionArgs = { executableByMe: false },
): ExecuteQueryArgs<{
  functions: Neo4jFunction[];
}> {
  const query = `SHOW FUNCTIONS ${
    executableByMe ? 'EXECUTABLE BY CURRENT USER' : ''
  }
YIELD name, category, description, isBuiltIn, argumentDescription, signature, returnDescription, aggregating`;

  const resultTransformer = resultTransformers.mappedResultTransformer({
    map(record) {
      return record.toObject() as Neo4jFunction;
    },
    collect(functions, summary) {
      return { functions, summary };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database: 'system' },
  };
}
