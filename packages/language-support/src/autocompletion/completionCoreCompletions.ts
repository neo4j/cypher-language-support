import { Token } from 'antlr4';
import type { CandidateRule, CandidatesCollection } from 'antlr4-c3';
import { CodeCompletionCore } from 'antlr4-c3';
import {
  CompletionItemKind,
  CompletionItemTag,
  InsertTextFormat,
} from 'vscode-languageserver-types';
import { DbSchema } from '../dbSchema';
import Cypher5Lexer from '../generated-parser/Cypher5CmdLexer';
import Cypher5Parser, {
  Expression2_Cypher5Context,
} from '../generated-parser/Cypher5CmdParser';
import { findPreviousNonSpace, rulesDefiningVariables } from '../helpers';
import {
  CypherTokenType,
  lexerKeywords,
  lexerSymbols,
  tokenNames,
} from '../lexerSymbols';

import { ParsedStatement } from '../parserWrapper';

import { _internalFeatureFlags } from '../featureFlags';
import { CompletionItem, Neo4jFunction, Neo4jProcedure } from '../types';

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
): CompletionItem[] =>
  namespacedCompletion(
    candidateRule,
    tokens,
    dbSchema?.functions ?? {},
    'function',
  );

const procedureNameCompletions = (
  candidateRule: CandidateRule,
  tokens: Token[],
  dbSchema: DbSchema,
): CompletionItem[] =>
  namespacedCompletion(
    candidateRule,
    tokens,
    dbSchema?.procedures ?? {},
    'procedure',
  );

function isDeprecated(arg: Neo4jFunction | Neo4jProcedure | undefined) {
  if ('option' in arg) {
    return arg.option.deprecated;
  } else if ('isDeprecated' in arg) {
    return arg.isDeprecated;
  } else {
    return false;
  }
}

function getMethodCompletionItem(
  label: string,
  fullName: string,
  signatures: Record<string, Neo4jFunction | Neo4jProcedure>,
  type: 'procedure' | 'function',
  kind: CompletionItemKind,
): CompletionItem {
  const maybeSignature = signatures[fullName];
  const typeDetail = type === 'procedure' ? '(procedure)' : '(function)';
  const deprecated = isDeprecated(maybeSignature);
  const maybeTags: { tags?: CompletionItemTag[] } = deprecated
    ? { tags: [CompletionItemTag.Deprecated] }
    : {};
  const maybeMethodSignature = maybeSignature
    ? { signature: maybeSignature.signature }
    : {};

  return {
    ...maybeTags,
    ...maybeMethodSignature,
    label,
    kind,
    detail: typeDetail,
    documentation: maybeSignature?.description ?? '',
  };
}

const namespacedCompletion = (
  candidateRule: CandidateRule,
  tokens: Token[],
  signatures: Record<string, Neo4jFunction> | Record<string, Neo4jProcedure>,
  type: 'procedure' | 'function',
): CompletionItem[] => {
  const fullNames = Object.keys(signatures);
  const namespacePrefix = calculateNamespacePrefix(candidateRule, tokens);
  if (namespacePrefix === null) {
    return [];
  }

  const kind =
    type === 'procedure'
      ? CompletionItemKind.Method
      : CompletionItemKind.Function;

  if (namespacePrefix === '') {
    // If we don't have any prefix show full functions and top level namespaces
    const topLevelPrefixes = fullNames
      .filter((fn) => fn.includes('.'))
      .map((fnName) => fnName.split('.')[0]);

    return uniq(topLevelPrefixes)
      .map(
        (label) => ({ label, kind, detail: `(namespace)` } as CompletionItem),
      )
      .concat(
        fullNames.map((label) => {
          const result = getMethodCompletionItem(
            label,
            label,
            signatures,
            type,
            kind,
          );

          return result;
        }),
      );
  } else {
    // if we have a namespace prefix, complete on the namespace level:
    // apoc. => show `util` | `load` | `date` etc.

    const funcOptions = new Set<{ completion: string; fullName: string }>();
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
            funcOptions.add({ completion: option, fullName: name });
          } else {
            namespaceOptions.add(option);
          }
        }
      }
    }

    // test handle namespace with same name as function
    const functionNameCompletions: CompletionItem[] = Array.from(
      funcOptions,
    ).map(({ completion: label, fullName }) =>
      getMethodCompletionItem(label, fullName, signatures, type, kind),
    );

    const namespaceCompletions: CompletionItem[] = Array.from(
      namespaceOptions,
    ).map((label) => ({
      label,
      kind,
      detail: '(namespace)',
    }));

    return functionNameCompletions.concat(namespaceCompletions);
  }
};

