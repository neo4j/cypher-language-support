interface SimpleTree {
  name: string;
  children?: SimpleTree[];
}

import type { ParseTree } from '@neo4j-cypher/language-support';
import { CypherParser, parse, Trees } from '@neo4j-cypher/language-support';

export function getDebugTree(cypher: string): SimpleTree {
  const statements = parse(cypher);

  function walk(node: ParseTree): SimpleTree {
    const name = Trees.getNodeText(node, CypherParser.ruleNames) ?? '';

    return {
      name: name,
      children: Trees.getChildren(node).map(walk),
    };
  }

  const children = statements.map((statement) => walk(statement));

  return {
    name: 'topNode',
    children: children,
  };
}
