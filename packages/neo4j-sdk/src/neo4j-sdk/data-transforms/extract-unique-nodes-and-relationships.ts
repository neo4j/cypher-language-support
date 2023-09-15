import type {
  Node,
  Path,
  Record as Neo4jRecord,
  Relationship,
} from "neo4j-driver";
import { isNode, isPath, isRelationship } from "neo4j-driver";

import type { DeduplicatedBasicNodesAndRels } from "../types/sdk-types.js";
import { getPropertyTypeDisplayName } from "./cypher-type-names.js";
import { propertyToString } from "./record-to-string.js";

export const extractUniqueNodesAndRels = (
  records: Neo4jRecord[],
  {
    nodeLimit,
    keepDanglingRels = false,
  }: { nodeLimit?: number; keepDanglingRels?: boolean } = {}
): DeduplicatedBasicNodesAndRels => {
  let limitHit = false;
  if (records.length === 0) {
    return { nodes: [], relationships: [] };
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
      const id = n.identity.toString();
      if (!nodeMap.has(id)) {
        nodeMap.set(id, n);
      }
      if (typeof nodeLimit === "number" && nodeMap.size === nodeLimit) {
        limitHit = true;
      }
    }
  }

  const relMap = new Map<string, Relationship>();
  function addRel(r: Relationship) {
    const id = r.identity.toString();
    if (!relMap.has(id)) {
      relMap.set(id, r);
    }
  }

  const findAllEntities = (item: unknown) => {
    if (typeof item !== "object" || !item) {
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

  const nodes = Array.from(nodeMap.values()).map((item) => {
    return {
      id: item.identity.toString(),
      elementId: item.elementId,
      labels: item.labels,
      properties: mapValues(item.properties, propertyToString),
      propertyTypes: mapValues(item.properties, getPropertyTypeDisplayName),
    };
  });

  const relationships = Array.from(relMap.values())
    .filter((item) => {
      if (keepDanglingRels) {
        return true;
      }

      // We'd get dangling relationships from
      // match ()-[a:ACTED_IN]->() return a;
      // or from hitting the node limit
      const start = item.start.toString();
      const end = item.end.toString();
      return nodeMap.has(start) && nodeMap.has(end);
    })
    .map((item) => {
      return {
        id: item.identity.toString(),
        elementId: item.elementId,
        startNodeId: item.start.toString(),
        endNodeId: item.end.toString(),
        type: item.type,
        properties: mapValues(item.properties, propertyToString),
        propertyTypes: mapValues(item.properties, getPropertyTypeDisplayName),
      };
    });
  return { nodes, relationships, limitHit };
};

function mapValues<A, B>(
  object: Record<string, A>,
  mapper: (val: A) => B
): Record<string, B> {
  return Object.entries(object).reduce(
    (res: Record<string, B>, [currKey, currVal]) => {
      res[currKey] = mapper(currVal);
      return res;
    },
    {}
  );
}
