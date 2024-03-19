import type { ParserRuleContext, Token } from 'antlr4';
import { CharStreams, CommonTokenStream, ParseTreeListener } from 'antlr4';

import CypherLexer from './generated-parser/CypherCmdLexer';

import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import {
  ClauseContext,
  default as CypherParser,
  LabelNameContext,
  LabelNameIsContext,
  LabelOrRelTypeContext,
  StatementOrCommandContext,
  StatementsOrCommandsContext,
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
import {
  SyntaxDiagnostic,
  SyntaxErrorsListener,
} from './syntaxValidation/syntaxValidationHelpers';

export interface ParsedStatement {
  command: ParsedCommand;
  parser: CypherParser;
  tokens: Token[];
  // A statement needs to be parsed with the .statements() rule because
  // it's the one that tries to parse until the EOF
  ctx: StatementsOrCommandsContext;
  diagnostics: SyntaxDiagnostic[];
  stopNode: ParserRuleContext;
  collectedLabelOrRelTypes: LabelOrRelType[];
  collectedVariables: string[];
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

export type LabelOrRelType = {
  labeltype: LabelType;
  labelText: string;
  couldCreateNewLabel: boolean;
  line: number;
  column: number;
  offsets: {
    start: number;
    end: number;
  };
};

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

export function parse(query: string): StatementOrCommandContext[] {
  const statementScaffolding =
    createParsingScaffolding(query).statementsScaffolding;
  const result = statementScaffolding.map((statement) =>
    statement.parser.statementOrCommand(),
  );

  return result;
}

export function createParsingResult(query: string): ParsingResult {
  const parsingScaffolding = createParsingScaffolding(query);

  const results: ParsedStatement[] =
    parsingScaffolding.statementsScaffolding.map((statementScaffolding) => {
      const { parser, tokens } = statementScaffolding;
      const labelsCollector = new LabelAndRelTypesCollector();
      const variableFinder = new VariableCollector();
      const errorListener = new SyntaxErrorsListener();
      parser._parseListeners = [labelsCollector, variableFinder];
      parser.addErrorListener(errorListener);
      const ctx = parser.statementsOrCommands();
      // The statement is empty if we cannot find anything that is not EOF or a space
      const isEmptyStatement =
        tokens.find(
          (t) => t.text !== '<EOF>' && t.type !== CypherLexer.SPACE,
        ) === undefined;
      const diagnostics = isEmptyStatement ? [] : errorListener.errors;
      const collectedCommand = parseToCommand(ctx, isEmptyStatement);

      if (!consoleCommandEnabled()) {
        diagnostics.push(...errorOnNonCypherCommands(collectedCommand));
      }

      return {
        command: collectedCommand,
        parser: parser,
        tokens: tokens,
        diagnostics: diagnostics,
        ctx: ctx,
        stopNode: findStopNode(ctx),
        collectedLabelOrRelTypes: labelsCollector.labelOrRelTypes,
        collectedVariables: variableFinder.variables,
      };
    });

  const parsingResult: ParsingResult = {
    query: query,
    statementsParsing: results,
  };

  return parsingResult;
}

// This listener is collects all labels and relationship types
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
    if (ctx instanceof LabelNameContext || ctx instanceof LabelNameIsContext) {
      // If the parent ctx start doesn't coincide with this ctx start,
      // it means the parser recovered from an error reading the label
      // like in the case MATCH (n:) RETURN n
      // RETURN would be idenfified as the label in that case
      if (ctx.parentCtx && ctx.parentCtx.start === ctx.start) {
        this.labelOrRelTypes.push({
          labeltype: getLabelType(ctx),
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
          labeltype: getLabelType(ctx),
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
      const variable = ctx.symbolicNameString().getText();
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
  | { type: 'parse-error' };

export type ParsedCommand = ParsedCommandNoPosition & RuleTokens;

function parseToCommand(
  stmts: StatementsOrCommandsContext,
  isEmptyStatement: boolean,
): ParsedCommand {
  const stmt = stmts.statementOrCommand_list().at(0);

  if (stmt) {
    const { start, stop } = stmt;

    const cypherStmt = stmt.statement();
    if (cypherStmt) {
      // we get the original text input to preserve whitespace
      const inputstream = start.getInputStream();
      const statement = inputstream.getText(start.start, stop.stop);

      return { type: 'cypher', statement, start, stop };
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
            ?.symbolicNameString_list()
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
        const name = lambda?.unescapedSymbolicNameString()?.getText();
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

      return { type: 'parse-error', start, stop };
    }
    return { type: 'parse-error', start, stop };
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
    .filter((cmd) => cmd.type !== 'cypher' && cmd.type !== 'parse-error')
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

  parse(query: string): ParsingResult {
    if (
      this.parsingResult !== undefined &&
      this.parsingResult.query === query
    ) {
      return this.parsingResult;
    } else {
      const parsingResult = createParsingResult(query);

      return parsingResult;
    }
  }

  clearCache() {
    this.parsingResult = undefined;
  }
}

/* 
 Because the parserWrapper is done as a single-ton global variable, the setting for 
 console commands was also easiest to do as a global variable as it avoid messing with the cache

It would make sense for the client to initialize and own the ParserWrapper, then each editor can have
it's own cache and preference on if console commands are enabled or not.

*/
let enableConsoleCommands = false;
export function setConsoleCommandsEnabled(enabled: boolean) {
  enableConsoleCommands = enabled;
}
export function consoleCommandEnabled() {
  return enableConsoleCommands;
}

export const parserWrapper = new ParserWrapper();
