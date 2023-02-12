/* eslint-disable @typescript-eslint/no-var-requires */
import * as Parser from 'tree-sitter';
const Cypher = require('../../tree-sitter-cypher');

export async function treeSitterParse(sourceCode: string) {
  const parser = new Parser();
  parser.setLanguage(Cypher);
  const tree = parser.parse(sourceCode);
  // This for accessing to all the possible nodes
  console.log(Cypher.nodeTypeInfo);

  return tree;
}
