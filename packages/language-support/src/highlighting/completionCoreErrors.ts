import { Token } from 'antlr4';
import { CodeCompletionCore } from 'antlr4-c3';
import { ParserRuleContext } from 'antlr4-c3/out/src/antrl4';
import CypherParser from '../generated-parser/CypherParser';
import { tokenNames } from '../lexerSymbols';
import {
  normalizedLevenshteinDistance,
  similarityForSuggestions,
} from './syntaxValidationHelpers';

export function completionCoreErrormessage(
  parser: CypherParser,
  currentToken: Token,
  ctx: ParserRuleContext,
): string | undefined {
  const codeCompletion = new CodeCompletionCore(parser);
  const caretIndex = currentToken.tokenIndex;

  const nameOfRule: Record<number, string> = {
    [CypherParser.RULE_expression]: 'an expression',
    [CypherParser.RULE_expression1]: 'an expression',
    [CypherParser.RULE_labelExpression1]: 'a node label / rel type',
    [CypherParser.RULE_labelExpression1Is]: 'a node label / rel type',
    [CypherParser.RULE_procedureName]: 'a procedure name',
    [CypherParser.RULE_mapLiteral]: 'a map literal',
    [CypherParser.RULE_parameter]: 'a parameter',
    [CypherParser.RULE_stringLiteral]: 'a string',
    [CypherParser.RULE_symbolicNameString]: 'an identifier',
    [CypherParser.RULE_symbolicAliasName]: 'a database name',
  };

  codeCompletion.preferredRules = new Set<number>(
    Object.keys(nameOfRule).map((n) => parseInt(n, 10)),
  );

  const errorText = currentToken.text;

  // const containingErrorContext = parsingResult.errorContexts.find(
  //   (errorParentCtx) =>
  //     errorParentCtx.start.start < diag.offsets.start &&
  //     errorParentCtx.stop.stop > diag.offsets.end,
  // );
  //console.log(diag.ctx);

  const candidates = codeCompletion.collectCandidates(
    caretIndex,
    // this only works for the last error
    ctx,
  );

  const ruleCandidates = Array.from(candidates.rules.keys());

  const humanReadableRulename = ruleCandidates.flatMap((ruleNumber) => {
    const name = nameOfRule[ruleNumber];
    if (name) {
      return [name];
    } else {
      return [];
    }
  });

  const tokenCandidates = Array.from(candidates.tokens.entries()).flatMap(
    (value) => {
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
    },
  );
  // Check if token candidates are all keywords and give a better message
  // or if they are all symbols
  const options = [...tokenCandidates, ...humanReadableRulename];

  if (options.length === 0) {
    return undefined;
  }

  const bestSuggestion = tokenCandidates.reduce<{
    similarity: number;
    currentBest: string;
  }>((best, suggestion) => {
    const similarity = normalizedLevenshteinDistance(suggestion, errorText);
    if (
      similarity > similarityForSuggestions &&
      (!best || similarity > best.similarity)
    ) {
      return { similarity, currentBest: suggestion };
    }
    return best;
  }, null);

  if (bestSuggestion !== null) {
    return `Did you mean ${bestSuggestion.currentBest}?`;
  }

  if (options.length <= 2) {
    return `Expected ${options.join(' or ')}.`;
  } else {
    return `Expected any of ${options.slice(0, -1).join(', ')} or ${options.at(
      -1,
    )}.`;
  }
}
