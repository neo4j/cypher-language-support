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
} from '../generated-parser/CypherCmdParser';
import { ParserRuleContext } from 'antlr4';
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
  relsFromLabels: Map<string, Set<string>>,
  children: LabelOrCondition[],
): Set<string> {
  let intersection: Set<string> = undefined;
  children.forEach((c) => {
    intersection = intersection
      ? (intersection = intersection.intersection(
          new Set(walkLabelTree(relsFromLabels, c)),
        ))
      : new Set(walkLabelTree(relsFromLabels, c));
  });
  return intersection;
}

function unionChildren(
  relsFromLabels: Map<string, Set<string>>,
  children: LabelOrCondition[],
): Set<string> {
  let union: Set<string> = new Set();
  children.forEach(
    (c) => (union = union.union(new Set(walkLabelTree(relsFromLabels, c)))),
  );
  return union;
}

function walkLabelTree(
  relsFromLabels: Map<string, Set<string>>,
  labelTree: LabelOrCondition,
): Set<string> {
  if (isLabelLeaf(labelTree)) {
    return relsFromLabels.get(labelTree.value);
  } else if (labelTree.andOr == 'and') {
    return intersectChildren(relsFromLabels, labelTree.children);
  } else {
    return unionChildren(relsFromLabels, labelTree.children);
  }
}

function getRelsFromLabelsSet(dbSchema: DbSchema): Map<string, Set<string>> {
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

export function completeRelationshipType(
  dbSchema: DbSchema,
  parsingResult: ParsedStatement,
  symbolsInfo: SymbolsInfo,
): CompletionItem[] {
  if (!_internalFeatureFlags.schemaBasedPatternCompletions) {
    return allReltypeCompletions(dbSchema);
  }

  if (dbSchema.graphSchema === undefined) {
    return allReltypeCompletions(dbSchema);
  }

  // limitation: not checking PathPatternNonEmptyContext
  // limitation: not handling parenthesized paths
  const callContext = findParent(
    parsingResult.stopNode.parentCtx,
    (x) => x instanceof PatternElementContext,
  );

  if (callContext instanceof PatternElementContext) {
    const lastValidElement = callContext.children.toReversed().find((child) => {
      if (child instanceof ParserRuleContext) {
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
        ('andOr' in foundVariable.labels &&
          foundVariable.labels.children.length == 0)
      ) {
        return allReltypeCompletions(dbSchema);
      }

      // limitation: not direction-aware (ignores <- vs ->)
      // limitation: not checking relationship variable reuse
      const relsFromLabelsSet = getRelsFromLabelsSet(dbSchema);
      const rels = walkLabelTree(relsFromLabelsSet, foundVariable.labels);

      return reltypesToCompletions(Array.from(rels));
    }
  }

  return allReltypeCompletions(dbSchema);
}
