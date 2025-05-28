import {
  Integer,
  Record,
  ResultSummary,
  resultTransformers,
} from 'neo4j-driver';

import {
  DeduplicatedBasicNodesAndRels,
  extractUniqueNodesAndRels,
} from '../cypher-execution/extract-unique-nodes-and-relationships';

type GraphResult = DeduplicatedBasicNodesAndRels & {
  records: Record[];
  summary: ResultSummary<Integer>;
};

export const graph = resultTransformers.mappedResultTransformer({
  map(record) {
    return record;
  },
  collect(records, summary): GraphResult {
    const { nodes, relationships, limitHit } =
      extractUniqueNodesAndRels(records);
    return { nodes, relationships, limitHit, records, summary };
  },
});
