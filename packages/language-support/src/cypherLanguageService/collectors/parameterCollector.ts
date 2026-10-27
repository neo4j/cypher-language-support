import type { ParseTreeListener } from 'antlr4ng';
import { ParameterContext } from '../../generated-parser/CypherCmdParser.js';
import type { ParsedParameter } from '../parsingTypes.js';

export class ParameterCollector implements ParseTreeListener {
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
          line: ctx.start!.line,
          column: ctx.start!.column,
          offsets: {
            start: ctx.start!.start,
            end: ctx.stop!.stop + 1,
          },
        });
      }
    }
  }
}
