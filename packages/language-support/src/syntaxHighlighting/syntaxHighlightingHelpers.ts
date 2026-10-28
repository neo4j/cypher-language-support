import type * as antlr from 'antlr4ng';
import type { Token } from 'antlr4ng';

/**
 * @returns ctx.start
 * @throws if ctx.start is null
 */
export function getContextStart(ctx: antlr.ParserRuleContext): Token {
  if (!ctx.start) {
    throw new Error('property start not available in rule context');
  }
  return ctx.start;
}
