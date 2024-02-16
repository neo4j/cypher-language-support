import { resultTransformers } from 'neo4j-driver';
import { ExecuteQueryArgs } from '../types/sdkTypes';

export type DataSummary = {
  labels: string[];
  relationshipTypes: string[];
  propertyKeys: string[];
};

const ITEM_LIMIT = 1000;

export function getDataSummary(): ExecuteQueryArgs<DataSummary> {
  const query = `CALL db.labels() YIELD label
RETURN COLLECT(label)[..${ITEM_LIMIT}] AS result
UNION ALL
CALL db.relationshipTypes() YIELD relationshipType
RETURN COLLECT(relationshipType)[..${ITEM_LIMIT}] AS result
UNION ALL
CALL db.propertyKeys() YIELD propertyKey
RETURN COLLECT(propertyKey)[..${ITEM_LIMIT}] AS result`;

  const resultTransformer = resultTransformers.mappedResultTransformer({
    map(record) {
      return record.toObject().result as string[];
    },
    collect(results, summary) {
      return {
        labels: results[0],
        relationshipTypes: results[1],
        propertyKeys: results[2],
        summary,
      };
    },
  });

  return {
    query,
    queryConfig: { resultTransformer, routing: 'READ' },
  };
}
