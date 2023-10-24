import { tags } from '@lezer/highlight';
import { applySyntaxColouring } from '@neo4j-cypher/language-support';
import { tokenTypeToStyleTag } from './constants';

const cypherQueryWithAllTokenTypes = `MATCH (variable :Label)-[:REL_TYPE]->() 
WHERE variable.property = "String" 
    OR namespaced.function() = false
    // comment
    OR $parameter > 2 
RETURN variable;`;

test('correctly parses all cypher token types to style tags', () => {
  const tokens = applySyntaxColouring(cypherQueryWithAllTokenTypes);
  const tokenTypes = tokens.map((token) => token.tokenType);
  expect(tokenTypes).toEqual([
    'keyword',
    'bracket',
    'variable',
    'operator',
    'label',
    'bracket',
    'separator',
    'bracket',
    'operator',
    'label',
    'bracket',
    'separator',
    'separator',
    'bracket',
    'bracket',
    'keyword',
    'variable',
    'operator',
    'property',
    'operator',
    'stringLiteral',
    'keyword',
    'function',
    'operator',
    'function',
    'bracket',
    'bracket',
    'operator',
    'booleanLiteral',
    'comment',
    'keyword',
    'paramDollar',
    'paramValue',
    'operator',
    'numberLiteral',
    'keyword',
    'variable',
    'punctuation',
  ]);

  const styleTags = tokenTypes.map((tokenType) => {
    if (tokenType === 'none') return undefined;
    return tokenTypeToStyleTag[tokenType];
  });
  const correctTags = [
    tags.keyword,
    tags.bracket,
    tags.variableName,
    tags.operator,
    tags.typeName,
    tags.bracket,
    tags.separator,
    tags.bracket,
    tags.operator,
    tags.typeName,
    tags.bracket,
    tags.separator,
    tags.separator,
    tags.bracket,
    tags.bracket,
    tags.keyword,
    tags.variableName,
    tags.operator,
    tags.propertyName,
    tags.operator,
    tags.string,
    tags.keyword,
    tags.function(tags.variableName),
    tags.operator,
    tags.function(tags.variableName),
    tags.bracket,
    tags.bracket,
    tags.operator,
    tags.bool,
    tags.comment,
    tags.keyword,
    tags.atom,
    tags.atom,
    tags.operator,
    tags.number,
    tags.keyword,
    tags.variableName,
    tags.punctuation,
  ];

  styleTags.forEach((styleTag, index) => {
    expect(styleTag).toEqual(correctTags[index]);
  });
});
