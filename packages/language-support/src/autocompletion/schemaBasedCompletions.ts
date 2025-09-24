import {
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver-types';
import { DbSchema } from '../dbSchema';
import { ParsedStatement } from '../parserWrapper';
import { SymbolsInfo } from '../types';
import { findParent } from '../helpers';
import {
  NodePatternContext,
  PatternElementContext,
  QuantifierContext,
} from '../generated-parser/CypherCmdParser';
import { ParserRuleContext } from 'antlr4';
import { backtickIfNeeded } from './autocompletionHelpers';
import { _internalFeatureFlags } from '../featureFlags';

export const labelToCompletions = (labelNames?: string[]) =>
  labelNames?.map((labelName) => {
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
  }) ?? [];

export const allLabelCompletions = (dbSchema: DbSchema) =>
  labelToCompletions(dbSchema.labels);

export const reltypesToCompletions = (reltypes?: string[]) =>
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
  }) ?? [];

export const allReltypeCompletions = (dbSchema: DbSchema) =>
  reltypesToCompletions(dbSchema.relationshipTypes);

export function completeRelationshipType(
  dbSchema: DbSchema,
  parsingResult: ParsedStatement,
  symbolsInfo: SymbolsInfo,
): CompletionItem[] {
  if (!_internalFeatureFlags.schemaBasedPatternCompletion) {
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

      // limitation: ignoring scope
      const foundVariable = symbolsInfo?.symbolTables
        ?.flat()
        .find((entry) => entry.variable === variable.getText());

      if (foundVariable === undefined) {
        return allReltypeCompletions(dbSchema);
      }

      // limitation: not checking union types properly
      // limitation: not direction-aware (ignores <- vs ->)
      // limitation: not handling multiple relationship types (r:TYPE1|TYPE2)
      // limitation: not checking relationship variable reuse
      const rels = dbSchema.graphSchema.flatMap((schema) =>
        foundVariable.types.includes(schema.from) ||
        foundVariable.types.includes(schema.to)
          ? [schema.relType]
          : [],
      );

      return reltypesToCompletions(rels);
    }
  }

  return allReltypeCompletions(dbSchema);
}
