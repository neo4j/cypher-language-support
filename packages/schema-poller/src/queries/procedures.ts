import { Neo4jProcedure } from '@neo4j-cypher/language-support';
import { resultTransformers } from 'neo4j-driver';
import type { ExecuteQueryArgs } from '../types/sdkTypes';

type ListFunctionArgs = { executableByMe: boolean };
/**
 * Gets available procedures on your database
 * https://neo4j.com/docs/cypher-manual/current/clauses/listing-procedures/
 */
export function listProcedures(
  { executableByMe }: ListFunctionArgs = { executableByMe: false },
): ExecuteQueryArgs<{
  procedures: Neo4jProcedure[];
}> {
  const query = `SHOW PROCEDURES ${
    executableByMe ? 'EXECUTABLE BY CURRENT USER' : ''
  }
YIELD name, description, mode, worksOnSystem, argumentDescription, signature, returnDescription, admin, option`;

  const resultTransformer = resultTransformers.mappedResultTransformer({
    map(record) {
      return record.toObject() as Neo4jProcedure;
    },
    collect(procedures, summary) {
      return { procedures, summary };
    },
  });

  return {
    query,
    queryConfig: {
      routing: 'READ',
      database: 'system',
      resultTransformer,
    },
  };
}
