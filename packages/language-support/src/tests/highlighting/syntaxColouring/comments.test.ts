import { BracketType } from '../../../highlighting/syntaxColouringHelpers';
import { CypherTokenType } from '../../../lexerSymbols';
import { testSyntaxColouring } from './helpers';

describe('Comments syntax colouring', () => {
  test('Correctly colours one line comments', () => {
    const query = `
    // Some comment
    // Another comment
    CALL foo.bar()
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 1,
          startCharacter: 4,
        },
        length: 15,
        tokenType: CypherTokenType.comment,
        token: '// Some comment',
      },
      {
        position: {
          line: 2,
          startCharacter: 4,
        },
        length: 18,
        tokenType: CypherTokenType.comment,
        token: '// Another comment',
      },
      {
        position: {
          line: 3,
          startCharacter: 4,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 3,
          startCharacter: 9,
        },
        length: 3,
        tokenType: CypherTokenType.procedure,
        token: 'foo',
      },
      {
        position: {
          line: 3,
          startCharacter: 12,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 3,
          startCharacter: 13,
        },
        length: 3,
        tokenType: CypherTokenType.procedure,
        token: 'bar',
      },
      {
        position: {
          line: 3,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '(',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 3,
          startCharacter: 17,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
    ]);
  });

  test('Correctly colours multiline comments', () => {
    const query = `
    /* Some multiline
    comment
    */  
    CALL foo.bar()
    `;

    testSyntaxColouring(query, [
      {
        position: {
          line: 1,
          startCharacter: 4,
        },
        length: 17,
        tokenType: CypherTokenType.comment,
        token: '/* Some multiline',
      },
      {
        position: {
          line: 2,
          startCharacter: 0,
        },
        length: 11,
        tokenType: CypherTokenType.comment,
        token: '    comment',
      },
      {
        position: {
          line: 3,
          startCharacter: 0,
        },
        length: 6,
        tokenType: CypherTokenType.comment,
        token: '    */',
      },
      {
        position: {
          line: 4,
          startCharacter: 4,
        },
        length: 4,
        tokenType: CypherTokenType.keyword,
        token: 'CALL',
      },
      {
        position: {
          line: 4,
          startCharacter: 9,
        },
        length: 3,
        tokenType: CypherTokenType.procedure,
        token: 'foo',
      },
      {
        position: {
          line: 4,
          startCharacter: 12,
        },
        length: 1,
        tokenType: CypherTokenType.operator,
        token: '.',
      },
      {
        position: {
          line: 4,
          startCharacter: 13,
        },
        length: 3,
        tokenType: CypherTokenType.procedure,
        token: 'bar',
      },
      {
        position: {
          line: 4,
          startCharacter: 16,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '(',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
      {
        position: {
          line: 4,
          startCharacter: 17,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketType: BracketType.parenthesis,
          bracketLevel: 0,
        },
      },
    ]);
  });

  test('Correctly colours comments which include cypher keywords', () => {
    const query = `MATCH (n) RETURN n // MATCH (n) finds all nodes`;

    testSyntaxColouring(query, [
      {
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        length: 5,
        tokenType: CypherTokenType.keyword,
        token: 'MATCH',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: '(',
        bracketInfo: {
          bracketLevel: 0,
          bracketType: BracketType.parenthesis,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        length: 1,
        tokenType: CypherTokenType.bracket,
        token: ')',
        bracketInfo: {
          bracketLevel: 0,
          bracketType: BracketType.parenthesis,
        },
      },
      {
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        length: 6,
        tokenType: CypherTokenType.keyword,
        token: 'RETURN',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 17,
          startOffset: 17,
        },
        length: 1,
        tokenType: CypherTokenType.variable,
        token: 'n',
        bracketInfo: undefined,
      },
      {
        position: {
          line: 0,
          startCharacter: 19,
          startOffset: 19,
        },
        length: 28,
        tokenType: CypherTokenType.comment,
        token: '// MATCH (n) finds all nodes',
        bracketInfo: undefined,
      },
    ]);
  });
});
