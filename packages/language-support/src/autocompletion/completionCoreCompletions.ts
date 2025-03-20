import { Token } from 'antlr4';
import type { CandidateRule, CandidatesCollection } from 'antlr4-c3';
import { CodeCompletionCore } from 'antlr4-c3';
import {
  CompletionItemKind,
  CompletionItemTag,
  InsertTextFormat,
} from 'vscode-languageserver-types';
import { DbSchema } from '../dbSchema';
import CypherLexer from '../generated-parser/CypherCmdLexer';
import CypherParser, {
  CallClauseContext,
  Expression2Context,
} from '../generated-parser/CypherCmdParser';
import {
  findParent,
  findPreviousNonSpace,
  resolveCypherVersion,
  rulesDefiningVariables,
} from '../helpers';
import {
  CypherTokenType,
  lexerKeywords,
  lexerSymbols,
  tokenNames,
} from '../lexerSymbols';

import { getMethodName, ParsedStatement } from '../parserWrapper';

import { _internalFeatureFlags } from '../featureFlags';
import {
  CompletionItem,
  CypherVersion,
  cypherVersionNumbers,
  Neo4jFunction,
  Neo4jProcedure,
} from '../types';

const uniq = <T>(arr: T[]) => Array.from(new Set(arr));

const versions = () =>
  _internalFeatureFlags.cypher25 ? cypherVersionNumbers : ['5'];

export function backtickIfNeeded(e: string): string | undefined {
  if (e == null || e == '') {
    return undefined;
  } else if (/[^\p{L}\p{N}_]/u.test(e) || /[^\p{L}_]/u.test(e[0])) {
    return `\`${e}\``;
  } else {
    return undefined;
  }
}

function backtickDbNameIfNeeded(e: string): string | undefined {
  if (e == null || e == '') {
    return undefined;
  } else if (/[^\p{L}\p{N}_.]/u.test(e) || /[^\p{L}_]/u.test(e[0])) {
    return `\`${e}\``;
  } else {
    return undefined;
  }
}

const versionCompletions = () =>
  versions().map((v) => {
    const result: CompletionItem = {
      label: v,
      kind: CompletionItemKind.EnumMember,
    };
    return result;
  });

const cypherVersionCompletions = () =>
  versions().map((v) => {
    const result: CompletionItem = {
      label: 'CYPHER ' + v,
      kind: CompletionItemKind.Keyword,
    };
    return result;
  });

const labelCompletions = (dbSchema: DbSchema) =>
  dbSchema.labels?.map((labelName) => {
    const result: CompletionItem = {
      label: labelName,
      kind: CompletionItemKind.TypeParameter,
      insertText: backtickIfNeeded(labelName),
    };
    return result;
  }) ?? [];

const reltypeCompletions = (dbSchema: DbSchema) =>
  dbSchema.relationshipTypes?.map((relType) => {
    const result: CompletionItem = {
      label: relType,
      kind: CompletionItemKind.TypeParameter,
      insertText: backtickIfNeeded(relType),
    };
    return result;
  }) ?? [];

const procedureReturnCompletions = (
  procedureName: string,
  dbSchema: DbSchema,
  cypherVersion: CypherVersion,
): CompletionItem[] => {
  return (
    dbSchema.procedures?.[cypherVersion]?.[
      procedureName
    ]?.returnDescription?.map((x) => {
      return { label: x.name, kind: CompletionItemKind.Variable };
    }) ?? []
  );
};

const functionNameCompletions = (
  candidateRule: CandidateRule,
  tokens: Token[],
  dbSchema: DbSchema,
  cypherVersion: CypherVersion,
): CompletionItem[] =>
  namespacedCompletion(
    candidateRule,
    tokens,
    dbSchema.functions?.[cypherVersion] ?? {},
    'function',
  );

const procedureNameCompletions = (
  candidateRule: CandidateRule,
  tokens: Token[],
  dbSchema: DbSchema,
  cypherVersion: CypherVersion,
): CompletionItem[] =>
  namespacedCompletion(
    candidateRule,
    tokens,
    dbSchema.procedures?.[cypherVersion] ?? {},
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
  previousToken: Token | undefined,
  expectedType: ExpectedParameterType,
): CompletionItem[] =>
  Object.entries(dbInfo.parameters ?? {})
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, paramType]) =>
      isExpectedParameterType(expectedType, paramType),
    )
    .map(([paramName]) => {
      const backtickedName = backtickIfNeeded(paramName);
      let maybeInsertText = backtickedName
        ? { insertText: `$${backtickedName}` }
        : {};
      // If there is a preceding token and it's not empty, compute the suffix
      if (previousToken && previousToken.text.trim().length > 0) {
        const param = maybeInsertText.insertText ?? `$${paramName}`;
        const suffix = computeSuffix(previousToken.text, param);
        // We need to complete parameters correctly in VSCode,
        // otherwise when we have 'RETURN $' and we get offered $param
        // we would complete RETURN $$param, which is not what we want
        maybeInsertText = suffix ? { insertText: suffix } : {};
      }

      return {
        label: `$${paramName}`,
        kind: CompletionItemKind.Variable,
        ...maybeInsertText,
      };
    });

