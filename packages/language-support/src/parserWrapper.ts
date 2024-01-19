import type { ParserRuleContext, Token } from 'antlr4';
import { CharStreams, CommonTokenStream, ParseTreeListener } from 'antlr4';

import CypherLexer from './generated-parser/CommandLexer';

import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import CypherParser, {
  ClauseContext,
  FullStatementsContext,
  LabelNameContext,
  LabelNameIsContext,
  LabelOrRelTypeContext,
  VariableContext,
} from './generated-parser/CommandParser';
import {
  findParent,
  findStopNode,
  getTokens,
  inNodeLabel,
  inRelationshipType,
  isDefined,
  rulesDefiningOrUsingVariables,
} from './helpers';
import {
  SyntaxDiagnostic,
  SyntaxErrorsListener,
} from './highlighting/syntaxValidation/syntaxValidationHelpers';

export interface ParsingResult {
  query: string;
  parser: CypherParser;
  tokens: Token[];
  result: FullStatementsContext;
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

export interface EnrichedParsingResult extends ParsingResult {
  diagnostics: SyntaxDiagnostic[];
  stopNode: ParserRuleContext;
  collectedLabelOrRelTypes: LabelOrRelType[];
  collectedVariables: string[];
  collectedCommands: ParsedCommand[];
}

export interface ParsingScaffolding {
  query: string;
  parser: CypherParser;
  tokenStream: CommonTokenStream;
}

export function createParsingScaffolding(query: string): ParsingScaffolding {
  const inputStream = CharStreams.fromString(query);
  const lexer = new CypherLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new CypherParser(tokenStream);
  parser.removeErrorListeners();

  return {
    query: query,
    parser: parser,
    tokenStream: tokenStream,
  };
}

export function parse(cypher: string) {
  const parser = createParsingScaffolding(cypher).parser;
  return parser.fullStatements();
}

export function createParsingResult(
  parsingScaffolding: ParsingScaffolding,
): ParsingResult {
  const query = parsingScaffolding.query;
  const parser = parsingScaffolding.parser;
  const tokenStream = parsingScaffolding.tokenStream;
  const result = parser.fullStatements();

  const parsingResult: ParsingResult = {
    query: query,
    parser: parser,
    tokens: getTokens(tokenStream),
    result: result,
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

export type ParsedCommandNoPosition =
  | { type: 'cypher'; query: string }
  | { type: 'use'; database?: string /* missing implies default db */ }
  | { type: 'clear' }
  | { type: 'history' }
  | {
      type: 'set-parameters';
      parameters: { name: string; expression: string }[];
    }
  | { type: 'list-parameters' }
  | { type: 'clear-parameters' };

export type ParsedCommand = ParsedCommandNoPosition & {
  start: Token;
  stop: Token;
};

function parseToCommands(stmts: FullStatementsContext): ParsedCommand[] {
  return stmts.statementOrCommand_list().map((stmt) => {
    const { start, stop } = stmt;

    const cypherStmt = stmt.statement();
    if (cypherStmt) {
      // we get the original text input to preserve whitespace
      const inputstream = cypherStmt.start.getInputStream();
      const query = inputstream.getText(start.start, stop.stop);

      return { type: 'cypher', query, start, stop };
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
      } else {
        const cypherMap = paramArgs.map();
        if (cypherMap) {
          const names = cypherMap
            .symbolicNameString_list()
            .map((name) => name.getText());
          const expressions = cypherMap
            .expression_list()
            .map((expr) => expr.getText());

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

        const lambda = paramArgs.lambda();
        if (lambda) {
          return {
            type: 'set-parameters',
            parameters: [
              {
                name: lambda.unescapedSymbolicNameString().getText(),
                expression: lambda.expression().getText(),
              },
            ],
            start,
            stop,
          };
        }

        const clear = paramArgs.CLEAR();
        if (clear) {
          return { type: 'clear-parameters', start, stop };
        }

        const list = paramArgs.listCompleteRule()?.LIST();
        if (list) {
          return { type: 'list-parameters', start, stop };
        }
      }
    }

    throw new Error(`Unknown command ${stmt.getText()}`);
  });
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
function errorOnNonCypherCommands(commands: ParsedCommand[]) {
  return commands
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
  enableConsoleCommands = false;
  parsingResult?: EnrichedParsingResult;

  parse(query: string): EnrichedParsingResult {
    if (
      this.parsingResult !== undefined &&
      this.parsingResult.query === query
    ) {
      return this.parsingResult;
    } else {
      const parsingScaffolding = createParsingScaffolding(query);
      const parser = parsingScaffolding.parser;
      const tokenStream = parsingScaffolding.tokenStream;
      const errorListener = new SyntaxErrorsListener();
      parser.addErrorListener(errorListener);

      const labelsCollector = new LabelAndRelTypesCollector();
      const variableFinder = new VariableCollector();
      parser._parseListeners = [labelsCollector, variableFinder];

      const result = createParsingResult(parsingScaffolding).result;

      const diagnostics = errorListener.errors;

      const collectedCommands = parseToCommands(result);
      if (!this.enableConsoleCommands) {
        diagnostics.push(...errorOnNonCypherCommands(collectedCommands));
      }

      const parsingResult: EnrichedParsingResult = {
        query: query,
        parser: parser,
        tokens: getTokens(tokenStream),
        diagnostics,
        result: result,
        stopNode: findStopNode(result),
        collectedLabelOrRelTypes: labelsCollector.labelOrRelTypes,
        collectedVariables: variableFinder.variables,
        collectedCommands,
      };

      this.parsingResult = parsingResult;
      return parsingResult;
    }
  }

  clearCache() {
    this.parsingResult = undefined;
  }
}

export const parserWrapper = new ParserWrapper();
