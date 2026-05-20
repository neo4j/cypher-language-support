import { DbSchema } from './dbSchema.js';
import {
  ConditionNode,
  isLabelLeaf,
  LabelLeaf,
  LabelOrCondition,
} from './types.js';

export function walkCNFTree(
  incomingLabels: Map<string, Set<string>>,
  outGoingLabels: Map<string, Set<string>>,
  labelTree: LabelOrCondition,
): { inLabels: Set<string>; outLabels: Set<string> } {
  //Bail if tree is not CNF
  if (isLabelLeaf(labelTree) || labelTree.condition !== 'and') {
    let inLabels = new Set<string>();
    let outLabels = new Set<string>();
    incomingLabels.values().forEach((x) => (inLabels = inLabels.union(x)));
    outGoingLabels.values().forEach((x) => (outLabels = outLabels.union(x)));

    return { inLabels, outLabels };
  }
  const notLabels: LabelLeaf[] = [];
  const literalLabels: LabelLeaf[] = [];
  const orNodes: ConditionNode[] = [];

  labelTree.children.forEach((c) => {
    if (isLabelLeaf(c)) {
      literalLabels.push(c);
    } else if (
      c.condition === 'not' &&
      c.children.length === 1 &&
      isLabelLeaf(c.children[0])
    ) {
      notLabels.push(c.children[0]);
    } else if (c.condition === 'or') {
      orNodes.push(c);
    }
  });

  let inLabels = new Set<string>();
  incomingLabels.forEach((part, key) => {
    if (!notLabels.some((c) => c.value === key)) {
      inLabels = inLabels.union(part);
    }
  });
  let outLabels = new Set<string>();
  outGoingLabels.forEach((part, key) => {
    if (!notLabels.some((c) => c.value === key)) {
      outLabels = outLabels.union(part);
    }
  });

  for (const label of literalLabels) {
    const incoming = incomingLabels.get(label.value) ?? new Set();
    const outgoing = outGoingLabels.get(label.value) ?? new Set();
    inLabels = inLabels.intersection(incoming);
    outLabels = outLabels.intersection(outgoing);
  }

  for (const node of orNodes) {
    let incoming = new Set();
    let outGoing = new Set();
    for (const c of node.children) {
      if (isLabelLeaf(c)) {
        const newIncoming = incomingLabels.get(c.value) ?? new Set();
        const newOutgoing = outGoingLabels.get(c.value) ?? new Set();
        incoming = incoming.union(newIncoming);
        outGoing = outGoing.union(newOutgoing);
      }
    }
    inLabels = inLabels.intersection(incoming);
    outLabels = outLabels.intersection(outGoing);
  }
  return { inLabels, outLabels };
}

export function getRelsFromNodesSets(dbSchema: DbSchema): {
  toNodes: Map<string, Set<string>>;
  fromNodes: Map<string, Set<string>>;
} {
  const toNodes: Map<string, Set<string>> = new Map();
  const fromNodes: Map<string, Set<string>> = new Map();
  if (dbSchema.graphSchema) {
    dbSchema.graphSchema.forEach((rel) => {
      //rels in schema defined like (from)-(relType)->(to)
      //Means 'from' is "node going to rel", hence why we
      //pass rel.from into toNodes
      if (!toNodes.has(rel.from)) {
        toNodes.set(rel.from, new Set());
      }
      if (!fromNodes.has(rel.to)) {
        fromNodes.set(rel.to, new Set());
      }
      toNodes.get(rel.from)?.add(rel.relType);
      fromNodes.get(rel.to)?.add(rel.relType);
    });
  }
  return { toNodes, fromNodes };
}

export function getNodesFromRelsSet(dbSchema: DbSchema): {
  toRels: Map<string, Set<string>>;
  fromRels: Map<string, Set<string>>;
} {
  const toRels: Map<string, Set<string>> = new Map();
  const fromRels: Map<string, Set<string>> = new Map();
  if (dbSchema.graphSchema) {
    dbSchema.graphSchema.forEach((rel) => {
      if (!toRels.has(rel.relType)) {
        toRels.set(rel.relType, new Set());
        fromRels.set(rel.relType, new Set());
      }
      toRels.get(rel.relType)?.add(rel.to);
      fromRels.get(rel.relType)?.add(rel.from);
    });
  }
  return { toRels, fromRels };
}
