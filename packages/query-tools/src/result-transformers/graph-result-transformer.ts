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

/**
 * Result type for graph queries that includes deduplicated nodes and relationships
 * along with the original records and query summary.
 *
 * See {@link DeduplicatedBasicNodesAndRels} for the type of the nodes and relationships.
 */
export type GraphResult = DeduplicatedBasicNodesAndRels & {
  /** Original Neo4j records returned by the query */
  records: Record[];
  summary: ResultSummary<Integer>;
};

/**
 * A result transformer that processes Neo4j query results into a graph format
 * with deduplicated nodes and relationships.
 *
 * This transformer extracts unique nodes and relationships from query records
 * while preserving the original records and summary information. It's particularly
 * useful for graph visualization and analysis where duplicate entities need to be
 * consolidated.
 *
 * @example
 * ```typescript
 * const result: GraphResult = await driver.executeQuery(
 *  'MATCH p=(name: $name)-[]->() RETURN p',
 *  { name: 'John' },
 *  { resultTransformer: graphResultTransformer },
 * );
 *
 * console.log(result.nodes, result.relationships);
 * ```
 *
 * @returns ResultTransformer producing {@link GraphResult}
 */
export const graphResultTransformer =
  resultTransformers.mappedResultTransformer({
    map(record) {
      return record;
    },
    collect(records, summary): GraphResult {
      const { nodes, relationships, limitHit } =
        extractUniqueNodesAndRels(records);
      return { nodes, relationships, limitHit, records, summary };
    },
  });
