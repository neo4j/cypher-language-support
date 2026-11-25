import type { SymbolTable } from '../../../types.js';
import { ParserRuleContext } from 'antlr4ng';
import {
  BooleanLiteralContext,
  NumericLiteralContext,
  StringsLiteralContext,
  VariableContext,
  type ExpressionContext,
} from '../../../generated-parser/CypherCmdParser.js';

/** Infers the types of simple expressions */
export function inferExpressionTypes(
  expression: ExpressionContext,
  symbolTable: SymbolTable,
): string[] {
  return inferRuleTypes(expression, symbolTable);
}

function inferRuleTypes(
  node: ParserRuleContext,
  symbolTable: SymbolTable,
): string[] {
  if (node instanceof VariableContext) {
    return getVariableTypes(node, symbolTable);
  }
  if (node instanceof StringsLiteralContext) return ['STRING'];
  if (node instanceof BooleanLiteralContext) return ['BOOLEAN'];
  if (node instanceof NumericLiteralContext) {
    return [node.numberLiteral().DECIMAL_DOUBLE() ? 'FLOAT' : 'INTEGER'];
  }

  if (
    node.children.length === 1 &&
    node.children[0] instanceof ParserRuleContext
  ) {
    return inferRuleTypes(node.children[0], symbolTable);
  }

  return [];
}

function getVariableTypes(
  node: VariableContext,
  symbolTable: SymbolTable,
): string[] {
  const start = node.start;
  if (!start) return [];

  const types =
    symbolTable.find((symbol) => symbol.references.includes(start.start))
      ?.types ?? [];

  return types.map((t) => t.toUpperCase());
}
