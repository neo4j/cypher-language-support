import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
} from 'vscode-languageserver-types';
import { DbSchema } from '../dbSchema';
import { ParsedStatement } from '../parserWrapper';
import {
  ConditionNode,
  isLabelLeaf,
  LabelLeaf,
  LabelOrCondition,
  SymbolsInfo,
} from '../types';
import { findParent } from '../helpers';
import {
  NodePatternContext,
  PatternElementContext,
  QuantifierContext,
  RelationshipPatternContext,
} from '../generated-parser/CypherCmdParser';
import { backtickIfNeeded } from './autocompletionHelpers';
import { convertToCNF } from '../labelTreeRewriting';

export function getShortPathCompletions(
  lastNode: RelationshipPatternContext,
  symbolsInfo: SymbolsInfo,
  dbSchema: DbSchema,
): CompletionItem[] {
  const snippetCompletions: CompletionItem[] = [];
  const lastVariable = findLastVariable(lastNode, symbolsInfo);
  if (
    !lastVariable ||
    !dbSchema.graphSchema ||
    isLabelLeaf(lastVariable.labels) ||
    lastVariable.labels.children.length === 0
  ) {
    return [];
  }

  const { toRels: nodesToRelsSet, fromRels: nodesFromRelsSet } =
    getNodesFromRelsSet(dbSchema);
  const assumedDirection = lastNode.leftArrow() ? 'outgoing' : 'incoming';

  let cnfTree: LabelOrCondition;
  try {
    cnfTree = convertToCNF(lastVariable.labels);
  } catch (e) {
    return [];
  }
  const { inLabels, outLabels } = walkCNFTree(
    nodesToRelsSet,
    nodesFromRelsSet,
    cnfTree,
  );

  if (assumedDirection === 'outgoing') {
    for (const outLabel of outLabels) {
      snippetCompletions.push({
        label: '-(:' + outLabel + ')',
        kind: CompletionItemKind.Snippet,
        insertTextFormat: InsertTextFormat.Snippet,
        insertText: '-(${1: }:' + outLabel + ')${2:}',
        detail: 'path template',
      });
    }
  } else {
    for (const inLabel of inLabels) {
      snippetCompletions.push({
        label: '->(:' + inLabel + ')',
        kind: CompletionItemKind.Snippet,
        insertTextFormat: InsertTextFormat.Snippet,
        insertText: '->(${1: }:' + inLabel + ')${2:}',
        detail: 'path template',
      });
    }
  }

  return snippetCompletions;
}

export function getPathCompletions(
  lastNode: NodePatternContext,
  symbolsInfo: SymbolsInfo,
  dbSchema: DbSchema,
): CompletionItem[] {
  const snippetCompletions: CompletionItem[] = [];

  const lastVariable = findLastVariable(lastNode, symbolsInfo);
  if (
    !lastVariable ||
    !dbSchema.graphSchema ||
    isLabelLeaf(lastVariable.labels) ||
    lastVariable.labels.children.length === 0
  ) {
    return [];
  }
  const { toNodes: relsToNodesSet, fromNodes: relsFromNodesSet } =
    getRelsFromNodesSets(dbSchema);
  let cnfTree: LabelOrCondition;
  try {
    cnfTree = convertToCNF(lastVariable.labels);
  } catch (e) {
    return [];
  }
  const { inLabels: inRelTypes, outLabels: outRelTypes } = walkCNFTree(
    relsToNodesSet,
    relsFromNodesSet,
    cnfTree,
  );
  const { toRels: nodesToRelsSet, fromRels: nodesFromRelsSet } =
    getNodesFromRelsSet(dbSchema);
  for (const inRelType of inRelTypes) {
    const { inLabels } = walkCNFTree(nodesToRelsSet, nodesFromRelsSet, {
      condition: 'and',
      children: [{ value: inRelType, validFrom: 0 }],
    });
    for (const inLabel of inLabels) {
      snippetCompletions.push({
        label: '-[:' + inRelType + ']->(:' + inLabel + ')',
        kind: CompletionItemKind.Snippet,
        insertTextFormat: InsertTextFormat.Snippet,
        insertText:
          '-[${1: }:' + inRelType + ']->(${2: }:' + inLabel + ')${3:}',
        detail: 'path template',
      });
    }
  }

  for (const outRelType of outRelTypes) {
    const { outLabels } = walkCNFTree(nodesToRelsSet, nodesFromRelsSet, {
      condition: 'and',
      children: [{ value: outRelType, validFrom: 0 }],
    });
    for (const outLabel of outLabels) {
      snippetCompletions.push({
        label: '<-[:' + outRelType + ']-(:' + outLabel + ')',
        kind: CompletionItemKind.Snippet,
        insertTextFormat: InsertTextFormat.Snippet,
        insertText:
          '<-[${1: }:' + outRelType + ']-(${2: }:' + outLabel + ')${3:}',
        detail: 'path template',
      });
    }
  }

  return snippetCompletions;
}

