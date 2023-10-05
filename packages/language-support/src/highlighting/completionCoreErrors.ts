import { CodeCompletionCore } from 'antlr4-c3';
import { Diagnostic } from 'vscode-languageserver-types';
import { DbSchema } from '../dbSchema';
import CypherParser from '../generated-parser/CypherParser';
import { tokenNames } from '../lexerSymbols';
import { EnrichedParsingResult } from '../parserWrapper';
import {
  normalizedLevenshteinDistance,
  similarityForSuggestions,
} from './syntaxValidationHelpers';

export function completionCoreErrormessage(
  parsingResult: EnrichedParsingResult,
  diag: Diagnostic,
  schema: DbSchema = {},
): Diagnostic {
  const parser = parsingResult.parser;
  const tokens = parsingResult.tokens;

  const codeCompletion = new CodeCompletionCore(parser);

  const caretIndex = tokens.findIndex(
    (t) =>
      t.line - 1 === diag.range.start.line &&
      t.column === diag.range.start.character,
  );

  const nameOfRule: Record<number, string> = {
    [CypherParser.RULE_expression]: 'an expression',
    [CypherParser.RULE_labelExpression1]: 'a node label / rel type',
    [CypherParser.RULE_procedureName]: 'a procedure name',
    [CypherParser.RULE_mapLiteral]: 'a map literal',
    [CypherParser.RULE_parameter]: 'a parameter',
    [CypherParser.RULE_stringToken]: 'a string',
    [CypherParser.RULE_symbolicNameString]: 'a name',
    [CypherParser.RULE_symbolicAliasName]: 'a database name',
  };

  // THESE never trigger because we don't give errors on misspelled parameters, labels, etc.
  // since they are grammatically correct
  const {
    labels = [],
    relationshipTypes = [],
    procedureSignatures = [],
    parameters = {},
    databaseNames = {},
    aliasNames = [],
  } = schema;
  const concreteValues: Record<number, string[]> = {
    [CypherParser.RULE_labelExpression1]: labels.concat(relationshipTypes),
    [CypherParser.RULE_procedureName]: Object.keys(procedureSignatures),
    [CypherParser.RULE_parameter]: Object.keys(parameters),
    [CypherParser.RULE_symbolicAliasName]:
      Object.keys(databaseNames).concat(aliasNames),
  };

  codeCompletion.preferredRules = new Set<number>(
    Object.keys(nameOfRule).map((n) => parseInt(n, 10)),
  );

  const errorText = tokens[caretIndex].text;

  const matchingErrorNode = parsingResult.errorContexts.find(
    (errorNode) =>
      diag.range.start.line === errorNode.parentCtx.start.line &&
      diag.range.start.character === errorNode.parentCtx.start.column,
  );
  console.log(
    'matchingErrorNode',
    matchingErrorNode,
    parsingResult.errorContexts,
    diag,
  );

  const candidates = codeCompletion.collectCandidates(
    caretIndex,
    // this only works for the last error
    // @ts-expect-error antrl-c3 has updated to correct antlr type
    parsingResult.stopNode.parentCtx,
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

  const ruleConcreteValues = ruleCandidates.flatMap((ruleNumber) => {
    const hasValue = concreteValues[ruleNumber];
    if (hasValue) {
      return hasValue;
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
  const options = [...tokenCandidates, ...humanReadableRulename];

  if (options.length === 0) {
    return diag;
  }

  const closenessOptions = [...tokenCandidates, ...ruleConcreteValues];

  const bestSuggestion = closenessOptions.reduce<{
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
    return {
      ...diag,
      message: `Did you mean ${bestSuggestion.currentBest}?`,
    };
  }

  if (options.length <= 2) {
    return { ...diag, message: `Expected ${options.join(' or ')}.` };
  } else {
    return {
      ...diag,
      message: `Expected any of ${options
        .slice(0, -1)
        .join(', ')} or ${options.at(-1)}.`,
    };
  }
}
