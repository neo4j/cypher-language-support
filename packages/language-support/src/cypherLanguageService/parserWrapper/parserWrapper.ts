import { ErrorTrackingStrategy } from '../../errorTrackingStrategy.js';
import type {
  PatternElementContext,
  StatementOrCommandContext,
  StatementsOrCommandsContext,
} from '../../generated-parser/CypherCmdParser.js';
import { SyntaxErrorsListener } from '../../syntaxValidation/syntaxValidationHelpers.js';
import { ReadLabelAndRelTypesCollector } from '../collectors/labelCollector.js';
import { MethodsCollector } from '../collectors/methodsCollector.js';
import { ParameterCollector } from '../collectors/parameterCollector.js';
import { PropertiesCollector } from '../collectors/propertiesCollector.js';
import { ReadPatternElementsCollector } from '../collectors/readPatternElementsCollector.js';
import { VariableCollector } from '../collectors/variableCollector.js';
import { CypherVersionCollector } from '../collectors/versionCollector.js';
import {
  createParsingScaffolding,
  getStatementTokenChunks,
} from './scaffolding.js';
import { CypherCmdLexer as CypherLexer } from '../../generated-parser/CypherCmdLexer.js';
import type { CypherCmdParser as CypherParser } from '../../generated-parser/CypherCmdParser.js';
import type { CommonTokenStream, ParserRuleContext } from 'antlr4ng';
import { Token } from 'antlr4ng';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import type { SyntaxDiagnostic } from '../../syntaxValidation/syntaxValidation.js';
import { translateTokensToRange } from '../utils/translateTokenToRange.js';
import type { CypherVersion } from '../../types.js';
import type {
  LabelOrRelType,
  ParsedParameter,
  ParsedFunction,
  ParsedProcedure,
  PropertyType,
} from '../parsingTypes.js';
import { findStopNode } from '../../helpers.js';

type RuleTokens = {
  start: Token;
  stop: Token;
};

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
  | { type: 'play'; guide?: string }
  | { type: 'access-mode'; operation?: string }
  | { type: 'help' }
  | { type: 'auto'; statement?: string };

type ParsedCommand = ParsedCommandNoPosition & RuleTokens;

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
  settings: { consoleCommandsEnabled: boolean },
): ParsingResult {
  const parsingScaffolding = createParsingScaffolding(query);

  const results: ParsedStatement[] =
    parsingScaffolding.statementsScaffolding.map((statementScaffolding) => {
      const { parser, tokenStream, tokens } = statementScaffolding;
      const labelsCollector = new ReadLabelAndRelTypesCollector();
      const parameterFinder = new ParameterCollector();
      const variableFinder = new VariableCollector(tokenStream);
      const propertiesFinder = new PropertiesCollector();
      const methodsFinder = new MethodsCollector(tokens);
      const cypherVersionCollector = new CypherVersionCollector();
      const readPatternElementsCollector = new ReadPatternElementsCollector();
      const errorListener = new SyntaxErrorsListener(
        tokens,
        settings.consoleCommandsEnabled,
      );
      const errorTracker = new ErrorTrackingStrategy();
      parser.errorHandler = errorTracker;
      parser.addParseListener(labelsCollector);
      parser.addParseListener(parameterFinder);
      parser.addParseListener(variableFinder);
      parser.addParseListener(methodsFinder);
      parser.addParseListener(cypherVersionCollector);
      parser.addParseListener(propertiesFinder);
      parser.addParseListener(readPatternElementsCollector);
      parser.addErrorListener(errorListener);
      const ctx = parser.statementsOrCommands();

      // The statement is empty if we cannot find anything that is not EOF or a space
      const isEmptyStatement =
        tokens.find(
          (t) => t.text !== '<EOF>' && t.type !== CypherLexer.SPACE,
        ) === undefined;
      const collectedCommand = parseToCommand(
        ctx,
        tokenStream,
        tokens,
        isEmptyStatement,
      );
      const syntaxErrors = !isEmptyStatement ? errorListener.errors : [];

      if (!settings.consoleCommandsEnabled) {
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
        collectedProperties: propertiesFinder.properties,
        collectedReadPatternElements:
          readPatternElementsCollector.readPatternElements,
        cypherVersion: cypherVersionCollector.cypherVersion,
        errorTracker: errorTracker,
      };
    });

  const parsingResult: ParsingResult = {
    query: query,
    statementsParsing: results,
  };

  return parsingResult;
}