export const labelsToCompletions = (labelNames: string[] = []) =>
  labelNames.map((labelName) => {
    const backtickedName = backtickIfNeeded(labelName, 'label');
    const maybeInsertText = backtickedName
      ? { insertText: backtickedName }
      : {};

    const result: CompletionItem = {
      label: labelName,
      kind: CompletionItemKind.TypeParameter,
      ...maybeInsertText,
    };
    return result;
  });

export const allLabelCompletions = (dbSchema: DbSchema) =>
  labelsToCompletions(dbSchema.labels);

const reltypesToCompletions = (reltypes: string[] = []) =>
  reltypes.map((relType) => {
    const backtickedName = backtickIfNeeded(relType, 'relType');
    const maybeInsertText = backtickedName
      ? { insertText: backtickedName }
      : {};

    const result: CompletionItem = {
      label: relType,
      kind: CompletionItemKind.TypeParameter,
      ...maybeInsertText,
    };
    return result;
  });

export const allReltypeCompletions = (dbSchema: DbSchema) =>
  reltypesToCompletions(dbSchema.relationshipTypes);

function walkCNFTree(
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

function getRelsFromNodesSets(dbSchema: DbSchema): {
  toNodes: Map<string, Set<string>>;
  fromNodes: Map<string, Set<string>>;
} {
  if (dbSchema.graphSchema) {
    const toNodes: Map<string, Set<string>> = new Map();
    const fromNodes: Map<string, Set<string>> = new Map();
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
      toNodes.get(rel.from).add(rel.relType);
      fromNodes.get(rel.to).add(rel.relType);
    });
    return { toNodes, fromNodes };
  }
  return undefined;
}

function getNodesFromRelsSet(dbSchema: DbSchema): {
  toRels: Map<string, Set<string>>;
  fromRels: Map<string, Set<string>>;
} {
  if (dbSchema.graphSchema) {
    const toRels: Map<string, Set<string>> = new Map();
    const fromRels: Map<string, Set<string>> = new Map();
    dbSchema.graphSchema.forEach((rel) => {
      if (!toRels.has(rel.relType)) {
        toRels.set(rel.relType, new Set());
        fromRels.set(rel.relType, new Set());
      }
      toRels.get(rel.relType).add(rel.to);
      fromRels.get(rel.relType).add(rel.from);
    });
    return { toRels, fromRels };
  }
  return undefined;
}

function findLastVariable(
  lastValidElement: NodePatternContext | RelationshipPatternContext,
  symbolsInfo: SymbolsInfo,
) {
  const variable = lastValidElement.variable();
  const isAnonVar = variable === null;
  const foundVariable = isAnonVar
    ? symbolsInfo?.symbolTables?.flat().find(
        (entry) =>
          // Because the anonymous variable created in the AST is "made up", it doesnt have a position of its own in the query.
          // It therefor inherits the parent-nodes (The NodePattern/RelationshipPattern = lastValidElement) position
          entry.definitionPosition >= lastValidElement.start.start &&
          entry.definitionPosition <= lastValidElement.stop.stop,
      )
    : symbolsInfo?.symbolTables
        ?.flat()
        .find((entry) => entry.references.includes(variable.start.start));
  return foundVariable;
}

