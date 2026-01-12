import { CypherVersion, Neo4jProcedure } from '@neo4j-cypher/language-support';
import Ajv, { JSONSchemaType } from 'ajv';
import { resultTransformers } from 'neo4j-driver';
import { cleanTypeDescription } from '../data-transforms/clean-type';
import type { ExecuteQueryArgs } from '../types/sdkTypes';

type ListProcedureArgs = {
  executableByMe: boolean;
  cypherVersion?: CypherVersion;
};

export const procedureSchema: JSONSchemaType<Neo4jProcedure> = {
  type: 'object',
  properties: {
    admin: { type: 'boolean' },
    argumentDescription: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string' },
          default: { type: 'string', nullable: true },
          isDeprecated: { type: 'boolean', default: false },
        },
        required: ['name', 'description', 'type', 'isDeprecated'],
      },
    },
    description: { type: 'string' },
    mode: { type: 'string' },
    name: { type: 'string' },
    option: { type: 'object' },
    returnDescription: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string' },
          isDeprecated: { type: 'boolean', default: false },
        },
        required: ['name', 'description', 'type', 'isDeprecated'],
      },
    },
    signature: { type: 'string' },
    worksOnSystem: { type: 'boolean' },
    deprecatedBy: { type: 'string', nullable: true },
  },
  required: [
    'admin',
    'argumentDescription',
    'description',
    'mode',
    'name',
    'option',
    'returnDescription',
    'signature',
    'worksOnSystem',
  ],
  additionalProperties: true,
};

const validateProcedure = new Ajv({ useDefaults: true }).compile(
  procedureSchema,
);

function cleanTypes(result: Neo4jProcedure): Neo4jProcedure {
  return {
    ...result,
    argumentDescription: result.argumentDescription.map(cleanTypeDescription),
    returnDescription: result.returnDescription.map(cleanTypeDescription),
  };
}

/**
 * Gets available procedures on your database
 * https://neo4j.com/docs/cypher-manual/current/clauses/listing-procedures/
 */
export function listProcedures(
  { executableByMe, cypherVersion }: ListProcedureArgs = {
    executableByMe: false,
    cypherVersion: undefined,
  },
): ExecuteQueryArgs<{
  procedures: Neo4jProcedure[];
}> {
  const query = `${cypherVersion ? cypherVersion + ' ' : ''}
    SHOW PROCEDURES 
    ${executableByMe ? 'EXECUTABLE BY CURRENT USER' : ''}
    YIELD *`;

  const resultTransformer = resultTransformers.mapped({
    map(record) {
      // Assign default values (e.g. isDeprecated) in case they are not present
      const objResult = record.toObject();
      validateProcedure(objResult);
      // Type is verified in integration tests
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const result = cleanTypes(objResult as Neo4jProcedure);
      return result;
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
