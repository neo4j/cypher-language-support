import { autocomplete } from '../autocompletion/autocompletion';
import { _internalFeatureFlags } from '../featureFlags';
import { ParsedCommandNoPosition, parserWrapper } from '../parserWrapper';
import { applySyntaxColouring } from '../syntaxColouring/syntaxColouring';
import { testData } from './testData';

function expectParsedCommands(
  query: string,
  toEqual: ParsedCommandNoPosition[],
) {
  const result = parserWrapper.parse(query);
  expect(
    result.statementsParsing.flatMap((statement) => statement.diagnostics),
  ).toEqual([]);
  expect(
    result.statementsParsing
      .flatMap((statement) => [statement.command])
      .map((cmd) => {
        const copy = { ...cmd };
        // These data structures are recursive, so .toEqual doesn't work.
        // We test the positions work properly in with the error position tests
        delete copy.start;
        delete copy.stop;
        return copy;
      }),
  ).toEqual(toEqual);
}

function expectErrorMessage(query: string, msg: string) {
  const result = parserWrapper.parse(query);
  expect(
    result.statementsParsing
      .flatMap((statement) => statement.diagnostics)
      .map((e) => e.message),
  ).toContain(msg);
}

describe('sanity checks', () => {
  beforeAll(() => {
    _internalFeatureFlags.consoleCommands = true;
  });
  afterAll(() => {
    _internalFeatureFlags.consoleCommands = false;
  });

  test('parses simple commands without args ', () => {
    expectParsedCommands(':clear', [{ type: 'clear' }]);
    expectParsedCommands(':history', [{ type: 'history' }]);
  });

  test('properly highlights simple commands', () => {
    expect(applySyntaxColouring(':clear')).toEqual([
      {
        length: 1,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: ':',
        tokenType: 'consoleCommand',
      },
      {
        length: 5,
        position: {
          line: 0,
          startCharacter: 1,
          startOffset: 1,
        },
        token: 'clear',
        tokenType: 'consoleCommand',
      },
    ]);
    expect(applySyntaxColouring(':history')).toEqual([
      {
        length: 1,
        position: {
          line: 0,
          startCharacter: 0,
          startOffset: 0,
        },
        token: ':',
        tokenType: 'consoleCommand',
      },
      {
        length: 7,
        position: {
          line: 0,
          startCharacter: 1,
          startOffset: 1,
        },
        token: 'history',
        tokenType: 'consoleCommand',
      },
    ]);
  });

  test('completes basic console cmds on :', () => {
    expect(autocomplete(':', {})).toEqual([
      { kind: 23, label: 'use' },
      { kind: 23, label: 'param' },
      { kind: 23, label: 'history' },
      { kind: 23, label: 'clear' },
    ]);
  });

  test('accepts trailing ; ', () => {
    expectParsedCommands(':history;', [
      { type: 'history' },
      { type: 'cypher', statement: '' },
    ]);
  });

  test('parses multiple cmds', () => {
    expectParsedCommands(':history;:history;:clear', [
      { type: 'history' },
      { type: 'history' },
      { type: 'clear' },
    ]);
  });

  test('accepts upper case', () => {
    expectParsedCommands(':HISTORY;', [
      { type: 'history' },
      { type: 'cypher', statement: '' },
    ]);
  });

  test('accepts mixed case', () => {
    expectParsedCommands(':cLeaR;', [
      { type: 'clear' },
      { type: 'cypher', statement: '' },
    ]);
  });

  test('handles misspelled or non-existing command', () => {
    expectErrorMessage(':foo', 'Expected any of param, history, clear or use');

    expectErrorMessage(':clea', 'Unexpected token. Did you mean clear?');
  });
});

describe(':use', () => {
  beforeAll(() => {
    _internalFeatureFlags.consoleCommands = true;
  });
  afterAll(() => {
    _internalFeatureFlags.consoleCommands = false;
  });
  test('parses without arg', () => {
    expectParsedCommands(':use', [{ type: 'use' }]);
  });
  test('parses with arg', () => {
    expectParsedCommands(':use foo', [{ type: 'use', database: 'foo' }]);
  });

  test('completes database & alias names', () => {
    expect(
      autocomplete(':use ', { databaseNames: ['foo'], aliasNames: ['bar'] }),
    ).toEqual([
      { kind: 12, label: 'foo' },
      { kind: 12, label: 'bar' },
    ]);
  });

  test('gives errors on incorrect usage of :use', () => {
    expectErrorMessage(':use 123', "Expected ';' or a database name");
    expectErrorMessage(':use foo bar', "Expected ';' or a database name");
  });

  test('highlights properly', () => {
    expect(applySyntaxColouring(':use')).toEqual([
      {
        length: 1,
        position: { line: 0, startCharacter: 0, startOffset: 0 },
        token: ':',
        tokenType: 'consoleCommand',
      },
      {
        length: 3,
        position: { line: 0, startCharacter: 1, startOffset: 1 },
        token: 'use',
        tokenType: 'consoleCommand',
      },
    ]);
    expect(applySyntaxColouring(':use foo')).toEqual([
      {
        length: 1,
        position: { line: 0, startCharacter: 0, startOffset: 0 },
        token: ':',
        tokenType: 'consoleCommand',
      },
      {
        length: 3,
        position: { line: 0, startCharacter: 1, startOffset: 1 },
        token: 'use',
        tokenType: 'consoleCommand',
      },
      {
        length: 3,
        position: { line: 0, startCharacter: 5, startOffset: 5 },
        token: 'foo',
        tokenType: 'symbolicName',
      },
    ]);
  });
});

