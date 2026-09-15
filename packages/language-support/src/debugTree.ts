import { type ParseTree, Trees } from 'antlr4ng';
import { parse } from './cypherLanguageService.js';
import { CypherCmdParser } from './generated-parser/CypherCmdParser.js';

export interface SimpleTree {
  name: string;
  children?: SimpleTree[];
}

/**
 * Builds a plain, serialisable view of the ANTLR parse tree for a query.
 *
 * This lives here rather than in the consumer so that the generated parser does not
 * need to be part of this package's public API.
 */
export function getDebugTree(cypher: string): SimpleTree {
  const statements = parse(cypher);

  function walk(node: ParseTree): SimpleTree {
    const name = Trees.getNodeText(node, CypherCmdParser.ruleNames) ?? '';

    return {
      name: name,
      children: Trees.getChildren(node).map(walk),
    };
  }

  return {
    name: 'topNode',
    children: statements.map((statement) => walk(statement)),
  };
}
