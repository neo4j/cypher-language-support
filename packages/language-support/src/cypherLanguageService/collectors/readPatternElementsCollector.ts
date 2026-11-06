import type { ParseTreeListener } from 'antlr4ng';
import { PatternElementContext } from '../../generated-parser/CypherCmdParser.js';
import { couldCreateNewLabel } from '../utils/couldCreateNewLabel.js';

export class ReadPatternElementsCollector implements ParseTreeListener {
  readPatternElements: PatternElementContext[] = [];
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
    if (ctx instanceof PatternElementContext && !couldCreateNewLabel(ctx)) {
      this.readPatternElements.push(ctx);
    }
  }
}
