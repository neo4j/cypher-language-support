import { ParserRuleContext, Token } from 'antlr4';
import { CodeCompletionCore } from 'antlr4-c3';
import {
  CompletionItem,
  CompletionItemKind,
  Position,
} from 'vscode-languageserver-types';
import { DbInfo } from '../dbInfo';
import CypherParser, {
  Expression2Context,
  LabelExpression4Context,
  LabelExpression4IsContext,
  NodePatternContext,
  ProcedureNameContext,
  RelationshipPatternContext,
} from '../generated-parser/CypherParser';
import { findParent, findStopNode, isDefined } from '../helpers';
import { CypherTokenType, lexerSymbols, tokenNames } from '../lexerSymbols';
import { parserWrapper, ParsingResult } from '../parserWrapper';

export function isLabel(p: ParserRuleContext) {
  return (
    p instanceof LabelExpression4Context ||
    p instanceof LabelExpression4IsContext
  );
}

export function inLabel(stopNode: ParserRuleContext) {
  const labelParent = findParent(stopNode, isLabel);

  return isDefined(labelParent);
}

export function inNodeLabel(stopNode: ParserRuleContext) {
  const labelParent = findParent(
    findParent(stopNode, isLabel),
    (p) => p instanceof NodePatternContext,
  );

  return isDefined(labelParent);
}

export function inRelationshipType(stopNode: ParserRuleContext) {
  const relTypeParent = findParent(
    findParent(stopNode, isLabel),
    (p) => p instanceof RelationshipPatternContext,
  );

  return isDefined(relTypeParent);
}

export function parentExpression(stopNode: ParserRuleContext) {
  return findParent(stopNode, (p) => p instanceof Expression2Context);
}

export function inProcedureName(stopNode: ParserRuleContext) {
  const procParent = findParent(
    stopNode,
    (p) => p instanceof ProcedureNameContext,
  );

  return isDefined(procParent);
}

export function autocompleteLabels(dbInfo: DbInfo) {
  return dbInfo.labels.map((t) => {
    return {
      label: t,
      kind: CompletionItemKind.TypeParameter,
    };
  });
}

export function autocompleteRelTypes(dbInfo: DbInfo) {
  return dbInfo.relationshipTypes.map((t) => {
    return {
      label: t,
      kind: CompletionItemKind.TypeParameter,
    };
  });
}

export function autoCompleteFunctions(dbInfo: DbInfo, expr: ParserRuleContext) {
  return Array.from(dbInfo.functionSignatures.keys())
    .filter((functionName) => {
      return functionName.startsWith(expr.getText());
    })
    .map((t) => {
      return {
        label: t,
        kind: CompletionItemKind.Function,
      };
    });
}

export function autoCompleteProcNames(dbInfo: DbInfo) {
  return Array.from(dbInfo.procedureSignatures.keys()).map((t) => {
    return {
      label: t,
      kind: CompletionItemKind.Function,
    };
  });
}

export function positionIsParsableToken(lastToken: Token, position: Position) {
  const tokenLength = lastToken.text?.length ?? 0;
  return (
    lastToken.column + tokenLength === position.character &&
    lastToken.line - 1 === position.line
  );
}

export function autoCompleteStructurally(
  parsingResult: ParsingResult,
  position: Position,
  dbInfo: DbInfo,
): CompletionItem[] | undefined {
  const tokens = parsingResult.tokens;
  const tree = parsingResult.result;
  const lastToken = tokens[tokens.length - 2];

  if (!positionIsParsableToken(lastToken, position)) {
    return [];
  } else if (lastToken.type === CypherParser.SPACE) {
    // If the last token is a space, we surely cannot auto-complete using parsing tree information
    return undefined;
  } else {
    const stopNode = findStopNode(tree);

    if (inNodeLabel(stopNode)) {
      return autocompleteLabels(dbInfo);
    } else if (inRelationshipType(stopNode)) {
      return autocompleteRelTypes(dbInfo);
    } else {
      // Completes expressions that are prefixes of function names as function names
      const expr = parentExpression(stopNode);

      if (isDefined(expr)) {
        return autoCompleteFunctions(dbInfo, expr);
      } else if (inProcedureName(stopNode)) {
        return autoCompleteProcNames(dbInfo);
      } else {
        return undefined;
      }
    }
  }
}

