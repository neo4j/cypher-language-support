import type { ParseTreeListener } from 'antlr4ng';
import { ParameterContext } from '../../generated-parser/CypherCmdParser.js';
import type { ParsedParameter } from '../parsingTypes.js';
import {
  getContextStartToken,
  getContextStopToken,
} from '../../helpers/getContextToken.js';

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
          line: getContextStartToken(ctx).line,
          column: getContextStartToken(ctx).column,
          offsets: {
            start: getContextStartToken(ctx).start,
            end: getContextStopToken(ctx).stop + 1,
          },
        });
      }
    }
  }
}
