import { Neo4jFunction } from '@neo4j-cypher/language-support';
import Ajv, { JSONSchemaType } from 'ajv';
import { resultTransformers } from 'neo4j-driver';
import { cleanType, cleanTypeDescription } from '../data-transforms/clean-type';
import type { ExecuteQueryArgs } from '../types/sdkTypes.js';

type ListFunctionArgs = { executableByMe: boolean };

function cleanTypes(result: Neo4jFunction): Neo4jFunction {
  return {
    ...result,
    argumentDescription: result.argumentDescription.map(cleanTypeDescription),
    returnDescription: cleanType(result.returnDescription),
  };
}

export const functionSchema: JSONSchemaType<Neo4jFunction> = {
  type: 'object',
  properties: {
    aggregating: { type: 'boolean' },
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
    category: { type: 'string' },
    description: { type: 'string' },
    isBuiltIn: { type: 'boolean' },
    name: { type: 'string' },
    returnDescription: { type: 'string' },
    signature: { type: 'string' },
    isDeprecated: { type: 'boolean', default: false },
  },
  required: [
    'aggregating',
    'argumentDescription',
    'category',
    'description',
    'isBuiltIn',
    'isDeprecated',
    'name',
    'returnDescription',
    'signature',
  ],
  additionalProperties: true,
};

const validateFunction = new Ajv({ useDefaults: true }).compile(functionSchema);

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
YIELD name, category, description, isBuiltIn, argumentDescription, signature, returnDescription, aggregating, isDeprecated`;

  const resultTransformer = resultTransformers.mappedResultTransformer({
    map(record) {
      const objResult = record.toObject();
      validateFunction(objResult);
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const result = cleanTypes(objResult as Neo4jFunction);
      return result;
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