export function autoCompleteStructurallyAddingChar(
  textUntilPosition: string,
  oldPosition: Position,
  dbInfo: DbInfo,
): CompletionItem[] | undefined {
  // Try adding a filling character, x, at the end
  const position = Position.create(oldPosition.line, oldPosition.character + 1);
  const parsingResult = parserWrapper.parse(textUntilPosition + 'x');
  const tokens = parsingResult.tokens;
  const tree = parsingResult.result;
  const lastToken = tokens[tokens.length - 2];

  if (!positionIsParsableToken(lastToken, position)) {
    return [];
  } else if (lastToken.type === CypherParser.SPACE) {
    // If the last token is a space, we surely cannot auto-complete using parsing tree information
    return undefined;
  } else {
    const stopNode = findStopNode(tree);

    if (inNodeLabel(stopNode)) {
      return autocompleteLabels(dbInfo);
    } else if (inRelationshipType(stopNode)) {
      return autocompleteRelTypes(dbInfo);
    } else if (inLabel(stopNode)) {
      // TODO This requires finer grain polishing
      // Unless we build a symbol table, we cannot distinguish in a
      // WHERE type predicate between a node:
      //
      // MATCH (n) WHERE n :A|B
      // RETURN n
      //
      // and a relationship:
      //
      // MATCH (n)-[r]-(m) WHERE r :A|B
      // RETURN n
      return autocompleteLabels(dbInfo).concat(autocompleteRelTypes(dbInfo));
    } else {
      return undefined;
    }
  }
}

export function completionCoreCompletion(
  parsingResult: ParsingResult,
  dbInfo: DbInfo,
) {
  const parser = parsingResult.parser;
  const tokens = parsingResult.tokens;

  const codeCompletion = new CodeCompletionCore(parser);

  // We always need to subtract one more for the final EOF
  const caretIndex = tokens.length - 2;

  if (caretIndex >= 0) {
    // We need this to ignore the list of tokens from:
    // * unescapedSymbolicNameString, because a lot of keywords are allowed there
    // * escapedSymbolicNameString, to avoid showing ESCAPED_SYMBOLIC_NAME
    //
    // That way we do not populate tokens that are coming from those rules and those
    // are collected as rule names instead
    codeCompletion.preferredRules = new Set<number>()
      .add(CypherParser.RULE_unescapedSymbolicNameString)
      .add(CypherParser.RULE_escapedSymbolicNameString)
      .add(CypherParser.RULE_stringLiteral)
      .add(CypherParser.RULE_symbolicAliasName);

    // Keep only keywords as suggestions
    codeCompletion.ignoredTokens = new Set<number>(
      Object.entries(lexerSymbols)
        .filter(([, type]) => type !== CypherTokenType.keyword)
        .map(([token]) => Number(token)),
    );

    const candidates = codeCompletion.collectCandidates(caretIndex);

    const ruleCompletions = Array.from(candidates.rules.entries())
      .flatMap((candidate) => {
        const [ruleNumber, candidateRule] = candidate;
        if (ruleNumber === CypherParser.RULE_symbolicAliasName) {
          // For some reason we get completions again even though we have already completed
          // For example "SHOW DATABASE neo4j" would suggest "neo4j" again
          // it is as though the whitespace isn't respected

          /*
          const usedRules = candidateRule.ruleList.map(

            (rule) => CypherParser.ruleNames[rule],
          );
          console.log(usedRules);
           console.log(candidateRule.startTokenIndex);

         if(parsingResult.query.endsWith(' ')) {}
           */

          const rulesCreatingNewAliasOrDb = [
            CypherParser.RULE_createAlias,
            CypherParser.RULE_createDatabase,
            CypherParser.RULE_createCompositeDatabase,
          ];
          // avoid suggesting database names when creating a new alias or database
          if (
            rulesCreatingNewAliasOrDb.some((rule) =>
              candidateRule.ruleList.includes(rule),
            )
          ) {
            return null;
          }

          const rulesThatOnlyAcceptAlias = [
            CypherParser.RULE_dropAlias,
            CypherParser.RULE_alterAlias,
            CypherParser.RULE_showAliases,
          ];
          if (
            rulesThatOnlyAcceptAlias.some((rule) =>
              candidateRule.ruleList.includes(rule),
            )
          ) {
            return dbInfo.aliasNames.map((aliasName) => ({
              label: aliasName,
              kind: CompletionItemKind.Value,
            }));
          }

          // Suggest both database and alias names when it's not alias specific or creating new alias or database
          return dbInfo.databaseNames
            .concat(dbInfo.aliasNames)
            .map((databaseName) => ({
              label: databaseName,
              kind: CompletionItemKind.Value,
            }));
        }
        return null;
      })
      .filter((r) => r !== null);

    const tokens = candidates.tokens.entries();
    const tokenCandidates = Array.from(tokens).flatMap((value) => {
      const [tokenNumber, followUpList] = value;

      const firstToken = tokenNames[tokenNumber];
      const followUpString = followUpList.indexes
        .map((i) => tokenNames[i])
        .join(' ');

      if (firstToken === undefined) {
        return [];
      } else if (followUpString === '') {
        return [firstToken];
      } else {
        const followUp = firstToken + ' ' + followUpString;
        if (followUpList.optional) {
          return [firstToken, followUp];
        }

        return [followUp];
      }
    });

    const tokenCompletions: CompletionItem[] = tokenCandidates.map((t) => ({
      label: t,
      kind: CompletionItemKind.Keyword,
    }));

    return [...ruleCompletions, ...tokenCompletions];
  } else {
    return [];
  }
}
