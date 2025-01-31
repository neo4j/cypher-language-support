import { Token } from 'antlr4';
import { CodeCompletionCore } from 'antlr4-c3';
import { distance } from 'fastest-levenshtein';
import { _internalFeatureFlags } from '../featureFlags';
import CypherLexer from '../generated-parser/CypherCmdLexer';
import CypherParser from '../generated-parser/CypherCmdParser';
import {
  CypherTokenType,
  keywordNames,
  lexerSymbols,
  tokenNames,
} from '../lexerSymbols';

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
): string | undefined {
  const codeCompletion = new CodeCompletionCore(parser);
  const caretIndex = currentToken.tokenIndex;

  const rulesOfInterest: Record<number, string | null> = {
    [CypherParser.RULE_expression9]: 'an expression',
    [CypherParser.RULE_labelExpression2]: 'a node label / rel type',
    [CypherParser.RULE_procedureName]: 'a procedure name',
    [CypherParser.RULE_stringLiteral]: 'a string',
    [CypherParser.RULE_numberLiteral]: 'a number literal',
    [CypherParser.RULE_parameter]: 'a parameter',
    [CypherParser.RULE_symbolicNameString]: 'an identifier',
    [CypherParser.RULE_symbolicAliasName]: 'a database name',
    [CypherParser.RULE_statement]: 'a statement',
    // Either enable the helper rules for lexer clashes,
    // or collect all console commands like below with symbolicNameString
    ...(_internalFeatureFlags.consoleCommands
      ? {
          [CypherParser.RULE_useCompletionRule]: 'use',
          [CypherParser.RULE_listCompletionRule]: 'list',
          [CypherParser.RULE_serverCompletionRule]: 'server',
        }
      : { [CypherParser.RULE_consoleCommand]: null }),
  };

  codeCompletion.preferredRules = new Set<number>(
    Object.keys(rulesOfInterest).map((n) => parseInt(n, 10)),
  );

  const errorText = currentToken.text;

  const candidates = codeCompletion.collectCandidates(caretIndex);

  const ruleCandidates = Array.from(candidates.rules.keys());

  // If we can complete only a statement, we don't want to suggest that
  // We want to be using the database errors stack instead
  if (
    ruleCandidates.length === 1 &&
    ruleCandidates[0] === CypherParser.RULE_statement
  ) {
    return undefined;
  }
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
    const isConsoleCommand =
      lexerSymbols[tokenNumber] === CypherTokenType.consoleCommand;

    const tokenName = isConsoleCommand
      ? tokenNames[tokenNumber].toLowerCase()
      : tokenNames[tokenNumber];

    // We don't want to suggest the ":" of console commands as it's not helpful even
    // when console commands are available
    if (caretIndex === 0 && tokenNumber === CypherLexer.COLON) {
      return [];
    }

    switch (tokenNumber) {
      case CypherLexer.DECIMAL_DOUBLE:
        humanReadableRulename.push('a decimal double');
        return [];
      case CypherLexer.UNSIGNED_DECIMAL_INTEGER:
        humanReadableRulename.push('an unsigned integer');
        return [];
      case CypherLexer.UNSIGNED_HEX_INTEGER:
        humanReadableRulename.push('an unsinged hexadecimal integer');
        return [];
      case CypherLexer.UNSIGNED_OCTAL_INTEGER:
        humanReadableRulename.push('an unsigned octal integer');
        return [];
      case CypherLexer.STRING_LITERAL1:
        humanReadableRulename.push('a string');
        return [];
      case CypherLexer.STRING_LITERAL2:
        humanReadableRulename.push('a string');
        return [];
      default:
        return tokenName ? [tokenName] : [];
    }
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

  if (nonKeywordCandidates.length === 0) {
    errorType = 'Unrecognized keyword';
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
