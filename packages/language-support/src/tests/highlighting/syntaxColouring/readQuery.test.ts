import { applySyntaxColouring } from '../../../highlighting/syntaxColouring/syntaxColouring';

describe('MATCH syntax colouring', () => {
  test('Correctly colours labels conjunction', () => {
    const query = 'MATCH (n:A&B)';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'MATCH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'A',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: '&',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: 'B',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 12,
          startOffset: 12,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours labels disjuntion', () => {
    const query = 'MATCH (n:A|B)';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'MATCH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'A',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: '|',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: 'B',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 12,
          startOffset: 12,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours negated label', () => {
    const query = 'MATCH (n:!A)';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'MATCH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: '!',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: 'A',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours parenthesized label expressions', () => {
    const query = 'MATCH (n:(!A&!B)|C)';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'MATCH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: '!',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 11,
          startOffset: 11,
        },
        token: 'A',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 12,
          startOffset: 12,
        },
        token: '&',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 13,
          startOffset: 13,
        },
        token: '!',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        token: 'B',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: '|',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 17,
          startOffset: 17,
        },
        token: 'C',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours parenthesized relationship type expressions', () => {
    const query = 'MATCH (n:Label)-[r:(!R1&!R2)|R3]';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'MATCH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'Label',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: '[',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 17,
          startOffset: 17,
        },
        token: 'r',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 19,
          startOffset: 19,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 20,
          startOffset: 20,
        },
        token: '!',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 21,
          startOffset: 21,
        },
        token: 'R1',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 23,
          startOffset: 23,
        },
        token: '&',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 24,
          startOffset: 24,
        },
        token: '!',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 25,
          startOffset: 25,
        },
        token: 'R2',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 27,
          startOffset: 27,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 28,
          startOffset: 28,
        },
        token: '|',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 29,
          startOffset: 29,
        },
        token: 'R3',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 31,
          startOffset: 31,
        },
        token: ']',
        tokenType: 'bracket',
      },
    ]);
  });

  test('Correctly colours OPTIONAL', () => {
    const query = 'OPTIONAL MATCH (n)';
    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'OPTIONAL',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'MATCH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 17,
          startOffset: 17,
        },
        token: ')',
        tokenType: 'bracket',
      },
    ]);
  });
});

describe('RETURN syntax colouring', () => {
  test('Correctly colours AS and SKIP', () => {
    const query = `MATCH (n:Label)-[r]->(m:Label)
      RETURN n AS node, r AS rel
      SKIP 10
    `;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'MATCH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'Label',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: '[',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 17,
          startOffset: 17,
        },
        token: 'r',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        token: ']',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 19,
          startOffset: 19,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 20,
          startOffset: 20,
        },
        token: '>',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 21,
          startOffset: 21,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 22,
          startOffset: 22,
        },
        token: 'm',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 23,
          startOffset: 23,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 24,
          startOffset: 24,
        },
        token: 'Label',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 29,
          startOffset: 29,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 1,
          startCharacter: 6,
          startOffset: 37,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 13,
          startOffset: 44,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 1,
          startCharacter: 15,
          startOffset: 46,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 18,
          startOffset: 49,
        },
        token: 'node',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 22,
          startOffset: 53,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 24,
          startOffset: 55,
        },
        token: 'r',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 1,
          startCharacter: 26,
          startOffset: 57,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 1,
          startCharacter: 29,
          startOffset: 60,
        },
        token: 'rel',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 2,
          startCharacter: 6,
          startOffset: 70,
        },
        token: 'SKIP',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 2,
          startCharacter: 11,
          startOffset: 75,
        },
        token: '10',
        tokenType: 'numberLiteral',
      },
    ]);
  });

  test('Correctly colours ORDER BY', () => {
    const query = `RETURN n AS node, r AS rel ORDER BY n.name DESC`;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 12,
          startOffset: 12,
        },
        token: 'node',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        token: 'r',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 20,
          startOffset: 20,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 3,
        position: {
          line: 0,
          startCharacter: 23,
          startOffset: 23,
        },
        token: 'rel',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 27,
          startOffset: 27,
        },
        token: 'ORDER',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 33,
          startOffset: 33,
        },
        token: 'BY',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 36,
          startOffset: 36,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 37,
          startOffset: 37,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 38,
          startOffset: 38,
        },
        token: 'name',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 43,
          startOffset: 43,
        },
        token: 'DESC',
        tokenType: 'keyword',
      },
    ]);
  });

  test('Correctly colours LIMIT', () => {
    const query = `RETURN n LIMIT 10`;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'LIMIT',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: '10',
        tokenType: 'numberLiteral',
      },
    ]);
  });
});

