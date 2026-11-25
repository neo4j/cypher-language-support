import type { ParseTreeListener, Token } from 'antlr4ng';
import { ParameterContext } from '../../generated-parser/CypherCmdParser.js';
import { contextContainsToken } from '../../helpers.js';
import type { ParsedParameter } from '../parsingTypes.js';

export class ParameterCollector implements ParseTreeListener {
  parameters: ParsedParameter[] = [];
  caretParameter?: ParsedParameter;

  constructor(private caretToken?: Token) {}

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
      if (parameterName && ctx.start && ctx.stop) {
        const parsedParameter = {
          name: parameterName,
          rawText: ctx.getText(),
          line: ctx.start.line,
          column: ctx.start.column,
          offsets: {
            start: ctx.start.start,
            end: ctx.stop.stop + 1,
          },
        };
        this.parameters.push(parsedParameter);
        if (this.caretToken && contextContainsToken(ctx, this.caretToken)) {
          this.caretParameter = parsedParameter;
        }
      }
    }
  }
}
