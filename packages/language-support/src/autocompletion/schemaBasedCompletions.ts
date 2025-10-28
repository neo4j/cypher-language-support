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
  labelToConnectedLabelsMap: Map<string, Set<string>>,
  children: LabelOrCondition[],
): Set<string> {
  let intersection: Set<string> = undefined;
  children.forEach((c) => {
    intersection = intersection
      ? (intersection = intersection.intersection(
          walkLabelTree(labelToConnectedLabelsMap, c),
        ))
      : walkLabelTree(labelToConnectedLabelsMap, c);
  });
  return intersection ?? new Set();
}

function uniteChildren(
  labelToConnectedLabelsMap: Map<string, Set<string>>,
  children: LabelOrCondition[],
): Set<string> {
  let union: Set<string> = new Set();
  children.forEach(
    (c) => (union = union.union(walkLabelTree(labelToConnectedLabelsMap, c))),
  );
  return union;
}

// outgoingLabelsMap is here a map that takes a "label" = Label/ RelType
//  and returns the "labels" of rels/nodes going out/in of the node/rel in the graph schema
function walkLabelTree(
  labelToConnectedLabelsMap: Map<string, Set<string>>,
  labelTree: LabelOrCondition,
): Set<string> {
  if (isLabelLeaf(labelTree)) {
    return labelToConnectedLabelsMap.get(labelTree.value);
  } else if (labelTree.andOr == 'and') {
    return intersectChildren(labelToConnectedLabelsMap, labelTree.children);
  } else {
    return uniteChildren(labelToConnectedLabelsMap, labelTree.children);
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
      let currentRelEntry = nodesFromRelsSet.get(rel.relType);
      if (!currentRelEntry) {
        nodesFromRelsSet.set(rel.relType, new Set());
        currentRelEntry = nodesFromRelsSet.get(rel.relType);
      }
      currentRelEntry.add(rel.to);
      currentRelEntry.add(rel.from);
    });
    return nodesFromRelsSet;
  }
  return undefined;
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
      if (
        child instanceof RelationshipPatternContext &&
        child.stop.stop <= parsingResult.stopNode.stop.stop
      ) {
        //For some reason this null check doesnt seem to work the same on nodes -> old check gets current broken node as "lastValid"
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
      // limitation: not checking anonymous variables
      const variable = lastValidElement.variable();
      if (variable === null) {
        return allLabelCompletions(dbSchema);
      }

      const foundVariable = symbolsInfo?.symbolTables
        ?.flat()
        .find((entry) => entry.references.includes(variable.start.start));

      if (
        foundVariable === undefined ||
        ('children' in foundVariable.labels &&
          foundVariable.labels.children.length == 0)
      ) {
        return allLabelCompletions(dbSchema);
      }

      // limitation: not direction-aware (ignores <- vs ->)
      // limitation: not checking relationship variable reuse
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
        if (
          child instanceof NodePatternContext &&
          child.stop.stop <= parsingResult.stopNode.stop.stop
        ) {
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
      // limitation: not checking anonymous variables
      const variable = lastValidElement.variable();
      if (variable === null) {
        return allReltypeCompletions(dbSchema);
      }

      const foundVariable = symbolsInfo?.symbolTables
        ?.flat()
        .find((entry) => entry.references.includes(variable.start.start));

      if (
        foundVariable === undefined ||
        ('children' in foundVariable.labels &&
          foundVariable.labels.children.length == 0)
      ) {
        return allReltypeCompletions(dbSchema);
      }

      // limitation: not direction-aware (ignores <- vs ->)
      // limitation: not checking relationship variable reuse
      const relsFromLabelsSet = getRelsFromNodesSet(dbSchema);
      const rels = walkLabelTree(relsFromLabelsSet, foundVariable.labels);

      return reltypesToCompletions(Array.from(rels));
    }
  }

  return allReltypeCompletions(dbSchema);
}
