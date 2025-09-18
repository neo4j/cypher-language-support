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

export const fullLabelCompletions = (dbSchema: DbSchema) =>
  dbSchema.labels?.map((labelName) => {
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

export const fullReltypeCompletions = (dbSchema: DbSchema) =>
  dbSchema.relationshipTypes?.map((relType) => {
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

export function completeRelationshipType(
  dbSchema: DbSchema,
  parsingResult: ParsedStatement,
  symbolsInfo: SymbolsInfo,
): CompletionItem[] {
  // if we have a graph schema, use it to filter the completions
  if (dbSchema.graphSchema !== undefined) {
    // Find the source of the relationship, starting by finding it's parent pattern

    const callContext = findParent(
      parsingResult.stopNode.parentCtx,
      (x) => x instanceof PatternElementContext, //||
      // x instanceof PathPatternNonEmptyContext, // later starge
    );

    // if we found the parent
    if (
      callContext instanceof PatternElementContext //||
    ) {
      // the rule we've matched looks like this:
      // (nodePattern (relationshipPattern quantifier? nodePattern)* | parenthesizedPath)+

      // node pattern is straightforward
      // same for relpattern.
      // quantifier is + * {4} or {1,3}
      // if a quantifier is present. Let's give up. We'd need to walk through the schema to find where we are along a path.
      // leave it as a limitation for now
      // parenthesizedPath is it's own sub path. it goes up to the `pattern` rule ag ain.
      // we could likely ignore that part. once we enter it, it'd recurseively hit a pattern element contect again.
      // enumerating some of the cases we care about
      // nodePattern relationshipPattern nodePattern
      // nodePattern relationshipPattern nodePattern relationshipPattern nodePattern
      // in reality. what we can do is look at the top level children. collect all the nodePattern & relationshipPattern
      // if we hit a quantifier. we can give up.
      // if we hit the position we're completing/the end. Then we use the last item found

      // we now need to know where in the pattern we are
      /*
              const children = callContext.children;
              const foundThings = [];
              for (const child of children) {
                if (child instanceof ParserRuleContext) {
                  if (child.exception !== null) {
                    continue;
                  }
                }

                if (child instanceof NodePatternContext) {
                  if (child.variable() !== null) {
                    foundThings.push({ label: child.variable() });
                  }
                }

                if (child instanceof RelationshipPatternContext) {
                  if (child.variable() !== null) {
                    foundThings.push({ reltype: child.variable() });
                  }
                }
                if (child instanceof QuantifierContext) {
                  console.log('quantifier');
                }
              }
              console.log(foundThings);

              return [];
              */
      // we actually don't need to go through the whole list. we can progress it backwards
      // we also don't have to loop, we can just look at the last item
      // todo we need to handle incoming vs outgoing rels
      const lastValidElement = callContext.children
        .toReversed()
        .find((child) => {
          if (child instanceof ParserRuleContext) {
            if (child.exception === null) {
              return true;
            }
          }
        });

      if (lastValidElement instanceof QuantifierContext) {
        return fullReltypeCompletions(dbSchema);
      }

      if (lastValidElement instanceof NodePatternContext) {
        // if it's anonomyous, we don't have it in the schema
        // only variables we have
        const variable = lastValidElement.variable();
        if (variable === null) {
          // we bail
          return fullReltypeCompletions(dbSchema);
        }

        console.log('info', symbolsInfo);
        const foundVariable = (
          symbolsInfo?.symbolTables ?? [
            {
              variable: 'n',
              definitionPosition: 0,
              types: ['Person'],
              references: [],
            },
          ]
        )
          // ignore scope for now
          .flat()
          .find((entry) => entry.variable === variable.getText());

        console.log(foundVariable.types);
        // bailout if we don't have the variable
        if (foundVariable === undefined) {
          return fullReltypeCompletions(dbSchema);
        }

        // check valid rels for the variable
        console.log(foundVariable.types);
        const rels = dbSchema.graphSchema.flatMap((schema) =>
          foundVariable.types.includes(schema.from) ||
          foundVariable.types.includes(schema.to)
            ? [schema.relType]
            : [],
        );

        return rels.map((relType) => {
          return {
            label: relType,
            kind: CompletionItemKind.TypeParameter,
          };
        });
      }

      // lookup it's type
      // check schema for allowed rels
      // for later we also chech PathPatternNonEmptyContext
    }
  }
  return fullReltypeCompletions(dbSchema);
}
