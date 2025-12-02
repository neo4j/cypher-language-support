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
  connectedLabels: Map<string, Set<string>>,
  children: LabelOrCondition[],
): Set<string> {
  let intersection: Set<string> = undefined;
  children.forEach((c) => {
    intersection = intersection
      ? (intersection = intersection.intersection(
          walkLabelTree(connectedLabels, c),
        ))
      : walkLabelTree(connectedLabels, c);
  });
  return intersection ?? new Set();
}

function uniteChildren(
  connectedLabels: Map<string, Set<string>>,
  children: LabelOrCondition[],
): Set<string> {
  let union: Set<string> = new Set();
  children.forEach(
    (c) => (union = union.union(walkLabelTree(connectedLabels, c))),
  );
  return union;
}

function walkLabelTree(
  connectedLabels: Map<string, Set<string>>,
  labelTree: LabelOrCondition,
): Set<string> {
  if (isLabelLeaf(labelTree)) {
    return connectedLabels.get(labelTree.value);
  } else if (labelTree.andOr == 'and') {
    return intersectChildren(connectedLabels, labelTree.children);
  } else {
    return uniteChildren(connectedLabels, labelTree.children);
  }
}

function getRelsFromNodesSet(dbSchema: DbSchema): Map<string, Set<string>> {
  if (dbSchema.graphSchema) {
    const relsFromLabelsSet: Map<string, Set<string>> = new Map();
    dbSchema.graphSchema.forEach((rel) => {
      let currentFromLabelEntry = relsFromLabelsSet.get(rel.from);
      let currentToLabelEntry = relsFromLabelsSet.get(rel.to);
      if (!currentFromLabelEntry) {
        relsFromLabelsSet.set(rel.from, new Set());
        currentFromLabelEntry = relsFromLabelsSet.get(rel.from);
      }
      if (!currentToLabelEntry) {
        relsFromLabelsSet.set(rel.to, new Set());
        currentToLabelEntry = relsFromLabelsSet.get(rel.to);
      }
      currentToLabelEntry.add(rel.relType);
      currentFromLabelEntry.add(rel.relType);
    });
    return relsFromLabelsSet;
  }
  return undefined;
}

function getNodesFromRelsSet(dbSchema: DbSchema): Map<string, Set<string>> {
  if (dbSchema.graphSchema) {
    const nodesFromRelsSet: Map<string, Set<string>> = new Map();
    dbSchema.graphSchema.forEach((rel) => {
      if (!nodesFromRelsSet.has(rel.relType)) {
        nodesFromRelsSet.set(rel.relType, new Set());
      }
      const currentRelEntry = nodesFromRelsSet.get(rel.relType);
      currentRelEntry.add(rel.to);
      currentRelEntry.add(rel.from);
    });
    return nodesFromRelsSet;
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
    ? symbolsInfo?.symbolTables
        ?.flat()
        .find(
          (entry) =>
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
      const nodesFromRelsSet = getNodesFromRelsSet(dbSchema);
      const rels = walkLabelTree(nodesFromRelsSet, foundVariable.labels);

      return labelsToCompletions(Array.from(rels));
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

      // limitation: not direction-aware (ignores <- vs ->)
      // limitation: not checking relationship type repetition
      const relsFromLabelsSet = getRelsFromNodesSet(dbSchema);
      const rels = walkLabelTree(relsFromLabelsSet, foundVariable.labels);

      return reltypesToCompletions(Array.from(rels));
    }
  }

  return allReltypeCompletions(dbSchema);
}
