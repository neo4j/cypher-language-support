import type { ParserRuleContext, Token } from 'antlr4';
import { CharStreams, CommonTokenStream, ParseTreeListener } from 'antlr4';

import CypherLexer from './generated-parser/CypherCmdLexer';

import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import { _internalFeatureFlags } from './featureFlags';
import {
  ClauseContext,
  CypherVersionContext,
  default as CypherParser,
  FunctionNameContext,
  LabelNameContext,
  LabelOrRelTypeContext,
  ParameterContext,
  ProcedureNameContext,
  ProcedureResultItemContext,
  StatementOrCommandContext,
  StatementsOrCommandsContext,
  SymbolicNameStringContext,
  VariableContext,
} from './generated-parser/CypherCmdParser';
import {
  findParent,
  findStopNode,
  inNodeLabel,
  inRelationshipType,
  isDefined,
  rulesDefiningOrUsingVariables,
  splitIntoStatements,
} from './helpers';
import { SyntaxDiagnostic } from './syntaxValidation/syntaxValidation';
import { SyntaxErrorsListener } from './syntaxValidation/syntaxValidationHelpers';
import {
  CypherVersion,
  cypherVersionNumbers,
  allCypherVersions,
} from './types';

export interface ParsedStatement {
  command: ParsedCommand;
  parser: CypherParser;
  tokens: Token[];
  // A statement needs to be parsed with the .statements() rule because
  // it's the one that tries to parse until the EOF
  ctx: StatementsOrCommandsContext;
  syntaxErrors: SyntaxDiagnostic[];
  cypherVersionError: SyntaxDiagnostic | undefined;
  stopNode: ParserRuleContext;
  collectedLabelOrRelTypes: LabelOrRelType[];
  collectedVariables: string[];
  collectedParameters: ParsedParameter[];
  collectedFunctions: ParsedFunction[];
  collectedProcedures: ParsedProcedure[];
  cypherVersion?: CypherVersion;
}

export interface ParsingResult {
  query: string;
  statementsParsing: ParsedStatement[];
}

export interface ParsingScaffolding {
  query: string;
  statementsScaffolding: StatementParsingScaffolding[];
}

export interface StatementParsingScaffolding {
  parser: CypherParser;
  tokens: Token[];
}

export enum LabelType {
  nodeLabelType = 'Label',
  relLabelType = 'Relationship type',
  unknown = 'Label or relationship type',
}

function getLabelType(ctx: ParserRuleContext): LabelType {
  if (inNodeLabel(ctx)) return LabelType.nodeLabelType;
  else if (inRelationshipType(ctx)) return LabelType.relLabelType;
  else return LabelType.unknown;
}

function couldCreateNewLabel(ctx: ParserRuleContext): boolean {
  const parent = findParent(ctx, (ctx) => ctx instanceof ClauseContext);

  if (parent instanceof ClauseContext) {
    const clause = parent;
    return isDefined(clause.mergeClause()) || isDefined(clause.createClause());
  } else {
    return false;
  }
}

export type HasPosition = {
  line: number;
  column: number;
  offsets: {
    start: number;
    end: number;
  };
};

export type LabelOrRelType = HasPosition & {
  labelType: LabelType;
  labelText: string;
  couldCreateNewLabel: boolean;
};

export type ParsedParameter = HasPosition & {
  name: string;
  rawText: string;
};

export type ParsedFunction = HasPosition & {
  name: string;
  rawText: string;
};

export type ParsedProcedure = ParsedFunction;

export function createParsingScaffolding(query: string): ParsingScaffolding {
  const inputStream = CharStreams.fromString(query);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const stmTokenStreams = splitIntoStatements(tokenStream, lexer);

  const statementsScaffolding: StatementParsingScaffolding[] =
    stmTokenStreams.map((t) => {
      const tokens = [...t.tokens];
      const parser = new CypherParser(t);
      parser.removeErrorListeners();

      return {
        parser: parser,
        tokens: tokens,
      };
    });

  return {
    query: query,
    statementsScaffolding: statementsScaffolding,
  };
}

export function parseStatementsStrs(query: string): string[] {
  const statements = parse(query);
  const result: string[] = [];

  for (const statement of statements) {
    const tokenStream = statement.parser?.getTokenStream() ?? [];
    const tokens = (tokenStream as CommonTokenStream).tokens;
    const statementStr = tokens
      .filter((token) => token.type !== CypherLexer.EOF)
      .map((token) => token.text)
      .join('');

    // Do not return empty statements
    if (statementStr.trimLeft().length != 0) {
      result.push(statementStr);
    }
  }

  return result;
}

