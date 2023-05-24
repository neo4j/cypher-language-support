import { CommonTokenStream, ParserRuleContext, Token } from 'antlr4';
import { StatementsContext } from './generated-parser/CypherParser';

export function findStopNode(root: StatementsContext) {
  let children = root.children;
  let current: ParserRuleContext = root;

  while (children && children.length > 0) {
    let index = children.length - 1;
    let child = children[index];

    while (
      index > 0 &&
      (child === root.EOF() ||
        child.getText() === '' ||
        child.getText().startsWith('<missing'))
    ) {
      index--;
      child = children[index];
    }
    current = child as ParserRuleContext;
    children = current.children;
  }

  return current;
}

export function findParent(
  leaf: ParserRuleContext | undefined,
  condition: (node: ParserRuleContext) => boolean,
) {
  let current: ParserRuleContext | undefined = leaf;

  while (current && !condition(current)) {
    current = current.parentCtx;
  }

  return current;
}

export function getTokens(tokenStream: CommonTokenStream): Token[] {
  // FIXME The type of .tokens is string[], it seems wrong in the antlr4 library
  // Fix this after we've raised an issue and a PR and has been corrected in antlr4
  return tokenStream.tokens as unknown as Token[];
}
