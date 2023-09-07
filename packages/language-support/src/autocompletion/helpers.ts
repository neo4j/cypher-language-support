import { CandidateRule, CodeCompletionCore, RuleList } from 'antlr4-c3';
import {
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver-types';
import { DbInfo, ParameterType, parameterTypeIsStorable } from '../dbInfo';
import CypherLexer from '../generated-parser/CypherLexer';
import CypherParser from '../generated-parser/CypherParser';
import { CypherTokenType, lexerSymbols, tokenNames } from '../lexerSymbols';
import { EnrichedParsingResult, ParsingResult } from '../parserWrapper';

const labelCompletions = (dbInfo: DbInfo) =>
  dbInfo.labels.map((labelName) => ({
    label: labelName,
    kind: CompletionItemKind.TypeParameter,
  }));

const reltypeCompletions = (dbInfo: DbInfo) =>
  dbInfo.relationshipTypes.map((relType) => ({
    label: relType,
    kind: CompletionItemKind.TypeParameter,
  }));
const proceduresCompletions = (dbInfo: DbInfo) =>
  Object.keys(dbInfo.procedureSignatures).map((procedureName) => ({
    label: procedureName,
    kind: CompletionItemKind.Function,
  }));
const functionCompletions = (dbInfo: DbInfo) =>
  Object.keys(dbInfo.functionSignatures).map((fnName) => ({
    label: fnName,
    kind: CompletionItemKind.Function,
  }));
const parameterCompletions = (
  dbInfo: DbInfo,
  expectedType: ExpectedParameterType,
): CompletionItem[] =>
  Object.entries(dbInfo.parameterTypes)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, paramType]) =>
      isExpectedParameterType(expectedType, paramType),
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([paramName, _]) => ({
      label: `$${paramName}`,
      kind: CompletionItemKind.Variable,
    }));

const ancestorsAre = (rules: RuleList, context: CandidateRule): boolean =>
  context.ruleList.length >= rules.length &&
  rules.every(
    (value, index) => context.ruleList.at(-(rules.length - index)) === value,
  );

const propertyKeyCompletions = (dbInfo: DbInfo): CompletionItem[] =>
  dbInfo.propertyKeys.map((propertyKey) => ({
    label: propertyKey,
    kind: CompletionItemKind.Property,
  }));

enum ExpectedParameterType {
  String,
  Map,
  Storable,
  Any,
}

const inferExpectedParameterTypeFromContext = (context: CandidateRule) => {
  if (
    ancestorsAre([CypherParser.RULE_stringOrParameter], context) ||
    ancestorsAre([CypherParser.RULE_symbolicNameOrStringParameter], context) ||
    ancestorsAre([CypherParser.RULE_passwordExpression], context)
  ) {
    return ExpectedParameterType.String;
  } else if (
    ancestorsAre([CypherParser.RULE_properties], context) ||
    ancestorsAre([CypherParser.RULE_mapOrParameter], context)
  ) {
    return ExpectedParameterType.Map;
  } else {
    return ExpectedParameterType.Any;
  }
};

const isExpectedParameterType = (
  expected: ExpectedParameterType,
  actual: ParameterType,
) =>
  expected === ExpectedParameterType.Any ||
  (expected === ExpectedParameterType.Storable &&
    parameterTypeIsStorable(actual)) ||
  (expected === ExpectedParameterType.String &&
    actual === ParameterType.String) ||
  (expected === ExpectedParameterType.Map && actual === ParameterType.Map);

