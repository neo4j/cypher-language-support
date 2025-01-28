import { TerminalNode } from 'antlr4';
import {
  MergeClauseContext,
  StatementsOrCommandsContext,
} from '../generated-parser/CypherCmdParser';
import CypherCmdParserVisitor from '../generated-parser/CypherCmdParserVisitor';
import { getParseTreeAndTokens, handleMergeClause } from './formattingHelpers';

class StandardizingVisitor extends CypherCmdParserVisitor<void> {
  buffer = [];

  format = (root: StatementsOrCommandsContext) => {
    this.visit(root);
    return this.buffer.join('');
  };

  visitMergeClause = (ctx: MergeClauseContext) => {
    handleMergeClause(ctx, (node) => this.visit(node));
  };

  visitTerminal = (node: TerminalNode) => {
    this.buffer.push(node.getText().toLowerCase());
    this.buffer.push(' ');
  };
}

export function standardizeQuery(query: string): string {
  const { tree } = getParseTreeAndTokens(query);
  const visitor = new StandardizingVisitor();
  return visitor.format(tree);
}
