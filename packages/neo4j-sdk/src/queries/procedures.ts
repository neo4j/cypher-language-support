import type {
  ArgumentDescription,
  BaseArguments,
  ReturnDescription,
} from '../neo4j-sdk/types/sdk-types.js';

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

/**
 * Gets available procedures on your database
 * https://neo4j.com/docs/cypher-manual/current/clauses/listing-procedures/
 */
export async function listProcedures({ queryCypher }: BaseArguments) {
  // Syntax holds for v4.3+
  const query = `SHOW PROCEDURES
YIELD name, description, mode, worksOnSystem, argumentDescription, signature, returnDescription, admin, option`;

  const res = await queryCypher(query);

  return res.records.map((rec) => {
    // Type is verified in integration tests
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return rec.toObject() as Procedure;
  });
}
