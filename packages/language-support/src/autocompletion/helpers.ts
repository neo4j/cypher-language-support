import { ParserRuleContext, TerminalNode, Token } from 'antlr4';
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
import {
  findParent,
  findRightmostStatement,
  findStopNode,
  isDefined,
} from '../helpers';
import { CypherTokenType, lexerSymbols, tokenNames } from '../lexerSymbols';
import {
  createParsingResult,
  createParsingScaffolding,
  EnrichedParsingResult,
  parserWrapper,
  ParsingResult,
} from '../parserWrapper';

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
  parsingResult: EnrichedParsingResult,
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

export function autoCompleteKeywords(
  parsingResult: ParsingResult,
): CompletionItem[] {
  let autoCompletions: CompletionItem[] = [];
  const parsingTree = parsingResult.result;
  /* If we add an extra character to a query there can be two possibilities:
      Example:     MATCH (n:A); C
     - Either it starts a new statement and we can get completions only for it
     - Or it is part of the rightmost previous statement
     Since the semicolon is optional to separate statements, for things like
       MATCH (n:A) W
     we could be trying to auto-complete W for the MATCH statement or
     be could be trying to start a new statement, so we need to concatenate 
     both results
  */

  // Removing EOF node at the end
  const lastIndex = parsingTree.getChildCount() - 2;
  const lastStatement = parsingTree.getChild(lastIndex);

  if (lastStatement instanceof TerminalNode) {
    const lastStatementResult = createParsingResult(
      createParsingScaffolding(lastStatement.symbol.text),
    );
    autoCompletions = completeKeywordsImpl(lastStatementResult);
  }
  const fullCompletions = completeKeywordsImpl(parsingResult);
  autoCompletions = autoCompletions.concat(fullCompletions);

  return autoCompletions;
}

function completeKeywordsImpl(parsingResult: ParsingResult): CompletionItem[] {
  const parser = parsingResult.parser;
  const tokens = parsingResult.tokens;
  const parsingTree = parsingResult.result;

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
      .add(CypherParser.RULE_stringLiteral);

    // Keep only keywords as suggestions
    codeCompletion.ignoredTokens = new Set<number>(
      Object.entries(lexerSymbols)
        .filter(([, type]) => type !== CypherTokenType.keyword)
        .map(([token]) => Number(token)),
    );

    const rightMostStatement = findRightmostStatement(parsingTree);
    const autoCompleteCtx = rightMostStatement
      ? rightMostStatement
      : parsingTree;

    const candidates = codeCompletion.collectCandidates(
      caretIndex,
      autoCompleteCtx,
    );
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

    const tokenCompletions: CompletionItem[] = tokenCandidates.map((t) => {
      return {
        label: t,
        kind: CompletionItemKind.Keyword,
      };
    });

    return tokenCompletions;
  } else {
    return [];
  }
}