/* Parses a query without storing it in the cache */
export function parse(query: string): StatementOrCommandContext[] {
  const statementScaffolding =
    createParsingScaffolding(query).statementsScaffolding;
  const result = statementScaffolding.map((statement) =>
    statement.parser.statementOrCommand(),
  );

  return result;
}

export function createParsingResult(
  query: string,
  consoleCommandsEnabled: boolean,
): ParsingResult {
  const parsingScaffolding = createParsingScaffolding(query);

  const results: ParsedStatement[] =
    parsingScaffolding.statementsScaffolding.map((statementScaffolding) => {
      const { parser, tokens } = statementScaffolding;
      const labelsCollector = new LabelAndRelTypesCollector();
      const parameterFinder = new ParameterCollector();
      const variableFinder = new VariableCollector();
      const methodsFinder = new MethodsCollector(tokens);
      const cypherVersionCollector = new CypherVersionCollector();
      const errorListener = new SyntaxErrorsListener(
        tokens,
        consoleCommandsEnabled,
      );
      parser._parseListeners = [
        labelsCollector,
        parameterFinder,
        variableFinder,
        methodsFinder,
        cypherVersionCollector,
      ];
      parser.addErrorListener(errorListener);
      const ctx = parser.statementsOrCommands();
      // The statement is empty if we cannot find anything that is not EOF or a space
      const isEmptyStatement =
        tokens.find(
          (t) => t.text !== '<EOF>' && t.type !== CypherLexer.SPACE,
        ) === undefined;
      const collectedCommand = parseToCommand(ctx, tokens, isEmptyStatement);
      const syntaxErrors = !isEmptyStatement ? errorListener.errors : [];

      if (!consoleCommandsEnabled) {
        syntaxErrors.push(...errorOnNonCypherCommands(collectedCommand));
      }

      return {
        command: collectedCommand,
        parser: parser,
        tokens: tokens,
        syntaxErrors: syntaxErrors,
        cypherVersionError: cypherVersionCollector.invalidVersionError,
        ctx: ctx,
        stopNode: findStopNode(ctx),
        collectedLabelOrRelTypes: labelsCollector.labelOrRelTypes,
        collectedVariables: variableFinder.variables,
        collectedParameters: parameterFinder.parameters,
        collectedFunctions: methodsFinder.functions,
        collectedProcedures: methodsFinder.procedures,
        cypherVersion: cypherVersionCollector.cypherVersion,
      };
    });

  const parsingResult: ParsingResult = {
    query: query,
    statementsParsing: results,
  };

  return parsingResult;
}

const getClearParamName = (name: string): string => {
  if (name.startsWith('`') && name.endsWith('`')) {
    return name.slice(1, -1);
  }
  return name;
};

export function parseParameters(
  query: string,
  consoleCommandsEnabled: boolean,
): string[] {
  const parsingResult = createParsingResult(query, consoleCommandsEnabled);
  const parameters = parsingResult.statementsParsing.flatMap((statement) =>
    statement.collectedParameters.map((param) => getClearParamName(param.name)),
  );
  return [...new Set(parameters)];
}

// This listener collects all labels and relationship types
class LabelAndRelTypesCollector extends ParseTreeListener {
  labelOrRelTypes: LabelOrRelType[] = [];

  enterEveryRule() {
    /* no-op */
  }
  visitTerminal() {
    /* no-op */
  }
  visitErrorNode() {
    /* no-op */
  }

  exitEveryRule(ctx: unknown) {
    if (ctx instanceof LabelNameContext) {
      // If the parent ctx start doesn't coincide with this ctx start,
      // it means the parser recovered from an error reading the label
      // like in the case MATCH (n:) RETURN n
      // RETURN would be idenfified as the label in that case
      if (ctx.parentCtx && ctx.parentCtx.start === ctx.start) {
        this.labelOrRelTypes.push({
          labelType: getLabelType(ctx),
          labelText: ctx.getText(),
          couldCreateNewLabel: couldCreateNewLabel(ctx),
          line: ctx.start.line,
          column: ctx.start.column,
          offsets: {
            start: ctx.start.start,
            end: ctx.stop.stop + 1,
          },
        });
      }
    } else if (ctx instanceof LabelOrRelTypeContext) {
      const symbolicName = ctx.symbolicNameString();
      // Read comment for the label name case
      if (
        isDefined(symbolicName) &&
        ctx.parentCtx &&
        ctx.parentCtx.start === ctx.start
      ) {
        this.labelOrRelTypes.push({
          labelType: getLabelType(ctx),
          labelText: symbolicName.start.text,
          couldCreateNewLabel: couldCreateNewLabel(ctx),
          line: ctx.start.line,
          column: ctx.start.column,
          offsets: {
            start: ctx.start.start,
            end: ctx.stop.stop + 1,
          },
        });
      }
    }
  }
}

