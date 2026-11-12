import type { LabelOrCondition } from './types.js';
import { isLabelLeaf } from './types.js';

/** Renders a label/type tree back to its written form (e.g. `(A | !B)`). */
export function renderLabelTree(tree: LabelOrCondition): string {
  if (isLabelLeaf(tree)) {
    return tree.value;
  }
  switch (tree.condition) {
    case 'any':
      return '%';
    case 'not':
      return '!' + renderLabelTree(tree.children[0]!);
    case 'and':
    case 'or': {
      if (tree.children.length <= 1) {
        const child = tree.children[0];
        return child ? renderLabelTree(child) : '';
      }
      const separator = tree.condition === 'and' ? ' & ' : ' | ';
      return '(' + tree.children.map(renderLabelTree).join(separator) + ')';
    }
  }
}
