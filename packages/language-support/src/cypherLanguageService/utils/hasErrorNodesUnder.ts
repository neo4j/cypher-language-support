import type { ParserRuleContext } from 'antlr4ng';
import { ParseTreeWalker } from 'antlr4ng';

export function hasErrorNodesUnder(ctx: ParserRuleContext): boolean {
  let found: boolean = false;
  ParseTreeWalker.DEFAULT.walk(
    {
      visitTerminal() {},
      visitErrorNode() {
        found = true;
      },
      enterEveryRule() {},
      exitEveryRule() {},
    },
    ctx,
  );
  return found;
}