export function completionCoreCompletion(
  parsingResult: EnrichedParsingResult,
  dbInfo: DbInfo,
): CompletionItem[] {
  const parser = parsingResult.parser;
  const tokens = parsingResult.tokens;

  const codeCompletion = new CodeCompletionCore(parser);

  // We always need to subtract one for the EOF
  // Except if the query is empty and only contains EOF
  let caretIndex = tokens.length > 1 ? tokens.length - 1 : 0;

  const eof = tokens[caretIndex];

  // When we have EOF with a different text in the token, it means the parser has failed to parse it.
  // We give empty completions in that case because the query is severely broken at the
  // point of completion (e.g. an unclosed string)
  if (eof.text !== '<EOF>') {
    return [];
  }

  // If the previous token is an identifier, we don't count it as "finished" so we move the caret back one token
  // The identfier is finished when the last token is a SPACE or dot etc. etc.
  // this allows us to give completions that replace the current text => for example `RET` <- it's parsed as an identifier
  // The need for this caret movement is outlined in the documentation of antlr4-c3 in the section about caret position
  if (tokens[caretIndex - 1]?.type === CypherLexer.IDENTIFIER) {
    caretIndex--;
  }

  codeCompletion.preferredRules = new Set<number>([
    CypherParser.RULE_functionName,
    CypherParser.RULE_procedureName,
    CypherParser.RULE_labelExpression1,
    CypherParser.RULE_symbolicAliasName,
    CypherParser.RULE_parameter,
    CypherParser.RULE_propertyKeyName,
    CypherParser.RULE_variable,

    // Because of the overlap of keywords and identifiers in cypher
    // We will suggest keywords when users type identifiers as well
    // To avoid this we want custom completion for identifiers
    // Until we've covered all the ways we can reach symbolic name string we'll keep this here
    // Ideally we'd find another way to get around this issue
    CypherParser.RULE_symbolicNameString,
  ]);

  // Keep only keywords as suggestions
  codeCompletion.ignoredTokens = new Set<number>(
    Object.entries(lexerSymbols)
      .filter(([, type]) => type !== CypherTokenType.keyword)
      .map(([token]) => Number(token)),
  );

  const candidates = codeCompletion.collectCandidates(caretIndex);

  const ruleCompletions = Array.from(candidates.rules.entries()).flatMap(
    (candidate): CompletionItem[] => {
      const [ruleNumber, candidateRule] = candidate;
      if (ruleNumber === CypherParser.RULE_functionName) {
        return functionCompletions(dbInfo);
      }

      if (ruleNumber === CypherParser.RULE_procedureName) {
        return proceduresCompletions(dbInfo);
      }

      if (ruleNumber === CypherParser.RULE_parameter) {
        return parameterCompletions(
          dbInfo,
          inferExpectedParameterTypeFromContext(candidateRule),
        );
      }

      if (ruleNumber === CypherParser.RULE_propertyKeyName) {
        // Map literal keys are also parsed as "propertyKey"s even though
        // they are not considered propertyKeys by the database
        // We check if the parent mapLiteral is used as a literal
        // to avoid suggesting property keys when defining a map literal
        const parentRule = candidateRule.ruleList.at(-1);
        const grandParentRule = candidateRule.ruleList.at(-2);
        if (
          parentRule === CypherParser.RULE_mapLiteral &&
          grandParentRule === CypherParser.RULE_literal
        ) {
          return [];
        }

        return propertyKeyCompletions(dbInfo);
      }

      if (ruleNumber === CypherParser.RULE_variable) {
        const parentRule = candidateRule.ruleList.at(-1);
        // some rules only define, never use variables
        const rulesDefiningVariables = [
          CypherParser.RULE_returnItem,
          CypherParser.RULE_unwindClause,
          CypherParser.RULE_subqueryInTransactionsReportParameters,
          CypherParser.RULE_procedureResultItem,
          CypherParser.RULE_foreachClause,
          CypherParser.RULE_loadCSVClause,
          CypherParser.RULE_reduceExpression,
          CypherParser.RULE_allExpression,
          CypherParser.RULE_anyExpression,
          CypherParser.RULE_noneExpression,
          CypherParser.RULE_singleExpression,
        ];
        if (rulesDefiningVariables.includes(parentRule)) {
          return [];
        }

        return parsingResult.collectedVariables.map((variableNames) => ({
          label: variableNames,
          kind: CompletionItemKind.Variable,
        }));
      }

      if (ruleNumber === CypherParser.RULE_symbolicAliasName) {
        return completeAliasName({ candidateRule, dbInfo, parsingResult });
      }

      if (ruleNumber === CypherParser.RULE_labelExpression1) {
        const topExprIndex = candidateRule.ruleList.indexOf(
          CypherParser.RULE_labelExpression,
        );

        const topExprParent = candidateRule.ruleList[topExprIndex - 1];

        if (topExprParent === undefined) {
          return [];
        }

        if (topExprParent === CypherParser.RULE_nodePattern) {
          return labelCompletions(dbInfo);
        }

        if (topExprParent === CypherParser.RULE_relationshipPattern) {
          return reltypeCompletions(dbInfo);
        }

        if (topExprParent === CypherParser.RULE_labelExpressionPredicate) {
          return [...labelCompletions(dbInfo), ...reltypeCompletions(dbInfo)];
        }
      }
      return [];
    },
  );

  const tokenEntries = candidates.tokens.entries();
  const tokenCandidates = Array.from(tokenEntries).flatMap((value) => {
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
}

type CompletionHelperArgs = {
  parsingResult: ParsingResult;
  dbInfo: DbInfo;
  candidateRule: CandidateRule;
};
function completeAliasName({
  candidateRule,
  dbInfo,
  parsingResult,
}: CompletionHelperArgs): CompletionItem[] {
  // The rule for RULE_symbolicAliasName technically allows for spaces given that a dot is included in the name
  // so ALTER ALIAS a . b  FOR DATABASE neo4j is accepted by neo4j. It does however only drop the spaces for the alias
  // it becomes just a.b

  // The issue for us is that when we complete "ALTER ALIAS a " <- according to the grammar points say we could still be building a name
  // To handle this we check if the token after the first identifier in the rule is a space (as opposed to a dot)
  // if so we have a false positive and we return null to ignore the rule
  // symbolicAliasName: (symbolicNameString (DOT symbolicNameString)* | parameter);
  if (
    parsingResult.tokens[candidateRule.startTokenIndex + 1]?.type ===
    CypherLexer.SPACE
  ) {
    return [];
  }

  // parameters are valid values in all cases of symbolicAliasName
  const baseSuggestions = parameterCompletions(
    dbInfo,
    ExpectedParameterType.String,
  );
  const rulesCreatingNewAliasOrDb = [
    CypherParser.RULE_createAlias,
    CypherParser.RULE_createDatabase,
    CypherParser.RULE_createCompositeDatabase,
  ];
  // avoid suggesting existing database names when creating a new alias or database
  if (
    rulesCreatingNewAliasOrDb.some((rule) =>
      candidateRule.ruleList.includes(rule),
    )
  ) {
    return baseSuggestions;
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
    return [
      ...baseSuggestions,
      ...dbInfo.aliasNames.map((aliasName) => ({
        label: aliasName,
        kind: CompletionItemKind.Value,
      })),
    ];
  }

  // Suggest both database and alias names when it's not alias specific or creating new alias or database
  return [
    ...baseSuggestions,
    ...dbInfo.databaseNames.concat(dbInfo.aliasNames).map((databaseName) => ({
      label: databaseName,
      kind: CompletionItemKind.Value,
    })),
  ];
}
