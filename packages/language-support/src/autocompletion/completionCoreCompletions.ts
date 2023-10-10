import { Token } from 'antlr4';
import { CandidateRule, CodeCompletionCore } from 'antlr4-c3';
import {
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver-types';
import { DbSchema } from '../dbSchema';
import CypherLexer from '../generated-parser/CypherLexer';
import CypherParser, {
  Expression2Context,
} from '../generated-parser/CypherParser';
import { rulesDefiningVariables } from '../helpers';
import { CypherTokenType, lexerSymbols, tokenNames } from '../lexerSymbols';
import { EnrichedParsingResult, ParsingResult } from '../parserWrapper';

const uniq = <T>(arr: T[]) => Array.from(new Set(arr));

const labelCompletions = (dbSchema: DbSchema) =>
  dbSchema.labels?.map((labelName) => ({
    label: labelName,
    kind: CompletionItemKind.TypeParameter,
  })) ?? [];

const reltypeCompletions = (dbSchema: DbSchema) =>
  dbSchema.relationshipTypes?.map((relType) => ({
    label: relType,
    kind: CompletionItemKind.TypeParameter,
  })) ?? [];

const functionNameCompletions = (
  candidateRule: CandidateRule,
  tokens: Token[],
  dbSchema: DbSchema,
) =>
  namespacedCompletion(
    candidateRule,
    tokens,
    Object.keys(dbSchema?.functionSignatures ?? {}),
    'function',
  );

const procedureNameCompletions = (
  candidateRule: CandidateRule,
  tokens: Token[],
  dbSchema: DbSchema,
) =>
  namespacedCompletion(
    candidateRule,
    tokens,
    Object.keys(dbSchema?.procedureSignatures ?? {}),
    'procedure',
  );

const namespacedCompletion = (
  candidateRule: CandidateRule,
  tokens: Token[],
  fullNames: string[],
  type: 'procedure' | 'function',
) => {
  const namespacePrefix = calculateNamespacePrefix(candidateRule, tokens);
  if (namespacePrefix === null) {
    return [];
  }

  const kind =
    type === 'procedure'
      ? CompletionItemKind.Method
      : CompletionItemKind.Function;
  const detail = type === 'procedure' ? '(procedure)' : '(function)';

  if (namespacePrefix === '') {
    // If we don't have any prefix show full functions and top level namespaces
    const topLevelPrefixes = fullNames
      .filter((fn) => fn.includes('.'))
      .map((fnName) => fnName.split('.')[0]);

    return uniq(topLevelPrefixes)
      .map((label) => ({ label, kind, detail: `(namespace)` }))
      .concat(fullNames.map((label) => ({ label, kind, detail })));
  } else {
    // if we have a namespace prefix, complete on the namespace level:
    // apoc. => show `util` | `load` | `date` etc.

    const funcOptions = new Set<string>();
    const namespaceOptions = new Set<string>();

    for (const name of fullNames) {
      if (name.startsWith(namespacePrefix)) {
        // given prefix `apoc.` turn `apoc.util.sleep` => `util`
        const splitByDot = name.slice(namespacePrefix.length).split('.');
        const option = splitByDot[0];
        const isFunctionName = splitByDot.length === 1;

        // handle prefix `time.truncate.` turning `time.truncate` => ``
        if (option !== '') {
          if (isFunctionName) {
            funcOptions.add(option);
          } else {
            namespaceOptions.add(option);
          }
        }
      }
    }

    // test handle namespace with same name as function
    const functionNameCompletions = Array.from(funcOptions).map((label) => ({
      label,
      kind,
      detail,
    }));

    const namespaceCompletions = Array.from(namespaceOptions).map((label) => ({
      label,
      kind,
      detail: '(namespace)',
    }));

    return functionNameCompletions.concat(namespaceCompletions);
  }
};

const parameterCompletions = (
  dbInfo: DbSchema,
  expectedType: ExpectedParameterType,
): CompletionItem[] =>
  Object.entries(dbInfo.parameters ?? {})
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, paramType]) =>
      isExpectedParameterType(expectedType, paramType),
    )
    .map(([paramName]) => ({
      label: `$${paramName}`,
      kind: CompletionItemKind.Variable,
    }));
const propertyKeyCompletions = (dbInfo: DbSchema): CompletionItem[] =>
  dbInfo.propertyKeys?.map((propertyKey) => ({
    label: propertyKey,
    kind: CompletionItemKind.Property,
  })) ?? [];

enum ExpectedParameterType {
  String = 'STRING',
  Map = 'MAP',
  Any = 'ANY',
}

const inferExpectedParameterTypeFromContext = (context: CandidateRule) => {
  const parentRule = context.ruleList.at(-1);
  if (
    [
      CypherParser.RULE_stringOrParameter,
      CypherParser.RULE_symbolicNameOrStringParameter,
      CypherParser.RULE_passwordExpression,
    ].includes(parentRule)
  ) {
    return ExpectedParameterType.String;
  } else if (
    [CypherParser.RULE_properties, CypherParser.RULE_mapOrParameter].includes(
      parentRule,
    )
  ) {
    return ExpectedParameterType.Map;
  } else {
    return ExpectedParameterType.Any;
  }
};

