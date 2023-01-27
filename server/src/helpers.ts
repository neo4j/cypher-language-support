import { ParserRuleContext } from 'antlr4ts';
import { OC_CypherContext } from './antlr/CypherParser';

export function findStopNode(root: OC_CypherContext) {
  let children = root.children;
  let current: ParserRuleContext = root;

  while (children && children.length > 0) {
    let index = children.length - 1;
    let child = children[index];

    while (index > 0 && (child === root.EOF() || child.text === '')) {
      index--;
      child = children[index];
    }
    current = child as ParserRuleContext;
    children = current.children;
  }

  return current;
}

export function findParent(
  leaf: ParserRuleContext,
  condition: (node: ParserRuleContext) => boolean,
) {
  let current: ParserRuleContext | undefined = leaf;

  while (current && !condition(current)) {
    current = current.parent;
  }

  return current;
}
