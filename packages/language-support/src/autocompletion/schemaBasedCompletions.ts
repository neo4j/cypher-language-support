import {
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver-types';
import { DbSchema } from '../dbSchema';
import { ParsedStatement } from '../parserWrapper';
import { isLabelLeaf, LabelOrCondition, SymbolsInfo } from '../types';
import { findParent } from '../helpers';
import {
  NodePatternContext,
  PatternElementContext,
  QuantifierContext,
  RelationshipPatternContext,
} from '../generated-parser/CypherCmdParser';
import { backtickIfNeeded } from './autocompletionHelpers';
import { _internalFeatureFlags } from '../featureFlags';

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

export const reltypesToCompletions = (reltypes: string[] = []) =>
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

function intersectChildren(
  incomingLabels: Map<string, Set<string>>,
  outGoingLabels: Map<string, Set<string>>,
  children: LabelOrCondition[],
): { inLabels: Set<string>; outLabels: Set<string> } {
  let inLabels: Set<string> = undefined;
  let outLabels: Set<string> = undefined;
  children.forEach((c) => {
    const { inLabels: incoming, outLabels: outgoing } = walkLabelTree(
      incomingLabels,
      outGoingLabels,
      c,
    );
    if (!inLabels) {
      inLabels = incoming;
      outLabels = outgoing;
    } else {
      inLabels = inLabels.intersection(incoming);
      outLabels = outLabels.intersection(outgoing);
    }
  });
  if (!inLabels) {
    inLabels = new Set();
    outLabels = new Set();
  }
  return { inLabels, outLabels };
}

function uniteChildren(
  incomingLabels: Map<string, Set<string>>,
  outGoingLabels: Map<string, Set<string>>,
  children: LabelOrCondition[],
): { inLabels: Set<string>; outLabels: Set<string> } {
  let inLabels: Set<string> = new Set();
  let outLabels: Set<string> = new Set();
  children.forEach((c) => {
    const { inLabels: incoming, outLabels: outgoing } = walkLabelTree(
      incomingLabels,
      outGoingLabels,
      c,
    );
    inLabels = inLabels.union(incoming);
    outLabels = outLabels.union(outgoing);
  });
  return { inLabels, outLabels };
}

function walkLabelTree(
  incomingLabels: Map<string, Set<string>>,
  outGoingLabels: Map<string, Set<string>>,
  labelTree: LabelOrCondition,
): { inLabels: Set<string>; outLabels: Set<string> } {
  if (isLabelLeaf(labelTree)) {
    return {
      inLabels: incomingLabels.get(labelTree.value),
      outLabels: outGoingLabels.get(labelTree.value),
    };
  } else if (labelTree.andOr == 'and') {
    return intersectChildren(
      incomingLabels,
      outGoingLabels,
      labelTree.children,
    );
  } else {
    return uniteChildren(incomingLabels, outGoingLabels, labelTree.children);
  }
}

function getRelsFromNodesSets(dbSchema: DbSchema): {
  toNodes: Map<string, Set<string>>;
  fromNodes: Map<string, Set<string>>;
} {
  if (dbSchema.graphSchema) {
    const toNodes: Map<string, Set<string>> = new Map();
    const fromNodes: Map<string, Set<string>> = new Map();
    dbSchema.graphSchema.forEach((rel) => {
      if (!toNodes.has(rel.to)) {
        toNodes.set(rel.to, new Set());
      }
      if (!fromNodes.has(rel.from)) {
        fromNodes.set(rel.from, new Set());
      }
      toNodes.get(rel.to).add(rel.relType);
      fromNodes.get(rel.from).add(rel.relType);
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
      toRels.get(rel.relType).add(rel.from);
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
  if (
    !_internalFeatureFlags.schemaBasedPatternCompletions ||
    dbSchema.graphSchema === undefined
  ) {
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
        ('children' in foundVariable.labels &&
          foundVariable.labels.children.length == 0)
      ) {
        return allLabelCompletions(dbSchema);
      }

      // limitation: not direction-aware (ignores <- vs ->)
      // limitation: not checking node label repetition
      const { toRels: nodesToRelsSet, fromRels: nodesFromRelsSet } =
        getNodesFromRelsSet(dbSchema);
      const { inLabels, outLabels } = walkLabelTree(
        nodesToRelsSet,
        nodesFromRelsSet,
        foundVariable.labels,
      );
      const allNodes = inLabels.union(outLabels);
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
  if (
    !_internalFeatureFlags.schemaBasedPatternCompletions ||
    dbSchema.graphSchema === undefined
  ) {
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
      const { inLabels, outLabels } = walkLabelTree(
        relsToNodesSet,
        relsFromNodesSet,
        foundVariable.labels,
      );
      const allRels = inLabels.union(outLabels);
      return reltypesToCompletions(Array.from(allRels));
    }
  }

  return allReltypeCompletions(dbSchema);
}