describe('WHERE syntax colouring', () => {
  test('Correctly colours MATCH with WHERE and RETURN', () => {
    const query = 'MATCH (n:Person) WHERE n.name = "foo" RETURN n';

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'MATCH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'Person',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 17,
          startOffset: 17,
        },
        token: 'WHERE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 23,
          startOffset: 23,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 24,
          startOffset: 24,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 25,
          startOffset: 25,
        },
        token: 'name',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 30,
          startOffset: 30,
        },
        token: '=',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 32,
          startOffset: 32,
        },
        token: '"foo"',
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 0,
          startCharacter: 38,
          startOffset: 38,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 45,
          startOffset: 45,
        },
        token: 'n',
        tokenType: 'variable',
      },
    ]);
  });

  test('Correctly colours WHERE with parameter', () => {
    const query = `MATCH (n:Label)-->(m:Label)
    WHERE n.property <> $value
    RETURN n, m`;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'MATCH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 6,
          startOffset: 6,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 7,
          startOffset: 7,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 8,
          startOffset: 8,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 9,
          startOffset: 9,
        },
        token: 'Label',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 14,
          startOffset: 14,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 15,
          startOffset: 15,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 16,
          startOffset: 16,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 17,
          startOffset: 17,
        },
        token: '>',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 18,
          startOffset: 18,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 19,
          startOffset: 19,
        },
        token: 'm',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 20,
          startOffset: 20,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 0,
          startCharacter: 21,
          startOffset: 21,
        },
        token: 'Label',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 0,
          startCharacter: 26,
          startOffset: 26,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 4,
          startOffset: 32,
        },
        token: 'WHERE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 10,
          startOffset: 38,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 11,
          startOffset: 39,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 8,
        position: {
          line: 1,
          startCharacter: 12,
          startOffset: 40,
        },
        token: 'property',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 1,
          startCharacter: 21,
          startOffset: 49,
        },
        token: '<>',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 24,
          startOffset: 52,
        },
        token: '$',
        tokenType: 'paramDollar',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 25,
          startOffset: 53,
        },
        token: 'value',
        tokenType: 'paramValue',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 4,
          startOffset: 63,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 11,
          startOffset: 70,
        },
        token: 'n',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 12,
          startOffset: 71,
        },
        token: ',',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 14,
          startOffset: 73,
        },
        token: 'm',
        tokenType: 'variable',
      },
    ]);
  });

  test('Correctly colours relationship with WHERE', () => {
    const query = `WITH 2000 AS minYear
    MATCH (a:Person {name: 'Andy'})
    RETURN [(a)-[r:KNOWS WHERE r.since < minYear]->(b:Person) | r.since] AS years`;

    expect(applySyntaxColouring(query)).toEqual([
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: 'WITH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 0,
          startCharacter: 5,
          startOffset: 5,
        },
        token: '2000',
        tokenType: 'numberLiteral',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 0,
          startCharacter: 10,
          startOffset: 10,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 0,
          startCharacter: 13,
          startOffset: 13,
        },
        token: 'minYear',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 1,
          startCharacter: 4,
          startOffset: 25,
        },
        token: 'MATCH',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 10,
          startOffset: 31,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 11,
          startOffset: 32,
        },
        token: 'a',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 12,
          startOffset: 33,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 1,
          startCharacter: 13,
          startOffset: 34,
        },
        token: 'Person',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 20,
          startOffset: 41,
        },
        token: '{',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 4,
        position: {
          line: 1,
          startCharacter: 21,
          startOffset: 42,
        },
        token: 'name',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 25,
          startOffset: 46,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 1,
          startCharacter: 27,
          startOffset: 48,
        },
        token: "'Andy'",
        tokenType: 'stringLiteral',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 33,
          startOffset: 54,
        },
        token: '}',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 1,
          startCharacter: 34,
          startOffset: 55,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 4,
          startOffset: 61,
        },
        token: 'RETURN',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 11,
          startOffset: 68,
        },
        token: '[',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 12,
          startOffset: 69,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 13,
          startOffset: 70,
        },
        token: 'a',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 14,
          startOffset: 71,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 15,
          startOffset: 72,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 16,
          startOffset: 73,
        },
        token: '[',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 17,
          startOffset: 74,
        },
        token: 'r',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 18,
          startOffset: 75,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 19,
          startOffset: 76,
        },
        token: 'KNOWS',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 25,
          startOffset: 82,
        },
        token: 'WHERE',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 31,
          startOffset: 88,
        },
        token: 'r',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 32,
          startOffset: 89,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 33,
          startOffset: 90,
        },
        token: 'since',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 39,
          startOffset: 96,
        },
        token: '<',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 7,
        position: {
          line: 2,
          startCharacter: 41,
          startOffset: 98,
        },
        token: 'minYear',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 48,
          startOffset: 105,
        },
        token: ']',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 49,
          startOffset: 106,
        },
        token: '-',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 50,
          startOffset: 107,
        },
        token: '>',
        tokenType: 'separator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 51,
          startOffset: 108,
        },
        token: '(',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 52,
          startOffset: 109,
        },
        token: 'b',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 53,
          startOffset: 110,
        },
        token: ':',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 6,
        position: {
          line: 2,
          startCharacter: 54,
          startOffset: 111,
        },
        token: 'Person',
        tokenType: 'label',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 60,
          startOffset: 117,
        },
        token: ')',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 62,
          startOffset: 119,
        },
        token: '|',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 64,
          startOffset: 121,
        },
        token: 'r',
        tokenType: 'variable',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 65,
          startOffset: 122,
        },
        token: '.',
        tokenType: 'operator',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 66,
          startOffset: 123,
        },
        token: 'since',
        tokenType: 'property',
      },
      {
        bracketInfo: undefined,
        length: 1,
        position: {
          line: 2,
          startCharacter: 71,
          startOffset: 128,
        },
        token: ']',
        tokenType: 'bracket',
      },
      {
        bracketInfo: undefined,
        length: 2,
        position: {
          line: 2,
          startCharacter: 73,
          startOffset: 130,
        },
        token: 'AS',
        tokenType: 'keyword',
      },
      {
        bracketInfo: undefined,
        length: 5,
        position: {
          line: 2,
          startCharacter: 76,
          startOffset: 133,
        },
        token: 'years',
        tokenType: 'variable',
      },
    ]);
  });
});