describe('parameters', () => {
  beforeAll(() => {
    _internalFeatureFlags.consoleCommands = true;
  });
  afterAll(() => {
    _internalFeatureFlags.consoleCommands = false;
  });
  test('basic param usage', () => {
    expectParsedCommands(':param', [{ type: 'list-parameters' }]);
    expectParsedCommands(':params ', [{ type: 'list-parameters' }]);
    expectParsedCommands(':params list', [{ type: 'list-parameters' }]);
    expectParsedCommands(':params clear', [{ type: 'clear-parameters' }]);
  });

  test('allows setting parameters', () => {
    expectParsedCommands(':param foo => bar', [
      {
        type: 'set-parameters',
        parameters: [{ name: 'foo', expression: 'bar' }],
      },
    ]);

    expectParsedCommands(':param {a: 2, b: rand()}', [
      {
        type: 'set-parameters',
        parameters: [
          { name: 'a', expression: '2' },
          { name: 'b', expression: 'rand()' },
        ],
      },
    ]);
  });

  test('autocompletes expressions', () => {
    const arrowCompletions = autocomplete(':param foo => ', {
      functions: {
        'duration.inSeconds': {
          ...testData.emptyFunction,
          name: 'duration.inSeconds',
        },
      },
    });
    const mapCompletions = autocomplete(':param {a:  ', {
      functions: {
        'duration.inSeconds': {
          ...testData.emptyFunction,
          name: 'duration.inSeconds',
        },
      },
    });

    const expected = [
      { detail: '(namespace)', kind: 3, label: 'duration' },
      { detail: '(function)', kind: 3, label: 'duration.inSeconds' },
      { kind: 14, label: 'TRUE' },
      { kind: 14, label: 'FALSE' },
    ];

    expected.forEach((completion) => {
      expect(arrowCompletions).toContainEqual(completion);
      expect(mapCompletions).toContainEqual(completion);
    });
  });

  test('incorrect usage of :params', () => {
    expectErrorMessage(':param x=21', "Expected '>'");
    expectErrorMessage(':param x=>', 'Expected an expression');
    expectErrorMessage(
      ':param {a: 3',
      "Expected any of '}', ',', AND, OR, XOR or an expression",
    );
    expectErrorMessage(':param RETURN', "Expected '='");
    expectErrorMessage(':param RETURN b', "Expected '='");
    expectErrorMessage(':param b => ', 'Expected an expression');
    expectErrorMessage(':param {', "Expected '}' or an identifier");
    expectErrorMessage(':param {x}', "Expected ':'");
    expectErrorMessage(':param {x: ', 'Expected an expression');
    expectErrorMessage(':param {: 4} ', "Expected '}' or an identifier");
  });

  test('highlights :params properly', () => {
    expect(applySyntaxColouring(':param')).toEqual([
      {
        length: 1,
        position: { line: 0, startCharacter: 0, startOffset: 0 },
        token: ':',
        tokenType: 'consoleCommand',
      },
      {
        length: 5,
        position: { line: 0, startCharacter: 1, startOffset: 1 },
        token: 'param',
        tokenType: 'consoleCommand',
      },
    ]);
    expect(applySyntaxColouring(':params')).toEqual([
      {
        length: 1,
        position: { line: 0, startCharacter: 0, startOffset: 0 },
        token: ':',
        tokenType: 'consoleCommand',
      },
      {
        length: 6,
        position: { line: 0, startCharacter: 1, startOffset: 1 },
        token: 'params',
        tokenType: 'consoleCommand',
      },
    ]);
    expect(applySyntaxColouring(':params list')).toEqual([
      {
        length: 1,
        position: { line: 0, startCharacter: 0, startOffset: 0 },
        token: ':',
        tokenType: 'consoleCommand',
      },
      {
        length: 6,
        position: { line: 0, startCharacter: 1, startOffset: 1 },
        token: 'params',
        tokenType: 'consoleCommand',
      },
      {
        length: 4,
        position: { line: 0, startCharacter: 8, startOffset: 8 },
        token: 'list',
        tokenType: 'consoleCommand',
      },
    ]);
    expect(applySyntaxColouring(':param clear')).toEqual([
      {
        length: 1,
        position: { line: 0, startCharacter: 0, startOffset: 0 },
        token: ':',
        tokenType: 'consoleCommand',
      },
      {
        length: 5,
        position: { line: 0, startCharacter: 1, startOffset: 1 },
        token: 'param',
        tokenType: 'consoleCommand',
      },
      {
        length: 5,
        position: { line: 0, startCharacter: 7, startOffset: 7 },
        token: 'clear',
        tokenType: 'consoleCommand',
      },
    ]);
    expect(applySyntaxColouring(':param x => 324')).toEqual([
      {
        length: 1,
        position: { line: 0, startCharacter: 0, startOffset: 0 },
        token: ':',
        tokenType: 'consoleCommand',
      },
      {
        length: 5,
        position: { line: 0, startCharacter: 1, startOffset: 1 },
        token: 'param',
        tokenType: 'consoleCommand',
      },
      {
        length: 1,
        position: { line: 0, startCharacter: 7, startOffset: 7 },
        token: 'x',
        tokenType: 'variable',
      },
      {
        length: 1,
        position: { line: 0, startCharacter: 9, startOffset: 9 },
        token: '=',
        tokenType: 'operator',
      },
      {
        length: 1,
        position: { line: 0, startCharacter: 10, startOffset: 10 },
        token: '>',
        tokenType: 'operator',
      },
      {
        length: 3,
        position: { line: 0, startCharacter: 12, startOffset: 12 },
        token: '324',
        tokenType: 'numberLiteral',
      },
    ]);
    expect(applySyntaxColouring(':params {d: true}')).toEqual([
      {
        length: 1,
        position: { line: 0, startCharacter: 0, startOffset: 0 },
        token: ':',
        tokenType: 'consoleCommand',
      },
      {
        length: 6,
        position: { line: 0, startCharacter: 1, startOffset: 1 },
        token: 'params',
        tokenType: 'consoleCommand',
      },
      {
        bracketInfo: { bracketLevel: 0, bracketType: 'curly' },
        length: 1,
        position: { line: 0, startCharacter: 8, startOffset: 8 },
        token: '{',
        tokenType: 'bracket',
      },
      {
        length: 1,
        position: { line: 0, startCharacter: 9, startOffset: 9 },
        token: 'd',
        tokenType: 'property',
      },
      {
        length: 1,
        position: { line: 0, startCharacter: 10, startOffset: 10 },
        token: ':',
        tokenType: 'operator',
      },
      {
        length: 4,
        position: { line: 0, startCharacter: 12, startOffset: 12 },
        token: 'true',
        tokenType: 'booleanLiteral',
      },
      {
        bracketInfo: { bracketLevel: 0, bracketType: 'curly' },
        length: 1,
        position: { line: 0, startCharacter: 16, startOffset: 16 },
        token: '}',
        tokenType: 'bracket',
      },
    ]);
  });
});

