import { Token } from 'antlr4';
import { CodeCompletionCore, ParserRuleContext } from 'antlr4-c3';
import { distance } from 'fastest-levenshtein';
import CypherParser from '../../generated-parser/CypherParser';
import { keywordNames, tokenNames } from '../../lexerSymbols';

/*
We ask for 0.7 similarity (number between 0 and 1) for 
considering the user has made a typo when writing a symbol
*/
const similarityForSuggestions = 0.7;

function normalizedLevenshteinDistance(s1: string, s2: string): number {
  const numEdits: number = distance(s1.toUpperCase(), s2.toUpperCase());

  // normalize by length of longest string
  const longestLength = Math.max(s1.length, s2.length);
  return (longestLength - numEdits) / longestLength;
}

export function completionCoreErrormessage(
  parser: CypherParser,
  currentToken: Token,
  ctx: ParserRuleContext,
): string | undefined {
  const codeCompletion = new CodeCompletionCore(parser);
  const caretIndex = currentToken.tokenIndex;

  const rulesOfInterest: Record<number, string> = {
    [CypherParser.RULE_expression9]: 'an expression',
    [CypherParser.RULE_comparisonExpression6]: 'an expression',
    [CypherParser.RULE_labelExpression2]: 'a node label / rel type',
    [CypherParser.RULE_labelExpression2Is]: 'a node label / rel type',
    [CypherParser.RULE_procedureName]: 'a procedure name',
    [CypherParser.RULE_mapLiteral]: 'a map literal',
    [CypherParser.RULE_parameter]: 'a parameter',
    [CypherParser.RULE_stringLiteral]: 'a string',
    [CypherParser.RULE_symbolicNameString]: 'an identifier',
    [CypherParser.RULE_symbolicAliasName]: 'a database name',
  };

  codeCompletion.preferredRules = new Set<number>(
    Object.keys(rulesOfInterest).map((n) => parseInt(n, 10)),
  );

  const errorText = currentToken.text;

  const candidates = codeCompletion.collectCandidates(caretIndex, ctx);

  const ruleCandidates = Array.from(candidates.rules.keys());

  const humanReadableRulename = ruleCandidates.flatMap((ruleNumber) => {
    const name = rulesOfInterest[ruleNumber];
    if (name) {
      return [name];
    } else {
      return [];
    }
  });
  const tokenEntries = candidates.tokens.entries();

  const tokenCandidates = Array.from(tokenEntries).flatMap(([tokenNumber]) => {
    const tokenName = tokenNames[tokenNumber];
    return tokenName ? [tokenName] : [];
  });

  const keywordCandidates = tokenCandidates
    .filter((v) => keywordNames.has(v))
    .sort();
  const nonKeywordCandidates = tokenCandidates.filter(
    (v) => !keywordNames.has(v),
  );

  const options = [
    ...nonKeywordCandidates,
    ...keywordCandidates,
    ...humanReadableRulename,
  ];

  if (options.length === 0) {
    return undefined;
  }

  let errorType = '';

  if (keywordCandidates.length === tokenCandidates.length) {
    errorType = 'Unexpected keyword';
  } else {
    errorType = 'Unexpected token';
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
  }, undefined);

  if (bestSuggestion) {
    return errorType + `. Did you mean ${bestSuggestion.currentBest}?`;
  }

  if (options.length <= 2) {
    return `Expected ${options.join(' or ')}`;
  } else {
    return `Expected any of ${options.slice(0, -1).join(', ')} or ${options.at(
      -1,
    )}`;
  }
}
