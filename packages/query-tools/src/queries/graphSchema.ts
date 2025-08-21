import { resultTransformers } from 'neo4j-driver';
import { ExecuteQueryArgs } from '../types/sdkTypes';
import Ajv, { JSONSchemaType } from 'ajv';

type NeoNode = {
  labels: string[];
  elementId: string;
};
type NeoRel = {
  type: string;
  endNodeElementId: string;
  startNodeElementId: string;
};

type GraphSchema = {
  nodes: NeoNode[];
  relationships: NeoRel[];
};

const graphSchemaSchema: JSONSchemaType<GraphSchema> = {
  type: 'object',
  properties: {
    nodes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          labels: {
            type: 'array',
            items: { type: 'string' },
          },
          elementId: { type: 'string' },
        },
        required: ['labels', 'elementId'],
        additionalProperties: true,
      },
    },
    relationships: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          endNodeElementId: { type: 'string' },
          startNodeElementId: { type: 'string' },
        },
        required: ['type', 'endNodeElementId', 'startNodeElementId'],
        additionalProperties: true,
      },
      required: ['type', 'endNodeElementId', 'relationships'],
      additionalProperties: true,
    },
  },
  required: ['nodes', 'relationships'],
  additionalProperties: false,
};

const validateGraphSchema = new Ajv({ useDefaults: true }).compile(
  graphSchemaSchema,
);

export function listGraphSchema(
  database: string | undefined,
): ExecuteQueryArgs<{
  graphSchema: Set<{ from: string; to: string; relType: string }>;
}> {
  const query = `CALL db.schema.visualization() YIELD *`;
  const resultTransformer = resultTransformers.mappedResultTransformer({
    map(record) {
      const objResult = record.toObject();
      validateGraphSchema(objResult);
      return objResult as GraphSchema;
    },
    collect(records, summary) {
      return {
        summary,
        graphSchema: extractRelationshipsWithNamedNodes(records),
      };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ', database },
  };
}

function extractRelationshipsWithNamedNodes(
  graphSchemas: GraphSchema[],
): Set<{ from: string; to: string; relType: string }> {
  const items = new Set<{ from: string; to: string; relType: string }>();

  if (graphSchemas.length !== 1) {
    return items;
  }
  const graphSchema = graphSchemas[0];
  const nodes: Record<string, string> = {};

  for (const node of graphSchema.nodes) {
    //Query should only return 1 label
    nodes[node.elementId] = node.labels[0];
  }
  for (const rel of graphSchema.relationships) {
    const from = nodes[rel.startNodeElementId];
    const to = nodes[rel.endNodeElementId];
    const relType = rel.type;
    items.add({ from, to, relType });
  }

  return items;
}