class ParameterCollector implements ParseTreeListener {
  parameters: ParsedParameter[] = [];
  enterEveryRule() {
    /* no-op */
  }
  visitTerminal() {
    /* no-op */
  }
  visitErrorNode() {
    /* no-op */
  }

  exitEveryRule(ctx: unknown) {
    if (ctx instanceof ParameterContext) {
      const parameterName = ctx.parameterName().getText();
      if (parameterName) {
        this.parameters.push({
          name: parameterName,
          rawText: ctx.getText(),
          line: ctx.start.line,
          column: ctx.start.column,
          offsets: {
            start: ctx.start.start,
            end: ctx.stop.stop + 1,
          },
        });
      }
    }
  }
}

// This class is collects all variables detected by the parser which means
// it does include variable scope nor differentiate between variable use and definition
// we use it when the semantic anaylsis result is not available
class VariableCollector implements ParseTreeListener {
  variables: string[] = [];
  enterEveryRule() {
    /* no-op */
  }
  visitTerminal() {
    /* no-op */
  }
  visitErrorNode() {
    /* no-op */
  }

  exitEveryRule(ctx: unknown) {
    if (ctx instanceof VariableContext) {
      const variable = ctx.symbolicVariableNameString().getText();
      // To avoid suggesting the variable that is currently being typed
      // For example RETURN a| <- we don't want to suggest "a" as a variable
      // We check if the variable is in the end of the statement
      const nextTokenIndex = ctx.stop?.tokenIndex;

      const nextTokenIsEOF =
        nextTokenIndex !== undefined &&
        ctx.parser?.getTokenStream().get(nextTokenIndex + 1)?.type ===
          CypherParser.EOF;

      const definesVariable = rulesDefiningOrUsingVariables.includes(
        // @ts-expect-error the antlr4 types don't include ruleIndex but it is there, fix as the official types are improved
        ctx.parentCtx?.ruleIndex as unknown as number,
      );

      if (variable && !nextTokenIsEOF && definesVariable) {
        this.variables.push(variable);
      }
    }
    if (ctx instanceof ProcedureResultItemContext) {
      const variable = ctx.getText();
      if (variable) {
        this.variables.push(variable);
      }
    }
  }
}

export function getMethodName(
  ctx: ProcedureNameContext | FunctionNameContext,
): string {
  const namespaces = ctx.namespace().symbolicNameString_list();
  const methodName = ctx.symbolicNameString();

  const normalizedName = [...namespaces, methodName]
    .map((symbolicName) => {
      return getNamespaceString(symbolicName);
    })
    .join('.');

  return normalizedName;
}

function getNamespaceString(ctx: SymbolicNameStringContext): string {
  const text = ctx.getText();
  const isEscaped = Boolean(ctx.escapedSymbolicNameString());
  const hasDot = text.includes('.');

  if (isEscaped && !hasDot) {
    return text.slice(1, -1);
  }

  return text;
}

// This listener collects all functions and procedures
class MethodsCollector extends ParseTreeListener {
  public procedures: ParsedProcedure[] = [];
  public functions: ParsedFunction[] = [];
  private tokens: Token[];

  constructor(tokens: Token[]) {
    super();
    this.tokens = tokens;
  }

  enterEveryRule() {
    /* no-op */
  }
  visitTerminal() {
    /* no-op */
  }
  visitErrorNode() {
    /* no-op */
  }

  exitEveryRule(ctx: unknown) {
    if (
      ctx instanceof FunctionNameContext ||
      ctx instanceof ProcedureNameContext
    ) {
      const methodName = getMethodName(ctx);

      const startTokenIndex = ctx.start.tokenIndex;
      const stopTokenIndex = ctx.stop.tokenIndex;

      const rawText = this.tokens
        .slice(startTokenIndex, stopTokenIndex + 1)
        .map((token) => {
          return token.text;
        })
        .join('');

      const result = {
        name: methodName,
        rawText: rawText,
        line: ctx.start.line,
        column: ctx.start.column,
        offsets: {
          start: ctx.start.start,
          end: ctx.stop.stop + 1,
        },
      };

      if (ctx instanceof FunctionNameContext) {
        this.functions.push(result);
      } else {
        this.procedures.push(result);
      }
    }
  }
}

