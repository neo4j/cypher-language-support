import { TerminalNode } from 'antlr4ng';
import { StatementsOrCommandsContext } from '../generated-parser/CypherCmdParser.js';
import { CypherCmdParserVisitor } from '../generated-parser/CypherCmdParserVisitor.js';
import { getParseTreeAndTokens } from './formattingHelpers';

class StandardizingVisitor extends CypherCmdParserVisitor<void> {
  buffer = [];

  format = (root: StatementsOrCommandsContext) => {
    this.visit(root);
    return this.buffer.join('');
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