function parseToCommand(
  stmts: StatementsOrCommandsContext,
  tokenStream: CommonTokenStream,
  tokens: Token[],
  isEmptyStatement: boolean,
): ParsedCommand {
  const stmt = stmts.statementOrCommand().at(0);

  if (stmt) {
    const start = stmts.start;
    let stop = stmts.stop;

    // Matching EOF sets the context stop to EOF. CommonTokenStream.LB() is
    // channel-aware, so this recovers the preceding default-channel token.
    if (stop && stop.type === Token.EOF) {
      stop = tokenStream.LB(1) ?? stop;
    }
    if (stop && stop.type === CypherLexer.SEMICOLON) {
      stop = tokens[stop.tokenIndex - 1];
    }
    const inputstream = start.inputStream;
    const cypherStmt = stmt.preparsedStatement()?.statement();
    if (cypherStmt) {
      // we get the original text input to preserve whitespace
      // stripping the preparser part of it
      const stmtStart = cypherStmt.start;
      const statement = inputstream.getTextFromRange(
        stmtStart.start,
        stop.stop,
      );

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
            ?.propertyKeyName()
            .map((name) => name.getText());
          const expressions = cypherMap
            ?.expression()
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
        return {
          type: 'play',
          guide: playCmd.symbolicNameString()?.getText(),
          start,
          stop,
        };
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

      const helpCmd = consoleCmd.helpCmd();
      if (helpCmd) {
        return { type: 'help', start, stop };
      }

      const autoCmd = consoleCmd.autoCmd();
      if (autoCmd) {
        const autoStmt = autoCmd.statement();
        if (autoStmt && autoStmt.start && autoStmt.stop) {
          //we want autoStmt.start so we skip :auto when calling semantic analysis
          //but regular stop, so we include trailing error nodes not parsed as statement
          const statement = inputstream.getTextFromRange(
            autoStmt.start.start,
            stop.stop,
          );
          return { type: 'auto', statement, start: autoStmt.start, stop };
        }
        return { type: 'auto', start, stop };
      }

      return { type: 'parse-error', start, stop };
    }
    const stopToken = stop ?? tokens.at(-1);
    const statement = inputstream.getTextFromRange(start.start, stopToken.stop);
    return { type: 'cypher', statement, start: start, stop: stopToken };
  }
  return { type: 'parse-error', start: stmts.start, stop: stmts.stop };
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
  collectedProperties: PropertyType[];
  collectedReadPatternElements: PatternElementContext[];
  cypherVersion?: CypherVersion;
  errorTracker: ErrorTrackingStrategy;
}

export interface ParsingResult {
  query: string;
  statementsParsing: ParsedStatement[];
}

export function parseStatementsStrs(query: string): string[] {
  const statementChunks = getStatementTokenChunks(query);
  const result: string[] = [];

  for (const tokens of statementChunks) {
    const statementStr = tokens
      .filter((token) => token.type !== CypherLexer.EOF)
      .map((token) => token.text)
      .join('');

    // Do not return empty statements
    if (statementStr.trimStart().length != 0) {
      result.push(statementStr);
    }
  }

  return result;
}

function getClearParamName(name: string): string {
  if (name.startsWith('`') && name.endsWith('`')) {
    return name.slice(1, -1);
  }
  return name;
}

export function parseParameters(
  query: string,
  consoleCommandsEnabled: boolean,
): string[] {
  const parsingResult = createParsingResult(query, { consoleCommandsEnabled });
  const parameters = parsingResult.statementsParsing.flatMap((statement) =>
    statement.collectedParameters.map((param) => getClearParamName(param.name)),
  );
  return [...new Set(parameters)];
}
