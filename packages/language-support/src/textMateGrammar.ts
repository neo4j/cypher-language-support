import { keywordNames, operatorSymbols } from './lexerSymbols';

const keywordRegex = new Array(...keywordNames.values()).join('|');
const operatorsRegex = new Array(...operatorSymbols.values())
  .map((v) => v.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'))
  .join('|');

export const textMateGrammar = {
  $schema:
    'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
  name: 'Cypher',
  patterns: [
    {
      include: '#properties',
    },
    {
      include: '#labels',
    },
    {
      include: '#functions',
    },
    {
      include: '#keywords',
    },
    {
      include: '#variables',
    },
  ],
  repository: {
    keywords: {
      patterns: [
        {
          match: `${operatorsRegex}`,
          name: 'keyword.operator',
        },
        {
          // The (?i) makes the pattern case insensitive
          match: `(?i)\\b(${keywordRegex})\\b`,
          name: 'keyword',
        },
      ],
    },
    labels: {
      // Prevents this rule to apply to maps {key: value}
      begin: '(?<!\\{.*)\\:',
      end: '(\\s|\\`.+?\\`|\\w|&|\\||\\(.+?\\)|\\!)+',
      beginCaptures: {
        '0': {
          name: 'keyword.operator',
        },
      },
      endCaptures: {
        '0': {
          patterns: [
            {
              match: '[&|!]',
              name: 'keyword.operator',
            },
            {
              match: '\\`.+?\\`|\\w+',
              name: 'entity.name.class',
            },
          ],
        },
      },
    },
    properties: {
      begin: '\\.',
      end: '\\w+',
      beginCaptures: {
        '0': {
          name: 'keyword.operator',
        },
      },
      endCaptures: {
        '0': {
          patterns: [
            // Avoid the matched property to be only numbers
            // otherwise we could match float numbers like .1234
            {
              match: '\\w*[a-zA-Z]\\w*',
              name: 'variable.property',
            },
            {
              include: '#constants',
            },
          ],
        },
      },
    },
    functions: {
      // The function name is too flexible in Cypher, refer to comment on procedure names
      match:
        '(?i:(?!\\bmatch\\b))(((\\`\\w+\\`|\\w+)(\\s*\\.\\s*(\\`\\w+\\`|\\w+))*)|(\\`\\w+(\\s*\\.\\s*\\w+)*\\`))\\s*\\(',
      name: 'entity.name.function',
    },
    variables: {
      match: '\\w+',
      name: 'variable',
    },
  },
  scopeName: 'source.cypher',
};