function getTokenCompletions(
  candidates: CandidatesCollection,
  ignoredTokens: Set<number>,
): CompletionItem[] {
  const tokenEntries = candidates.tokens.entries();

  const completions = Array.from(tokenEntries).flatMap((value) => {
    const [tokenNumber, followUpList] = value;

    if (!ignoredTokens.has(tokenNumber)) {
      const isConsoleCommand =
        lexerSymbols[tokenNumber] === CypherTokenType.consoleCommand;

      const kind = isConsoleCommand
        ? CompletionItemKind.Event
        : CompletionItemKind.Keyword;

      const firstToken = isConsoleCommand
        ? tokenNames[tokenNumber].toLowerCase()
        : tokenNames[tokenNumber];

      const followUpIndexes = followUpList.indexes;
      const firstIgnoredToken = followUpIndexes.findIndex((t) =>
        ignoredTokens.has(t),
      );

      const followUpTokens = followUpIndexes.slice(
        0,
        firstIgnoredToken >= 0 ? firstIgnoredToken : followUpIndexes.length,
      );

      const followUpString = followUpTokens.map((i) => tokenNames[i]).join(' ');

      if (firstToken === undefined) {
        return [];
      } else if (followUpString === '') {
        return [{ label: firstToken, kind }];
      } else {
        const followUp =
          firstToken +
          ' ' +
          (isConsoleCommand ? followUpString.toLowerCase() : followUpString);

        if (followUpList.optional) {
          return [
            { label: firstToken, kind },
            { label: followUp, kind },
          ];
        }

        return [{ label: followUp, kind }];
      }
    } else {
      return [];
    }
  });

  return completions;
}

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
      Cypher5Parser.RULE_stringOrParameter_Cypher5,
      Cypher5Parser.RULE_commandNameExpression_Cypher5,
      Cypher5Parser.RULE_symbolicNameOrStringParameter_Cypher5,
      Cypher5Parser.RULE_symbolicNameOrStringParameterList_Cypher5,
      Cypher5Parser.RULE_symbolicAliasNameOrParameter_Cypher5,
      Cypher5Parser.RULE_passwordExpression_Cypher5,
      Cypher5Parser.RULE_createUser_Cypher5,
      Cypher5Parser.RULE_dropUser_Cypher5,
      Cypher5Parser.RULE_alterUser_Cypher5,
      Cypher5Parser.RULE_renameUser_Cypher5,
      Cypher5Parser.RULE_createRole_Cypher5,
      Cypher5Parser.RULE_dropRole_Cypher5,
      Cypher5Parser.RULE_userNames_Cypher5,
      Cypher5Parser.RULE_roleNames_Cypher5,
      Cypher5Parser.RULE_renameRole_Cypher5,
    ].includes(parentRule)
  ) {
    return ExpectedParameterType.String;
  } else if (
    [
      Cypher5Parser.RULE_properties_Cypher5,
      Cypher5Parser.RULE_mapOrParameter_Cypher5,
    ].includes(parentRule)
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
      token.type !== Cypher5Lexer.SPACE && token.type !== Cypher5Lexer.EOF,
  );

  const lastNonSpaceIsDot = nonSpaceTokens.at(-1)?.type === Cypher5Lexer.DOT;

  // `gds version` is invalid but `gds .version` and `gds. version` are valid
  // so if the last token is a space and the last non-space token
  // is anything but a dot return empty completions to avoid
  // creating invalid suggestions (db ping)
  if (lastNonEOFToken?.type === Cypher5Lexer.SPACE && !lastNonSpaceIsDot) {
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
  parsingResult: ParsedStatement,
  dbSchema: DbSchema,
  caretToken: Token,
  manualTrigger = false,
): CompletionItem[] {
  const parser = parsingResult.parser;
  const tokens = parsingResult.tokens;

  const codeCompletion = new CodeCompletionCore(parser);

  let caretIndex = caretToken.tokenIndex;
  // Move the caret index to the end of the query
  const eofIndex = tokens.length > 0 ? tokens.length - 1 : 0;

  const eof = tokens[eofIndex];

  // When we have EOF with a different text in the token, it means the parser has failed to parse it.
  // We give empty completions in that case because the query is severely broken at the
  // point of completion (e.g. an unclosed string)
  if (eof.type === Cypher5Lexer.EOF && eof.text !== '<EOF>') {
    return [];
  }

  // If the previous token is an identifier, we don't count it as "finished" so we move the caret back one token
  // The identifier is finished when the last token is a SPACE or dot etc. etc.
  // this allows us to give completions that replace the current text => for example `RET` <- it's parsed as an identifier
  // The need for this caret movement is outlined in the documentation of antlr4-c3 in the section about caret position
  // When an identifier overlaps with a keyword, it's no longer treats as an identifier (although it's a valid identifier)
  // So we need to move the caret back for keywords as well
  const previousToken = tokens[caretIndex - 1]?.type;
  if (
    previousToken === Cypher5Lexer.IDENTIFIER ||
    lexerKeywords.includes(previousToken)
  ) {
    caretIndex--;
  }

  codeCompletion.preferredRules = new Set<number>([
    Cypher5Parser.RULE_functionName_Cypher5,
    Cypher5Parser.RULE_procedureName_Cypher5,
    Cypher5Parser.RULE_labelExpression1_Cypher5,
    Cypher5Parser.RULE_symbolicAliasName_Cypher5,
    Cypher5Parser.RULE_parameter_Cypher5,
    Cypher5Parser.RULE_propertyKeyName_Cypher5,
    Cypher5Parser.RULE_variable_Cypher5,
    Cypher5Parser.RULE_leftArrow_Cypher5,
    // this rule is used for usernames and roles.
    Cypher5Parser.RULE_commandNameExpression_Cypher5,

    // Either enable the helper rules for lexer clashes,
    // or collect all console commands like below with symbolicNameString
    ...(_internalFeatureFlags.consoleCommands
      ? [
          Cypher5Parser.RULE_useCompletionRule,
          Cypher5Parser.RULE_listCompletionRule,
        ]
      : [Cypher5Parser.RULE_consoleCommand]),

    // Because of the overlap of keywords and identifiers in cypher
    // We will suggest keywords when users type identifiers as well
    // To avoid this we want custom completion for identifiers
    // Until we've covered all the ways we can reach symbolic name string we'll keep this here
    // Ideally we'd find another way to get around this issue
    Cypher5Parser.RULE_symbolicNameString_Cypher5,
  ]);

  // Keep only keywords as suggestions
  const ignoredTokens = new Set<number>(
    Object.entries(lexerSymbols)
      .filter(
        ([, type]) =>
          type !== CypherTokenType.keyword &&
          type !== CypherTokenType.consoleCommand,
      )
      .map(([token]) => Number(token)),
  );

  const candidates = codeCompletion.collectCandidates(caretIndex);

  const ruleCompletions = Array.from(candidates.rules.entries()).flatMap(
    (candidate): CompletionItem[] => {
      const [ruleNumber, candidateRule] = candidate;
      if (ruleNumber === Cypher5Parser.RULE_functionName_Cypher5) {
        return functionNameCompletions(candidateRule, tokens, dbSchema);
      }

      if (ruleNumber === Cypher5Parser.RULE_procedureName_Cypher5) {
        return procedureNameCompletions(candidateRule, tokens, dbSchema);
      }

      if (ruleNumber === Cypher5Parser.RULE_parameter_Cypher5) {
        return parameterCompletions(
          dbSchema,
          inferExpectedParameterTypeFromContext(candidateRule),
        );
      }

      if (ruleNumber === Cypher5Parser.RULE_propertyKeyName_Cypher5) {
        // Map literal keys are also parsed as "propertyKey"s even though
        // they are not considered propertyKeys by the database
        // We check if the parent mapLiteral is used as a literal
        // to avoid suggesting property keys when defining a map literal
        const parentRule = candidateRule.ruleList.at(-1);
        const grandParentRule = candidateRule.ruleList.at(-2);
        if (
          parentRule === Cypher5Parser.RULE_map_Cypher5 &&
          grandParentRule === Cypher5Parser.RULE_literal_Cypher5
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
          parentRule === Cypher5Parser.RULE_property_Cypher5 &&
          grandParentRule == Cypher5Parser.RULE_postFix_Cypher5 &&
          greatGrandParentRule === Cypher5Parser.RULE_expression2_Cypher5
        ) {
          const expr2 = parsingResult.stopNode?.parentCtx?.parentCtx?.parentCtx;
          if (expr2 instanceof Expression2_Cypher5Context) {
            const variableName = expr2
              .expression1_Cypher5()
              .variable_Cypher5()
              ?.getText();
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

      if (ruleNumber === Cypher5Parser.RULE_variable_Cypher5) {
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

      if (ruleNumber === Cypher5Parser.RULE_symbolicAliasName_Cypher5) {
        return completeAliasName({ candidateRule, dbSchema, parsingResult });
      }

      if (ruleNumber === Cypher5Parser.RULE_commandNameExpression_Cypher5) {
        return completeSymbolicName({ candidateRule, dbSchema, parsingResult });
      }

      if (ruleNumber === Cypher5Parser.RULE_labelExpression1_Cypher5) {
        const topExprIndex = candidateRule.ruleList.indexOf(
          Cypher5Parser.RULE_labelExpression_Cypher5,
        );

        const topExprParent = candidateRule.ruleList[topExprIndex - 1];

        if (topExprParent === undefined) {
          return [];
        }

        if (topExprParent === Cypher5Parser.RULE_nodePattern_Cypher5) {
          return labelCompletions(dbSchema);
        }

        if (topExprParent === Cypher5Parser.RULE_relationshipPattern_Cypher5) {
          return reltypeCompletions(dbSchema);
        }

        return [...labelCompletions(dbSchema), ...reltypeCompletions(dbSchema)];
      }

      // These are simple tokens that get completed as the wrong kind, due to a lexer conflict
      if (ruleNumber === Cypher5Parser.RULE_useCompletionRule) {
        return [{ label: 'use', kind: CompletionItemKind.Event }];
      }

      if (ruleNumber === Cypher5Parser.RULE_listCompletionRule) {
        return [{ label: 'list', kind: CompletionItemKind.Event }];
      }

      if (ruleNumber === Cypher5Parser.RULE_leftArrow_Cypher5) {
        return [
          {
            label: '-[]->()',
            kind: CompletionItemKind.Snippet,
            insertTextFormat: InsertTextFormat.Snippet,
            insertText: '-[${1: }]->(${2: })',
            detail: 'path template',
            // vscode does not call the completion provider for every single character
            // after the second character is typed (i.e) `MATCH ()-[` the completion is no longer valid
            // it'd insert `MATCH ()-[[]->()` which is not valid. Hence we filter it out by using the filterText
            filterText: '',
          },
          {
            label: '-[]-()',
            kind: CompletionItemKind.Snippet,
            insertTextFormat: InsertTextFormat.Snippet,
            insertText: '-[${1: }]-(${2: })',
            detail: 'path template',
            filterText: '',
          },
          {
            label: '<-[]-()',
            kind: CompletionItemKind.Snippet,
            insertTextFormat: InsertTextFormat.Snippet,
            insertText: '<-[${1: }]-(${2: })',
            detail: 'path template',
            filterText: '',
          },
        ];
      }

      return [];
    },
  );

  // if the completion was automatically triggered by a snippet trigger character
  // we should only return snippet completions
  if (Cypher5Lexer.RPAREN === previousToken && !manualTrigger) {
    return ruleCompletions.filter(
      (completion) => completion.kind === CompletionItemKind.Snippet,
    );
  }

  return [
    ...ruleCompletions,
    ...getTokenCompletions(candidates, ignoredTokens),
  ];
}

type CompletionHelperArgs = {
  parsingResult: ParsedStatement;
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
    Cypher5Lexer.SPACE
  ) {
    return [];
  }

  // parameters are valid values in all cases of symbolicAliasName
  const parameterSuggestions = parameterCompletions(
    dbSchema,
    ExpectedParameterType.String,
  );
  const rulesCreatingNewDb = [
    Cypher5Parser.RULE_createDatabase_Cypher5,
    Cypher5Parser.RULE_createCompositeDatabase_Cypher5,
  ];
  // avoid suggesting existing database names when creating a new database
  if (
    rulesCreatingNewDb.some((rule) => candidateRule.ruleList.includes(rule))
  ) {
    return parameterSuggestions;
  }

  // For `CREATE ALIAS aliasName FOR DATABASE databaseName`
  // Should not suggest existing aliases for aliasName but should suggest existing databases for databaseName
  // so we return base suggestions if we're at the `aliasName` rule
  if (
    candidateRule.ruleList.includes(Cypher5Parser.RULE_createAlias_Cypher5) &&
    candidateRule.ruleList.includes(Cypher5Parser.RULE_aliasName_Cypher5)
  ) {
    return parameterSuggestions;
  }

  const rulesThatOnlyAcceptAlias = [
    Cypher5Parser.RULE_dropAlias_Cypher5,
    Cypher5Parser.RULE_alterAlias_Cypher5,
    Cypher5Parser.RULE_showAliases_Cypher5,
  ];
  if (
    rulesThatOnlyAcceptAlias.some((rule) =>
      candidateRule.ruleList.includes(rule),
    )
  ) {
    return [
      ...parameterSuggestions,
      ...(dbSchema?.aliasNames ?? []).map((aliasName) => ({
        label: aliasName,
        kind: CompletionItemKind.Value,
      })),
    ];
  }

  // Suggest both database and alias names when it's not alias specific or creating new alias or database
  return [
    ...parameterSuggestions,
    ...(dbSchema.databaseNames ?? [])
      .concat(dbSchema.aliasNames ?? [])
      .map((databaseName) => ({
        label: databaseName,
        kind: CompletionItemKind.Value,
      })),
  ];
}

function completeSymbolicName({
  candidateRule,
  dbSchema,
  parsingResult,
}: CompletionHelperArgs): CompletionItem[] {
  // parameters are valid values in all cases of symbolic name
  const parameterSuggestions = parameterCompletions(
    dbSchema,
    inferExpectedParameterTypeFromContext(candidateRule),
  );

  const rulesCreatingNewUserOrRole = [
    Cypher5Parser.RULE_createUser_Cypher5,
    Cypher5Parser.RULE_createRole_Cypher5,
  ];

  const previousToken = findPreviousNonSpace(
    parsingResult.tokens,
    candidateRule.startTokenIndex,
  );
  const afterToToken = previousToken.type === Cypher5Parser.TO;
  const ruleList = candidateRule.ruleList;

  // avoid suggesting existing user names or role names when creating a new one
  if (
    rulesCreatingNewUserOrRole.some((rule) => ruleList.includes(rule)) ||
    // We are suggesting an user as target for the renaming
    //      RENAME USER existing TO target
    // so target should be non-existent
    (ruleList.includes(Cypher5Parser.RULE_renameUser_Cypher5) && afterToToken)
  ) {
    return parameterSuggestions;
  }

  const rulesThatAcceptExistingUsers = [
    Cypher5Parser.RULE_dropUser_Cypher5,
    Cypher5Parser.RULE_renameUser_Cypher5,
    Cypher5Parser.RULE_alterUser_Cypher5,
    Cypher5Parser.RULE_userNames_Cypher5,
  ];

  if (rulesThatAcceptExistingUsers.some((rule) => ruleList.includes(rule))) {
    const result = [
      ...parameterSuggestions,
      ...(dbSchema?.userNames ?? []).map((userName) => ({
        label: userName,
        kind: CompletionItemKind.Value,
      })),
    ];

    return result;
  }

  const rulesThatAcceptExistingRoles = [
    Cypher5Parser.RULE_roleNames_Cypher5,
    Cypher5Parser.RULE_dropRole_Cypher5,
    Cypher5Parser.RULE_renameRole_Cypher5,
  ];

  if (rulesThatAcceptExistingRoles.some((rule) => ruleList.includes(rule))) {
    return [
      ...parameterSuggestions,
      ...(dbSchema?.roleNames ?? []).map((roleName) => ({
        label: roleName,
        kind: CompletionItemKind.Value,
      })),
    ];
  }

  return [];
}
