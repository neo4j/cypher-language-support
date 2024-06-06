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
      include: '#strings',
    },
    {
      include: '#comments',
    },
    {
      include: '#parameters',
    },
    {
      include: '#properties',
    },
    {
      include: '#numbers',
    },
    {
      include: '#labels',
    },
    {
      include: '#procedures',
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
          // TODO Nacho Is this
          name: 'keyword.control.cypher',
        },
      ],
    },
    strings: {
      patterns: [
        {
          begin: "'",
          end: "'",
          name: 'string.quoted.single',
          patterns: [
            {
              match: '\\\\(?:.|$)',
              name: 'constant.character.escape',
            },
          ],
        },
        {
          begin: '"',
          end: '"',
          name: 'string.quoted.double',
          patterns: [
            {
              match: '\\\\(?:.|$)',
              name: 'constant.character.escape',
            },
          ],
        },
      ],
    },
    comments: {
      patterns: [
        {
          begin: '//',
          end: '$',
          name: 'comment.line',
        },
        {
          begin: '/\\*',
          end: '\\*/',
          name: 'comment.block',
        },
      ],
    },
    labels: {
      begin: '\\:',
      end: '\\s*(\\`.+\\`|\\w|\\_|\\s*\\&\\s*|\\s*\\|\\s*)+',
      beginCaptures: {
        '0': {
          name: 'keyword.operator',
        },
      },
      endCaptures: {
        '0': {
          name: 'entity.name.class',
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
          name: 'variable.property',
        },
      },
    },
    numbers: {
      match: '\\b\\d+\\b',
      name: 'constant.numeric',
    },
    procedures: {
      begin: 'CALL',
      /* 
          The procedure name is too flexible in Cypher, hence this cumbersome 
          regular expression that allows for individually namespace 
          elements to be backticked or the whole name to be backticked:
           
             CALL apoc.coll.elements
             CALL apoc   . coll . elements
             CALL `apoc` . coll . `elements`
             CALL `apoc.coll.elements`
          */
      end: '\\s*(((\\`\\w+\\`|\\w+)(\\s*\\.\\s*(\\`\\w+\\`|\\w+))*)|(\\`\\w+ (\\s*\\.\\s*\\w+)*\\`))',
      beginCaptures: {
        '0': {
          name: 'keyword.control.cypher',
        },
      },
      endCaptures: {
        '0': {
          name: 'entity.name.function.procedure',
        },
      },
    },
    functions: {
      // The function name is too flexible in Cypher, refer to comment on procedure names
      match:
        '(?i:(?!\\bmatch\\b))(((\\`\\w+\\`|\\w+)(\\s*\\.\\s*(\\`\\w+\\`|\\w+))*)|(\\`\\w+ (\\s*\\.\\s*\\w+)*\\`))\\s*\\(',
      name: 'entity.name.function',
    },
    parameters: {
      begin: '\\$',
      end: '\\w+',
      beginCaptures: {
        '0': {
          name: 'entity.name.namespace',
        },
      },
      endCaptures: {
        '0': {
          name: 'variable',
        },
      },
    },
    variables: {
      match: '\\w+',
      name: 'variable',
    },
  },
  scopeName: 'source.cypher',
};
