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
      include: '#properties',
    },
    {
      include: '#numbers',
    },
    {
      include: '#labels',
    },
    {
      include: '#keywords',
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
      ],
    },
    properties: {
      patterns: [
        {
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
