import { keywordNames } from './lexerSymbols';

const keywordRegex = new Array(...keywordNames.values()).join('|');

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
      include: '#keywords',
    },
    {
      include: '#labels',
    },
    {
      include: '#properties',
    },
    {
      include: '#numbers',
    },
  ],
  repository: {
    keywords: {
      patterns: [
        {
          match: '[+\\-*/]|AND|OR|NOT|XOR',
          name: 'keyword.operator',
        },
        {
          name: 'keyword.control.cypher',
          match: `\\b(${keywordRegex})\\b`,
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
      patterns: [
        {
          match: '\\:\\s*(\\`.+\\`|\\w|\\_|\\s*\\&\\s*|\\s*\\|\\s*)+',
          name: 'entity.name.class',
        },
      ],
    },
    properties: {
      patterns: [
        {
          match: '\\.\\w+',
          name: 'variable.property',
        },
      ],
    },
    numbers: {
      patterns: [
        {
          match: '\\b\\d+\\b',
          name: 'constant.numeric',
        },
      ],
    },
  },
  scopeName: 'source.cypher',
};