const isExpectedParameterType = (
  expectedType: ExpectedParameterType,
  value: unknown,
) => {
  const typeName = typeof value;
  switch (expectedType) {
    case ExpectedParameterType.String:
      return typeName === 'string';
    case ExpectedParameterType.Map:
      return typeName === 'object';
    case ExpectedParameterType.Any:
      return true;
  }
};

function calculateNamespacePrefix(
  candidateRule: CandidateRule,
  tokens: Token[],
): string | null {
  const ruleTokens = tokens.slice(candidateRule.startTokenIndex);
  const lastNonEOFToken = ruleTokens.at(-2);

  const nonSpaceTokens = ruleTokens.filter(
    (token) =>
      token.type !== CypherLexer.SPACE && token.type !== CypherLexer.EOF,
  );

  const lastNonSpaceIsDot = nonSpaceTokens.at(-1)?.type === CypherLexer.DOT;

  // `gds version` is invalid but `gds .version` and `gds. version` are valid
  // so if the last token is a space and the last non-space token
  // is anything but a dot return empty completions to avoid
  // creating invalid suggestions (db ping)
  if (lastNonEOFToken?.type === CypherLexer.SPACE && !lastNonSpaceIsDot) {
    return null;
  }

  // calculate the current namespace prefix
  // only keep finished namespaces both second level `gds.ver` => `gds.`
  // and first level make `gds` => ''
  if (!lastNonSpaceIsDot) {
    nonSpaceTokens.pop();
  }

  const namespacePrefix = nonSpaceTokens.map((token) => token.text).join('');
  return namespacePrefix;
}

export function completionCoreCompletion(
  parsingResult: EnrichedParsingResult,
  dbSchema: DbSchema,
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
        return functionNameCompletions(candidateRule, tokens, dbSchema);
      }

      if (ruleNumber === CypherParser.RULE_procedureName) {
        return procedureNameCompletions(candidateRule, tokens, dbSchema);
      }

      if (ruleNumber === CypherParser.RULE_parameter) {
        return parameterCompletions(
          dbSchema,
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

        const greatGrandParentRule = candidateRule.ruleList.at(-3);
        // When propertyKey is used as postfix to an expr there are many false positives
        // because expression are very flexible. For this case we only suggest property
        // keys if the expr is a simple variable that is defined.
        // We still don't know the type of the variable we're completing without a symbol table
        // but it is likely to be a node/relationship
        if (
          parentRule === CypherParser.RULE_property &&
          grandParentRule == CypherParser.RULE_postFix1 &&
          greatGrandParentRule === CypherParser.RULE_expression2
        ) {
          const expr2 = parsingResult.stopNode?.parentCtx?.parentCtx?.parentCtx;
          if (expr2 instanceof Expression2Context) {
            const variableName = expr2.expression1().variable()?.getText();
            if (
              !variableName ||
              !parsingResult.collectedVariables.includes(variableName)
            ) {
              return [];
            }
          }
        }

        return propertyKeyCompletions(dbSchema);
      }

      if (ruleNumber === CypherParser.RULE_variable) {
        const parentRule = candidateRule.ruleList.at(-1);
        // some rules only define, never use variables
        if (
          typeof parentRule === 'number' &&
          rulesDefiningVariables.includes(parentRule)
        ) {
          return [];
        }

        return parsingResult.collectedVariables.map((variableNames) => ({
          label: variableNames,
          kind: CompletionItemKind.Variable,
        }));
      }

      if (ruleNumber === CypherParser.RULE_symbolicAliasName) {
        return completeAliasName({ candidateRule, dbSchema, parsingResult });
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
          return labelCompletions(dbSchema);
        }

        if (topExprParent === CypherParser.RULE_relationshipPattern) {
          return reltypeCompletions(dbSchema);
        }

        if (topExprParent === CypherParser.RULE_labelExpressionPredicate) {
          return [
            ...labelCompletions(dbSchema),
            ...reltypeCompletions(dbSchema),
          ];
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
  dbSchema: DbSchema;
  candidateRule: CandidateRule;
};
function completeAliasName({
  candidateRule,
  dbSchema,
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
    dbSchema,
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
      ...(dbSchema?.aliasNames ?? []).map((aliasName) => ({
        label: aliasName,
        kind: CompletionItemKind.Value,
      })),
    ];
  }

  // Suggest both database and alias names when it's not alias specific or creating new alias or database
  return [
    ...baseSuggestions,
    ...(dbSchema.databaseNames ?? [])
      .concat(dbSchema.aliasNames ?? [])
      .map((databaseName) => ({
        label: databaseName,
        kind: CompletionItemKind.Value,
      })),
  ];
}