function computeSuffix(prefix: string, param: string): string | undefined {
  if (param.startsWith(prefix)) {
    return param.slice(prefix.length);
  } else if (param.startsWith(`$${prefix}`)) {
    return param.slice(prefix.length + 1);
  } else {
    return undefined;
  }
}
const propertyKeyCompletions = (dbInfo: DbSchema): CompletionItem[] =>
  dbInfo.propertyKeys?.map((propertyKey) => {
    const result: CompletionItem = {
      label: propertyKey,
      kind: CompletionItemKind.Property,
      insertText: backtickIfNeeded(propertyKey),
    };
    return result;
  }) ?? [];

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
      CypherParser.RULE_commandNameExpression,
      CypherParser.RULE_symbolicNameOrStringParameter,
      CypherParser.RULE_symbolicNameOrStringParameterList,
      CypherParser.RULE_symbolicAliasNameOrParameter,
      CypherParser.RULE_passwordExpression,
      CypherParser.RULE_createUser,
      CypherParser.RULE_dropUser,
      CypherParser.RULE_alterUser,
      CypherParser.RULE_renameUser,
      CypherParser.RULE_createRole,
      CypherParser.RULE_dropRole,
      CypherParser.RULE_userNames,
      CypherParser.RULE_roleNames,
      CypherParser.RULE_renameRole,
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
  parsingResult: ParsedStatement,
  dbSchema: DbSchema,
  caretToken: Token,
  manualTrigger = false,
): CompletionItem[] {
  const cypherVersion = resolveCypherVersion(
    parsingResult.cypherVersion,
    dbSchema,
  );
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
  if (eof.type === CypherLexer.EOF && eof.text !== '<EOF>') {
    return [];
  }

  // If the previous token is an identifier, we don't count it as "finished" so we move the caret back one token
  // The identifier is finished when the last token is a SPACE or dot etc. etc.
  // this allows us to give completions that replace the current text => for example `RET` <- it's parsed as an identifier
  // The need for this caret movement is outlined in the documentation of antlr4-c3 in the section about caret position
  // When an identifier overlaps with a keyword, it's no longer treats as an identifier (although it's a valid identifier)
  // So we need to move the caret back for keywords as well
  const previousToken = tokens[caretIndex - 1];
  if (
    previousToken?.type === CypherLexer.IDENTIFIER ||
    lexerKeywords.includes(previousToken?.type)
  ) {
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
    CypherParser.RULE_leftArrow,
    // this rule is used for usernames and roles.
    CypherParser.RULE_commandNameExpression,
    CypherParser.RULE_procedureResultItem,
    CypherParser.RULE_cypherVersion,
    CypherParser.RULE_cypher,

    // Either enable the helper rules for lexer clashes,
    // or collect all console commands like below with symbolicNameString
    ...(_internalFeatureFlags.consoleCommands
      ? [
          CypherParser.RULE_useCompletionRule,
          CypherParser.RULE_listCompletionRule,
          CypherParser.RULE_serverCompletionRule,
        ]
      : [CypherParser.RULE_consoleCommand]),

    // Because of the overlap of keywords and identifiers in cypher
    // We will suggest keywords when users type identifiers as well
    // To avoid this we want custom completion for identifiers
    // Until we've covered all the ways we can reach symbolic name string we'll keep this here
    // Ideally we'd find another way to get around this issue
    CypherParser.RULE_symbolicNameString,
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
      if (ruleNumber === CypherParser.RULE_cypher) {
        return [
          ...cypherVersionCompletions(),
          {
            label: 'CYPHER',
            kind: CompletionItemKind.Keyword,
          },
        ];
      }

      if (ruleNumber === CypherParser.RULE_cypherVersion) {
        return versionCompletions();
      }

      if (ruleNumber === CypherParser.RULE_procedureResultItem) {
        const callContext = findParent(
          parsingResult.stopNode.parentCtx,
          (x) => x instanceof CallClauseContext,
        );
        if (callContext instanceof CallClauseContext) {
          const procedureNameCtx = callContext.procedureName();
          const existingYieldItems = new Set(
            callContext.procedureResultItem_list().map((a) => a.getText()),
          );
          const name = getMethodName(procedureNameCtx);
          return procedureReturnCompletions(
            name,
            dbSchema,
            cypherVersion,
          ).filter((a) => !existingYieldItems.has(a?.label));
        }
      }

      if (ruleNumber === CypherParser.RULE_functionName) {
        return functionNameCompletions(
          candidateRule,
          tokens,
          dbSchema,
          cypherVersion,
        );
      }

      if (ruleNumber === CypherParser.RULE_procedureName) {
        return procedureNameCompletions(
          candidateRule,
          tokens,
          dbSchema,
          cypherVersion,
        );
      }

      if (ruleNumber === CypherParser.RULE_parameter) {
        return parameterCompletions(
          dbSchema,
          previousToken,
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
          parentRule === CypherParser.RULE_map &&
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
          grandParentRule == CypherParser.RULE_postFix &&
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
        return completeAliasName({
          candidateRule,
          dbSchema,
          parsingResult,
        });
      }

      if (ruleNumber === CypherParser.RULE_commandNameExpression) {
        return completeSymbolicName({
          candidateRule,
          dbSchema,
          previousToken,
          parsingResult,
        });
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

        return [...labelCompletions(dbSchema), ...reltypeCompletions(dbSchema)];
      }

      // These are simple tokens that get completed as the wrong kind, due to a lexer conflict
      if (ruleNumber === CypherParser.RULE_useCompletionRule) {
        return [{ label: 'use', kind: CompletionItemKind.Event }];
      }

      if (ruleNumber === CypherParser.RULE_listCompletionRule) {
        return [{ label: 'list', kind: CompletionItemKind.Event }];
      }

      if (ruleNumber === CypherParser.RULE_serverCompletionRule) {
        return [{ label: 'server', kind: CompletionItemKind.Event }];
      }

      if (ruleNumber === CypherParser.RULE_leftArrow) {
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
  if (CypherLexer.RPAREN === previousToken?.type && !manualTrigger) {
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
  previousToken?: Token;
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

  const rulesCreatingNewDb = [
    CypherParser.RULE_createDatabase,
    CypherParser.RULE_createCompositeDatabase,
  ];
  // avoid suggesting existing database names when creating a new database
  if (
    rulesCreatingNewDb.some((rule) => candidateRule.ruleList.includes(rule))
  ) {
    return [];
  }

  // For `CREATE ALIAS aliasName FOR DATABASE databaseName`
  // Should not suggest existing aliases for aliasName but should suggest existing databases for databaseName
  // so we return base suggestions if we're at the `aliasName` rule
  if (
    candidateRule.ruleList.includes(CypherParser.RULE_createAlias) &&
    candidateRule.ruleList.includes(CypherParser.RULE_aliasName)
  ) {
    return [];
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
    return (dbSchema.aliasNames ?? []).map((aliasName) => {
      const backtickedName = backtickDbNameIfNeeded(aliasName);
      const maybeInsertText = backtickedName
        ? { insertText: backtickedName }
        : {};
      return {
        label: aliasName,
        kind: CompletionItemKind.Value,
        ...maybeInsertText,
      };
    });
  }

  // Suggest both database and alias names when it's not alias specific or creating new alias or database
  return (dbSchema.databaseNames ?? [])
    .concat(dbSchema.aliasNames ?? [])
    .map((databaseName) => {
      const backtickedName = backtickDbNameIfNeeded(databaseName);
      const maybeInsertText = backtickedName
        ? { insertText: backtickedName }
        : {};

      return {
        label: databaseName,
        kind: CompletionItemKind.Value,
        ...maybeInsertText,
      };
    });
}

function completeSymbolicName({
  candidateRule,
  dbSchema,
  previousToken,
  parsingResult,
}: CompletionHelperArgs): CompletionItem[] {
  // parameters are valid values in all cases of symbolic name
  const parameterSuggestions = parameterCompletions(
    dbSchema,
    previousToken,
    inferExpectedParameterTypeFromContext(candidateRule),
  );

  const rulesCreatingNewUserOrRole = [
    CypherParser.RULE_createUser,
    CypherParser.RULE_createRole,
  ];

  const previousNonSpace = findPreviousNonSpace(
    parsingResult.tokens,
    candidateRule.startTokenIndex,
  );
  const afterToToken = previousNonSpace.type === CypherParser.TO;
  const ruleList = candidateRule.ruleList;

  // avoid suggesting existing user names or role names when creating a new one
  if (
    rulesCreatingNewUserOrRole.some((rule) => ruleList.includes(rule)) ||
    // We are suggesting an user as target for the renaming
    //      RENAME USER existing TO target
    // so target should be non-existent
    (ruleList.includes(CypherParser.RULE_renameUser) && afterToToken)
  ) {
    return parameterSuggestions;
  }

  const rulesThatAcceptExistingUsers = [
    CypherParser.RULE_dropUser,
    CypherParser.RULE_renameUser,
    CypherParser.RULE_alterUser,
    CypherParser.RULE_userNames,
  ];

  if (rulesThatAcceptExistingUsers.some((rule) => ruleList.includes(rule))) {
    const result = [
      ...parameterSuggestions,
      ...(dbSchema.userNames ?? []).map((userName) => ({
        label: userName,
        kind: CompletionItemKind.Value,
      })),
    ];

    return result;
  }

  const rulesThatAcceptExistingRoles = [
    CypherParser.RULE_roleNames,
    CypherParser.RULE_dropRole,
    CypherParser.RULE_renameRole,
  ];

  if (rulesThatAcceptExistingRoles.some((rule) => ruleList.includes(rule))) {
    return [
      ...parameterSuggestions,
      ...(dbSchema.roleNames ?? []).map((roleName) => ({
        label: roleName,
        kind: CompletionItemKind.Value,
      })),
    ];
  }

  return [];
}
