import { Token } from 'antlr4';
import { CodeCompletionCore, ParserRuleContext } from 'antlr4-c3';
import { distance } from 'fastest-levenshtein';
import { getTokenCandidates } from '../autocompletion/completionCoreCompletions';
import CypherParser from '../generated-parser/CypherParser';

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

  const tokenCandidates = getTokenCandidates(candidates);
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
