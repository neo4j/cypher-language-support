import { QueryResult } from 'neo4j-driver';

export type DataSummary = {
  labels: string[];
  relationshipTypes: string[];
  propertyKeys: string[];
};

const ITEM_LIMIT = 1000;
const labelList = `CALL db.labels() YIELD label`;
const relationshipTypeList = `CALL db.relationshipTypes() YIELD relationshipType`;
const propertyKeyList = `CALL db.propertyKeys() YIELD propertyKey`;

export function getDataSummary() {
  const query = `${labelList}
RETURN COLLECT(label)[..${ITEM_LIMIT}] AS result
UNION ALL
${relationshipTypeList}
RETURN COLLECT(label)[..${ITEM_LIMIT}] AS result
UNION ALL
${propertyKeyList}
RETURN COLLECT(label)[..${ITEM_LIMIT}] AS result`;

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

  return { query, parseResult };
}
