import type * as antlr from 'antlr4ng';
import type { Token } from 'antlr4ng';

/**
 * @returns ctx.start token
 * @throws if ctx.start is null
 */
export function getContextStartToken(ctx: antlr.ParserRuleContext): Token {
  if (!ctx.start) {
    throw new Error('property start not available in rule context');
  }
  return ctx.start;
}

/**
 * @returns ctx.stop token
 * @throws if ctx.stop is null
 */
export function getContextStopToken(ctx: antlr.ParserRuleContext): Token {
  if (!ctx.stop) {
    throw new Error('property stop not available in rule context');
  }
  return ctx.stop;
}
