import type { ParseTreeListener, Token } from 'antlr4ng';
import {
  FunctionNameContext,
  ProcedureNameContext,
} from '../../generated-parser/CypherCmdParser.js';
import { getMethodName } from '../cypherLanguageService.js';
import type { ParsedFunction, ParsedProcedure } from '../parsingTypes.js';

// This listener collects all functions and procedures
export class MethodsCollector implements ParseTreeListener {
  public procedures: ParsedProcedure[] = [];
  public functions: ParsedFunction[] = [];
  private tokens: Token[];

  constructor(tokens: Token[]) {
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
