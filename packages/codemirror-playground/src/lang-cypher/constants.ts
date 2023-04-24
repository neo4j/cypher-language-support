import { NodeSet, NodeType } from '@lezer/common';
import { styleTags, tags } from '@lezer/highlight';
import { CypherTokenType } from 'language-support/src/lexerSymbols';

export const cypherTokenTypeToNode: Record<CypherTokenType, NodeType> & {
  topNode: NodeType;
} = {
  topNode: NodeType.define({ id: 0, name: 'topNode' }),
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
};

export const parserAdapterNodeSet = new NodeSet(
  Object.values(cypherTokenTypeToNode),
).extend(
  styleTags({
    // These aren't very good but it's something
    comment: tags.comment,
    keyword: tags.keyword,
    label: tags.typeName,
    predicateFunction: tags.function(tags.variableName), //should be like this? tags.function(tags.variableName),
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
  }),
);