class CypherVersionCollector extends ParseTreeListener {
  public cypherVersion: CypherVersion;
  public invalidVersionError: SyntaxDiagnostic;

  constructor() {
    super();
  }

  enterEveryRule() {
    /* no-op */
  }
  visitTerminal() {
    /* no-op */
  }
  visitErrorNode() {
    /* no-op */
  }

  exitEveryRule(ctx: unknown) {
    if (ctx instanceof CypherVersionContext) {
      const parsedVersion = 'CYPHER ' + ctx.getText();
      allCypherVersions.forEach((validVersion) => {
        if (parsedVersion === validVersion) {
          this.cypherVersion = parsedVersion;
        }
      });
      if (!this.cypherVersion) {
        this.invalidVersionError = {
          message:
            ctx.getText() +
            ' is not a valid option for cypher version. Valid options are: ' +
            cypherVersionNumbers.join(', '),
          severity: DiagnosticSeverity.Error,
          ...translateTokensToRange(ctx.start, ctx.stop),
        };
      }
    }
  }
}

type CypherCmd = { type: 'cypher'; query: string };
type RuleTokens = {
  start: Token;
  stop: Token;
};

export type ParsedCypherCmd = CypherCmd & RuleTokens;
export type ParsedCommandNoPosition =
  | { type: 'cypher'; statement: string }
  | { type: 'use'; database?: string /* missing implies default db */ }
  | { type: 'clear' }
  | { type: 'history' }
  | {
      type: 'set-parameters';
      parameters: { name: string; expression: string }[];
    }
  | { type: 'list-parameters' }
  | { type: 'clear-parameters' }
  | { type: 'connect' }
  | { type: 'disconnect' }
  | { type: 'server'; operation: string }
  | { type: 'welcome' }
  | { type: 'parse-error' }
  | { type: 'sysinfo' }
  | { type: 'style'; operation?: 'reset' }
  | { type: 'play' }
  | { type: 'access-mode'; operation?: string };

export type ParsedCommand = ParsedCommandNoPosition & RuleTokens;

