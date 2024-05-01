import { keywordNames } from './lexerSymbols';

const keywordRegex = new Array(...keywordNames.values()).join('|');

export const textMateGrammar = {
  $schema:
    'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
  name: 'Cypher',
  patterns: [
    {
      include: '#keywords',
    },
    {
      include: '#strings',
    },
    {
      include: '#comments',
    },
    {
      include: '#types',
    },
  ],
  repository: {
    keywords: {
      patterns: [
        {
          name: 'keyword.control.cypher',
          match: `\\b(${keywordRegex})\\b`,
        },
      ],
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.double.cypher',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.cypher',
              match: '\\\\.',
            },
          ],
        },
        {
          name: 'string.quoted.single.cypher',
          begin: "'",
          end: "'",
          patterns: [
            {
              name: 'constant.character.escape.cypher',
              match: '\\\\.',
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
    types: {
      patterns: [
        {
          begin: ':',
          end: '(?=\\s)',
          patterns: [
            {
              begin: '\\w+',
              end: '(?=\\s|$)',
              name: 'storage.type',
            },
          ],
        },
      ],
    },
  },
  scopeName: 'source.cypher',
};