describe('command parser also handles cypher', () => {
  beforeAll(() => {
    _internalFeatureFlags.consoleCommands = true;
  });
  afterAll(() => {
    _internalFeatureFlags.consoleCommands = false;
  });
  test('parses cypher', () => {
    expectParsedCommands('MATCH (n) RETURN n', [
      { statement: 'MATCH (n) RETURN n', type: 'cypher' },
    ]);
  });

  test('preserves original whitespace', () => {
    expectParsedCommands('MATCH\n(n)\nRETURN n', [
      { statement: 'MATCH\n(n)\nRETURN n', type: 'cypher' },
    ]);
  });

  test('can split cypher into statements', () => {
    expectParsedCommands('CALL db.info(); RETURN 123; SHOW DATABASES', [
      { statement: 'CALL db.info()', type: 'cypher' },
      { statement: 'RETURN 123', type: 'cypher' },
      { statement: 'SHOW DATABASES', type: 'cypher' },
    ]);
  });

  test('can weave cypher with cmds', () => {
    expectParsedCommands(
      ':use neo4j; :param x => 23;RETURN $x;:use system; SHOW DATABASES; ',
      [
        { database: 'neo4j', type: 'use' },
        {
          parameters: [{ name: 'x', expression: '23' }],
          type: 'set-parameters',
        },
        { statement: 'RETURN $x', type: 'cypher' },
        { database: 'system', type: 'use' },
        { statement: 'SHOW DATABASES', type: 'cypher' },
        { statement: '', type: 'cypher' },
      ],
    );
  });
});
