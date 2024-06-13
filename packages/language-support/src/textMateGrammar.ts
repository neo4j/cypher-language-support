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
      include: '#constants',
    },
    {
      include: '#properties',
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
          name: 'keyword',
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
    constants: {
      patterns: [
        {
          match: '\\b\\d*(\\.)?\\d+\\b',
          name: 'constant.numeric',
        },
        {
          match: '(?i)\\b(TRUE|FALSE)\\b',
          name: 'constant.numeric',
        },
      ],
    },
    procedures: {
      patterns: [
        /* 
        This rule is to recognize the CALL subquery independently, otherwise the
        next rule would recognize CALL and then anything that is in between CALL
        and the (. Example:

        CALL {
          CALL {
              UNWIND range(

        would paint the inner CALL as a procedure as well because it's between 
        the outer CALL and the range(
        */
        {
          begin: 'CALL',
          end: '\\{',
          beginCaptures: {
            '0': {
              name: 'keyword',
            },
          },
          endCaptures: {
            '0': {
              name: 'keyword.operator',
            },
          },
        },
        {
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
          end: '\\(',
          beginCaptures: {
            '0': {
              name: 'keyword',
            },
          },
          patterns: [
            {
              match: '`\\w+\\`|\\w+',
              name: 'entity.name.function.procedure',
            },
            {
              match: '\\.',
              name: 'keyword.operator',
            },
          ],
        },
      ],
    },
    functions: {
      /* 
      The function name is too flexible in Cypher, refer to comment on procedure names
      We don't want to recognize as functions:
      
        MATCH (n:Label)
        AND (openEnded = 1 AND candidate <> end)
        OR  (openEnded = 2 AND candidate <> start)

      */
      match:
        '(?i:(?!\\b(match|and|or|xor)\\b))(((\\`\\w+\\`|\\w+)(\\s*\\.\\s*(\\`\\w+\\`|\\w+))*)|(\\`\\w+(\\s*\\.\\s*\\w+)*\\`))\\s*\\(',
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
