import type { ParserRuleContext, Token } from 'antlr4';
import { CharStreams, CommonTokenStream, ParseTreeListener } from 'antlr4';

import CypherLexer from './generated-parser/CypherLexer';
import CypherParser, {
  ClauseContext,
  LabelNameContext,
  LabelNameIsContext,
  LabelOrRelTypeContext,
  StatementsContext,
  VariableContext,
} from './generated-parser/CypherParser';
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
} from './highlighting/syntaxValidation/syntaxValidationHelpers';

export interface StatementParsing {
  statement: string;
  parser: CypherParser;
  tokens: Token[];
  ctx: StatementsContext;
  diagnostics: SyntaxDiagnostic[];
  stopNode: ParserRuleContext;
  collectedLabelOrRelTypes: LabelOrRelType[];
  collectedVariables: string[];
}

export interface ParsingResult {
  query: string;
  statementsParsing: StatementParsing[];
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

export function createParsingResult(
  query: string,
  tokenStream: CommonTokenStream,
  lexer: CypherLexer,
): ParsingResult {
  const stsTokenStreams = splitIntoStatements(tokenStream, lexer);

  const results: StatementParsing[] = stsTokenStreams.map((t) => {
    // TODO Why do we duplicate an EOF here sometimes if we don't deep copy?
    const tokens = [...t.tokens];
    // TODO Can this be done with the first start and last stop position on the stream?
    const statement = tokens
      .filter((token) => token.text !== '<EOF>')
      .map((token) => token.text)
      .join('');
    const parser = new CypherParser(t);
    const labelsCollector = new LabelAndRelTypesCollector();
    const variableFinder = new VariableCollector();
    const errorListener = new SyntaxErrorsListener();
    parser._parseListeners = [labelsCollector, variableFinder];
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);
    const ctx = parser.statements();

    return {
      statement: statement,
      parser: parser,
      tokens: tokens,
      diagnostics: statement.length > 0 ? errorListener.errors : [],
      // TODO this is statements in plural :(
      ctx: ctx,
      // TODO See if we can remove this
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

class ParserWrapper {
  parsingResult?: ParsingResult;

  parse(query: string): ParsingResult {
    if (
      this.parsingResult !== undefined &&
      this.parsingResult.query === query
    ) {
      return this.parsingResult;
    } else {
      const inputStream = CharStreams.fromString(query);
      const lexer = new CypherLexer(inputStream);
      const tokenStream = new CommonTokenStream(lexer);
      const parsingResult = createParsingResult(query, tokenStream, lexer);

      return parsingResult;
    }
  }

  clearCache() {
    this.parsingResult = undefined;
  }
}

export const parserWrapper = new ParserWrapper();
