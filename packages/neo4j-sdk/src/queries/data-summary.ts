import { QueryResult } from 'neo4j-driver';
import { SdkQuery } from '../types/sdk-types';

export type DataSummary = {
  labels: string[];
  relationshipTypes: string[];
  propertyKeys: string[];
};

const ITEM_LIMIT = 1000;

export function getDataSummary(): SdkQuery<DataSummary> {
  const cypher = `CALL db.labels() YIELD label
RETURN COLLECT(label)[..${ITEM_LIMIT}] AS result
UNION ALL
CALL db.relationshipTypes() YIELD relationshipType
RETURN COLLECT(relationshipType)[..${ITEM_LIMIT}] AS result
UNION ALL
CALL db.propertyKeys() YIELD propertyKey
RETURN COLLECT(propertyKey)[..${ITEM_LIMIT}] AS result`;

  function parseResult(res: QueryResult): DataSummary {
    // Types to be validated in e2e tests

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [labels, relationshipTypes, propertyKeys] = res.records.map(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (r) => r.toObject().result,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: DataSummary = { labels, relationshipTypes, propertyKeys };
    return result;
  }

  return { cypher, parseResult, dbType: 'standard' };
}
