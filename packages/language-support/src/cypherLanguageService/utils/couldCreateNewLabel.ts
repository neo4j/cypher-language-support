import type { ParserRuleContext } from 'antlr4ng';
import { ClauseContext } from '../../generated-parser/CypherCmdParser.js';
import { findParent } from '../../helpers.js';

export function couldCreateNewLabel(ctx: ParserRuleContext): boolean {
  const parent = findParent(ctx, (ctx) => ctx instanceof ClauseContext);

  if (parent instanceof ClauseContext) {
    const clause = parent;
    return Boolean(
      clause.mergeClause() || clause.createClause() || clause.insertClause(),
    );
  } else {
    return false;
  }
}