function parseToCommand(
  stmts: StatementsOrCommandsContext,
  tokens: Token[],
  isEmptyStatement: boolean,
): ParsedCommand {
  const stmt = stmts.statementOrCommand_list().at(0);

  if (stmt) {
    const start = stmts.start;
    let stop = stmts.stop;

    if (stop && stop.type === CypherLexer.SEMICOLON) {
      stop = tokens[stop.tokenIndex - 1];
    }
    const inputstream = start.getInputStream();
    const cypherStmt = stmt.preparsedStatement()?.statement();
    if (cypherStmt) {
      // we get the original text input to preserve whitespace
      // stripping the preparser part of it
      const stmtStart = cypherStmt.start;
      const statement = inputstream.getText(stmtStart.start, stop.stop);

      return { type: 'cypher', statement, start: stmtStart, stop: stop };
    }

    if (isEmptyStatement) {
      const { start } = stmts;
      return { type: 'cypher', statement: '', start: start, stop: start };
    }

    const consoleCmd = stmt.consoleCommand();
    if (consoleCmd) {
      const useCmd = consoleCmd.useCmd();
      if (useCmd) {
        return {
          type: 'use',
          database: useCmd.symbolicAliasName()?.getText(),
          start,
          stop,
        };
      }

      const clearCmd = consoleCmd.clearCmd();
      if (clearCmd) {
        return { type: 'clear', start, stop };
      }

      const historyCmd = consoleCmd.historyCmd();
      if (historyCmd) {
        return { type: 'history', start, stop };
      }

      const param = consoleCmd.paramsCmd();
      const paramArgs = param?.paramsArgs();

      if (param && !paramArgs) {
        // no argument provided -> list parameters
        return { type: 'list-parameters', start, stop };
      }

      if (paramArgs) {
        const cypherMap = paramArgs.map();
        if (cypherMap) {
          const names = cypherMap
            ?.propertyKeyName_list()
            .map((name) => name.getText());
          const expressions = cypherMap
            ?.expression_list()
            .map((expr) => expr.getText());

          if (names && expressions && names.length === expressions.length) {
            return {
              type: 'set-parameters',
              parameters: names.map((name, index) => ({
                name,
                expression: expressions[index],
              })),
              start,
              stop,
            };
          }
        }

        const lambda = paramArgs.lambda();
        const name = lambda?.parameterName()?.getText();
        const expression = lambda?.expression()?.getText();
        if (name && expression) {
          return {
            type: 'set-parameters',
            parameters: [{ name, expression }],
            start,
            stop,
          };
        }

        const clear = paramArgs.CLEAR();
        if (clear) {
          return { type: 'clear-parameters', start, stop };
        }

        const list = paramArgs.listCompletionRule()?.LIST();
        if (list) {
          return { type: 'list-parameters', start, stop };
        }
      }

      const connectCmd = consoleCmd.connectCmd();
      if (connectCmd) {
        return { type: 'connect', start, stop };
      }

      const disconnectCmd = consoleCmd.disconnectCmd();
      if (disconnectCmd) {
        return { type: 'disconnect', start, stop };
      }

      const serverCmd = consoleCmd.serverCmd();
      const serverArgs = serverCmd?.serverArgs();
      if (serverCmd && serverArgs) {
        const connect = serverArgs.CONNECT();
        if (connect) {
          return { type: 'server', operation: 'connect', start, stop };
        }

        const disconnect = serverArgs.DISCONNECT();
        if (disconnect) {
          return { type: 'server', operation: 'disconnect', start, stop };
        }
      }

      const welcomeCmd = consoleCmd.welcomeCmd();
      if (welcomeCmd) {
        return { type: 'welcome', start, stop };
      }

      const sysInfoCmd = consoleCmd.sysInfoCmd();
      if (sysInfoCmd) {
        return { type: 'sysinfo', start, stop };
      }

      const styleCmd = consoleCmd.styleCmd();
      if (styleCmd) {
        return {
          type: 'style',
          start,
          stop,
          operation: styleCmd.RESET() ? 'reset' : undefined,
        };
      }

      const playCmd = consoleCmd.playCmd();
      if (playCmd) {
        return { type: 'play', start, stop };
      }

      const accessModeCmd = consoleCmd.accessModeCmd();
      const accessModeArgs = accessModeCmd?.accessModeArgs();

      if (accessModeCmd && !accessModeArgs) {
        return {
          type: 'access-mode',
          operation: undefined,
          start,
          stop,
        };
      }

      if (accessModeArgs) {
        const read = accessModeArgs.readCompletionRule()?.READ();
        if (read) {
          return {
            type: 'access-mode',
            operation: 'read',
            start,
            stop,
          };
        }

        const write = accessModeArgs.writeCompletionRule()?.WRITE();
        if (write) {
          return {
            type: 'access-mode',
            operation: 'write',
            start,
            stop,
          };
        }
      }

      return { type: 'parse-error', start, stop };
    }
    const stopToken = stop ?? tokens.at(-1);
    const statement = inputstream.getText(start.start, stopToken.stop);
    return { type: 'cypher', statement, start: start, stop: stopToken };
  }
  return { type: 'parse-error', start: stmts.start, stop: stmts.stop };
}

function translateTokensToRange(
  start: Token,
  stop: Token,
): Pick<SyntaxDiagnostic, 'range' | 'offsets'> {
  return {
    range: {
      start: Position.create(start.line - 1, start.column),
      end: Position.create(stop.line - 1, stop.column + stop.text.length),
    },
    offsets: {
      start: start.start,
      end: stop.stop + 1,
    },
  };
}

function errorOnNonCypherCommands(command: ParsedCommand): SyntaxDiagnostic[] {
  return [command]
    .filter((cmd) => cmd.type !== 'cypher')
    .map(
      ({ start, stop }): SyntaxDiagnostic => ({
        message: 'Console commands are unsupported in this environment.',
        severity: DiagnosticSeverity.Error,
        ...translateTokensToRange(start, stop),
      }),
    );
}

class ParserWrapper {
  parsingResult?: ParsingResult;

  parse(query: string, consoleCommandsEnabled?: boolean): ParsingResult {
    if (
      this.parsingResult !== undefined &&
      this.parsingResult.query === query
    ) {
      return this.parsingResult;
    } else {
      const parsingResult = createParsingResult(
        query,
        consoleCommandsEnabled ?? _internalFeatureFlags.consoleCommands,
      );

      return parsingResult;
    }
  }

  clearCache() {
    this.parsingResult = undefined;
  }
}

export const parserWrapper = new ParserWrapper();