export function completeNodeLabel(
  dbSchema: DbSchema,
  parsingResult: ParsedStatement,
  symbolsInfo: SymbolsInfo,
): CompletionItem[] {
  if (dbSchema.graphSchema === undefined) {
    return allLabelCompletions(dbSchema);
  }

  const callContext = findParent(
    parsingResult.stopNode.parentCtx,
    (x) => x instanceof PatternElementContext,
  );

  if (callContext instanceof PatternElementContext) {
    const lastValidElement = callContext.children.toReversed().find((child) => {
      if (child instanceof RelationshipPatternContext) {
        if (child.exception === null) {
          return true;
        }
      }
    });

    // limitation: bailing out on quantifiers
    if (lastValidElement instanceof QuantifierContext) {
      return allLabelCompletions(dbSchema);
    }

    if (lastValidElement instanceof RelationshipPatternContext) {
      const foundVariable = findLastVariable(lastValidElement, symbolsInfo);
      if (
        foundVariable === undefined ||
        isLabelLeaf(foundVariable.labels) ||
        foundVariable.labels.condition !== 'and' ||
        foundVariable.labels.children.length === 0
      ) {
        return allLabelCompletions(dbSchema);
      }

      const direction = lastValidElement.leftArrow()
        ? 'outgoing'
        : lastValidElement.rightArrow()
        ? 'incoming'
        : 'bidirectional';

      // limitation: not checking node label repetition
      const { toRels: nodesToRelsSet, fromRels: nodesFromRelsSet } =
        getNodesFromRelsSet(dbSchema);
      let cnfTree: LabelOrCondition;
      try {
        cnfTree = convertToCNF(foundVariable.labels);
      } catch (e) {
        return allLabelCompletions(dbSchema);
      }
      let allIncomingLabels = new Set<string>();
      nodesToRelsSet.forEach((part) => {
        allIncomingLabels = allIncomingLabels.union(part);
      });
      let allOutGoingLabels = new Set<string>();
      nodesFromRelsSet.forEach((part) => {
        allOutGoingLabels = allOutGoingLabels.union(part);
      });
      const { inLabels, outLabels } = walkCNFTree(
        nodesToRelsSet,
        nodesFromRelsSet,
        cnfTree,
      );
      const allNodes =
        direction === 'outgoing'
          ? outLabels
          : direction === 'incoming'
          ? inLabels
          : inLabels.union(outLabels);
      return labelsToCompletions(Array.from(allNodes));
    }
  }

  return allLabelCompletions(dbSchema);
}

export function completeRelationshipType(
  dbSchema: DbSchema,
  parsingResult: ParsedStatement,
  symbolsInfo: SymbolsInfo,
): CompletionItem[] {
  if (dbSchema.graphSchema === undefined) {
    return allReltypeCompletions(dbSchema);
  }

  // limitation: not checking PathPatternNonEmptyContext
  // limitation: not handling parenthesized paths
  const patternContext = findParent(
    parsingResult.stopNode.parentCtx,
    (x) => x instanceof PatternElementContext,
  );

  if (patternContext instanceof PatternElementContext) {
    const lastValidElement = patternContext.children
      .toReversed()
      .find((child) => {
        if (child instanceof NodePatternContext) {
          if (child.exception === null) {
            return true;
          }
        }
      });

    const thisCtx = findParent(
      parsingResult.stopNode,
      (x) => x instanceof RelationshipPatternContext,
    );
    let direction = 'bidirectional';
    if (thisCtx instanceof RelationshipPatternContext) {
      direction = thisCtx.leftArrow()
        ? 'outgoing'
        : thisCtx.rightArrow()
        ? 'incoming'
        : 'bidirectional';
    }

    // limitation: bailing out on quantifiers
    if (lastValidElement instanceof QuantifierContext) {
      return allReltypeCompletions(dbSchema);
    }

    if (lastValidElement instanceof NodePatternContext) {
      const foundVariable = findLastVariable(lastValidElement, symbolsInfo);
      if (
        foundVariable === undefined ||
        ('children' in foundVariable.labels &&
          foundVariable.labels.children.length == 0)
      ) {
        return allReltypeCompletions(dbSchema);
      }

      // limitation: not checking relationship type repetition
      const { toNodes: relsToNodesSet, fromNodes: relsFromNodesSet } =
        getRelsFromNodesSets(dbSchema);

      const cnfTree = convertToCNF(foundVariable.labels);
      let allIncomingLabels = new Set<string>();
      relsToNodesSet.forEach((part) => {
        allIncomingLabels = allIncomingLabels.union(part);
      });
      let allOutGoingLabels = new Set<string>();
      relsFromNodesSet.forEach((part) => {
        allOutGoingLabels = allOutGoingLabels.union(part);
      });
      const { inLabels, outLabels } = walkCNFTree(
        relsToNodesSet,
        relsFromNodesSet,
        cnfTree,
      );
      const allRels =
        direction === 'outgoing'
          ? outLabels
          : direction === 'incoming'
          ? inLabels
          : inLabels.union(outLabels);
      return reltypesToCompletions(Array.from(allRels));
    }
  }

  return allReltypeCompletions(dbSchema);
}
