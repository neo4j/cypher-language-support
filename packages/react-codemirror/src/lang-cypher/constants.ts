import { languageDataProp } from '@codemirror/language';
import type { Facet } from '@codemirror/state';
import { NodeSet, NodeType } from '@lezer/common';
import { styleTags, Tag, tags } from '@lezer/highlight';
import { CypherTokenType } from '@neo4j-cypher/language-support';

export const cypherTokenTypeToNode = (facet: Facet<unknown>) => ({
  topNode: NodeType.define({
    id: 0,
    name: 'topNode',
    props: [languageDataProp.add({ topNode: facet })],
  }),
  comment: NodeType.define({ id: 1, name: 'comment' }),
  keyword: NodeType.define({ id: 2, name: 'keyword' }),
  label: NodeType.define({ id: 3, name: 'label' }),
  predicateFunction: NodeType.define({ id: 4, name: 'predicateFunction' }),
  function: NodeType.define({ id: 5, name: 'function' }),
  procedure: NodeType.define({ id: 6, name: 'procedure' }),
  variable: NodeType.define({ id: 7, name: 'variable' }),
  paramDollar: NodeType.define({ id: 8, name: 'paramDollar' }),
  paramValue: NodeType.define({ id: 9, name: 'paramValue' }),
  symbolicName: NodeType.define({ id: 10, name: 'symbolicName' }),
  operator: NodeType.define({ id: 11, name: 'operator' }),
  stringLiteral: NodeType.define({ id: 12, name: 'stringLiteral' }),
  numberLiteral: NodeType.define({ id: 13, name: 'numberLiteral' }),
  booleanLiteral: NodeType.define({ id: 14, name: 'booleanLiteral' }),
  keywordLiteral: NodeType.define({ id: 15, name: 'keywordLiteral' }),
  property: NodeType.define({ id: 16, name: 'property' }),
  namespace: NodeType.define({ id: 17, name: 'namespace' }),
  bracket: NodeType.define({ id: 18, name: 'bracket' }),
  none: NodeType.define({ id: 19, name: 'none' }),
  separator: NodeType.define({ id: 20, name: 'separator' }),
  punctuation: NodeType.define({ id: 21, name: 'punctuation' }),
  consoleCommand: NodeType.define({ id: 22, name: 'consoleCommand' }),
  // also include prism token types
  'class-name': NodeType.define({ id: 23, name: 'label' }),
  // this is escaped variables
  identifier: NodeType.define({ id: 24, name: 'variable' }),
  string: NodeType.define({ id: 25, name: 'stringLiteral' }),
  relationship: NodeType.define({ id: 26, name: 'label' }),
  boolean: NodeType.define({ id: 27, name: 'booleanLiteral' }),
  number: NodeType.define({ id: 28, name: 'numberLiteral' }),
});

export type PrismSpecificTokenType =
  | 'class-name'
  | 'identifier'
  | 'string'
  | 'relationship'
  | 'boolean'
  | 'number';

export type CodemirrorParseTokenType =
  | CypherTokenType
  | PrismSpecificTokenType
  | 'topNode';

export type HighlightedCypherTokenTypes = Exclude<CypherTokenType, 'none'>;
export const tokenTypeToStyleTag: Record<HighlightedCypherTokenTypes, Tag> = {
  comment: tags.comment,
  keyword: tags.keyword,
  label: tags.typeName,
  predicateFunction: tags.function(tags.variableName),
  function: tags.function(tags.variableName),
  procedure: tags.function(tags.variableName),
  variable: tags.variableName,
  paramDollar: tags.atom,
  paramValue: tags.atom,
  symbolicName: tags.variableName,
  operator: tags.operator,
  stringLiteral: tags.string,
  numberLiteral: tags.number,
  booleanLiteral: tags.bool,
  keywordLiteral: tags.operatorKeyword,
  property: tags.propertyName,
  namespace: tags.namespace,
  bracket: tags.bracket,
  punctuation: tags.punctuation,
  separator: tags.separator,
  consoleCommand: tags.macroName,
};

export const parserAdapterNodeSet = (nodes: Record<string, NodeType>) =>
  new NodeSet(Object.values(nodes)).extend(styleTags(tokenTypeToStyleTag));
