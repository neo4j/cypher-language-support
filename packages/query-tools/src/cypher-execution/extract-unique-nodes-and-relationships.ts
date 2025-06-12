import type {
  Integer,
  Node,
  Path,
  Record,
  RecordShape,
  Relationship,
} from 'neo4j-driver';
import { isNode, isPath, isRelationship } from 'neo4j-driver';
import { CypherProperty } from '../data-types/cypher-data-types';

export type Properties = RecordShape<string, CypherProperty>;

/**
 * Result type containing deduplicated nodes and relationships extracted from Neo4j records.
 */
export type DeduplicatedBasicNodesAndRels = {
  /** Array of unique nodes found in the records */
  nodes: Node<Integer, Properties, string>[];
  /** Array of unique relationships found in the records */
  relationships: Relationship<Integer, Properties, string>[];
  /** Whether the max node limit was reached during extraction */
  limitHit: boolean;
};

/**
 * Extracts and deduplicates nodes and relationships from Neo4j query records.
 *
 * This function processes Neo4j records to find all nodes and relationships,
 * removing duplicates based on their element IDs. It can handle various data
 * structures including individual nodes/relationships, paths, arrays, and
 * nested objects.
 *
 * @param records - Array of Neo4j records to process
 * @param options - Configuration options for extraction
 * @param options.nodeLimit - Maximum number of unique nodes to extract (optional)
 * @param options.keepDanglingRels - Whether to keep relationships whose start/end nodes are missing (default: false)
 *
 * @returns The {@link DeduplicatedBasicNodesAndRels} containing unique nodes and relationships
 */
export const extractUniqueNodesAndRels = (
  records: Record[],
  {
    nodeLimit,
    keepDanglingRels = false,
  }: { nodeLimit?: number; keepDanglingRels?: boolean } = {},
): DeduplicatedBasicNodesAndRels => {
  let limitHit = false;
  if (records.length === 0) {
    return { nodes: [], relationships: [], limitHit: false };
  }

  const items = new Set<unknown>();

  for (const record of records) {
    for (const key of record.keys) {
      items.add(record.get(key));
    }
  }

  const paths: Path[] = [];

  const nodeMap = new Map<string, Node>();
  function addNode(n: Node) {
    if (!limitHit) {
      const id = n.elementId.toString();
      if (!nodeMap.has(id)) {
        nodeMap.set(id, n);
      }
      if (typeof nodeLimit === 'number' && nodeMap.size === nodeLimit) {
        limitHit = true;
      }
    }
  }

  const relMap = new Map<string, Relationship>();
  function addRel(r: Relationship) {
    const id = r.elementId.toString();
    if (!relMap.has(id)) {
      relMap.set(id, r);
    }
  }

  const findAllEntities = (item: unknown) => {
    if (typeof item !== 'object' || !item) {
      return;
    }

    if (isRelationship(item)) {
      addRel(item);
    } else if (isNode(item)) {
      addNode(item);
    } else if (isPath(item)) {
      paths.push(item);
    } else if (Array.isArray(item)) {
      item.forEach(findAllEntities);
    } else {
      Object.values(item).forEach(findAllEntities);
    }
  };

  findAllEntities(Array.from(items));

  for (const path of paths) {
    addNode(path.start);
    addNode(path.end);
    for (const segment of path.segments) {
      addNode(segment.start);
      addNode(segment.end);
      addRel(segment.relationship);
    }
  }

  const nodes = Array.from(nodeMap.values());

  const relationships = Array.from(relMap.values()).filter((item) => {
    if (keepDanglingRels) {
      return true;
    }

    // We'd get dangling relationships from
    // match ()-[a:ACTED_IN]->() return a;
    // or from hitting the node limit
    const start = item.startNodeElementId.toString();
    const end = item.endNodeElementId.toString();
    return nodeMap.has(start) && nodeMap.has(end);
  });

  return { nodes, relationships, limitHit };
};
