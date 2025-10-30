interface SimpleTree {
  name: string;
  children?: SimpleTree[];
}

import {
  // antlrUtils,
  CypherParser,
  parse,
  ParserRuleContext,
} from '@neo4j-cypher/language-support';

// export function getDebugTree(cypher: string): SimpleTree {
//   const statements = parse(cypher);

//   function walk(node: ParserRuleContext): SimpleTree {
//     const name = antlrUtils.tree.Trees.getNodeText(
//       node,
//       CypherParser.ruleNames,
//       CypherParser,
//     );

//     return {
//       name: name,
//       children: antlrUtils.tree.Trees.getChildren(node).map(walk),
//     };
//   }

//   const children = statements.map((statement) => walk(statement));

//   return {
//     name: 'topNode',
//     children: children,
//   };
// }
