import { resultTransformers } from 'neo4j-driver';
import type {
  ArgumentDescription,
  ExecuteQueryArgs,
  ReturnDescription,
} from '../types/sdkTypes.js';

type ProcedureMode = 'READ' | 'DBMS' | 'SCHEMA' | 'WRITE';

export type Procedure = {
  name: string;
  description: string;
  mode: ProcedureMode;
  // If it can run on the system database
  worksOnSystem: boolean;
  argumentDescription: ArgumentDescription[];
  returnDescription: ReturnDescription[];
  signature: string;
  admin: boolean;
  // Flexbible field, most hold if procedure is deprecated or not
  option: { deprecated: boolean } & Record<string, unknown>;
};

type ListFunctionArgs = { executableByMe: boolean };
/**
 * Gets available procedures on your database
 * https://neo4j.com/docs/cypher-manual/current/clauses/listing-procedures/
 */
export function listProcedures(
  { executableByMe }: ListFunctionArgs = { executableByMe: false },
): ExecuteQueryArgs<{
  procedures: Procedure[];
}> {
  const query = `SHOW PROCEDURES ${
    executableByMe ? 'EXECUTABLE BY CURRENT USER' : ''
  }
YIELD name, description, mode, worksOnSystem, argumentDescription, signature, returnDescription, admin, option`;

  const resultTransformer = resultTransformers.mappedResultTransformer({
    map(record) {
      return record.toObject() as Procedure;
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
