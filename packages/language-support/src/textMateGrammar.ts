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
  },
  scopeName: 'source.cypher',
};
