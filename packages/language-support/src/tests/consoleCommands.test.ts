import { autocomplete } from '../autocompletion/autocompletion';
import { ParsedCommand, parserWrapper } from '../parserWrapper';

function expectParsedCommands(query: string, toEqual: ParsedCommand[]) {
  const result = parserWrapper.parse(query);
  expect(result.diagnostics).toEqual([]);
  expect(result.collectedCommands).toEqual(toEqual);
}

function expectErrorMessage(query: string, msg: string) {
  const result = parserWrapper.parse(query);
  expect(result.diagnostics.map((e) => e.message)).toContain(msg);
}

describe('sanity checks', () => {
  test('parses simple commands without args ', () => {
    expectParsedCommands(':clear', [{ type: 'clear' }]);
    expectParsedCommands(':history', [{ type: 'history' }]);
  });

  test('completes basic console cmds on :', () => {
    // TODO these now complete as keywords, should they? also. how do we make the USE lowercase?
    expect(autocomplete(':', {})).toEqual([
      { kind: 14, label: 'param' },
      { kind: 14, label: 'USE' },
      { kind: 14, label: 'history' },
      { kind: 14, label: 'clear' },
    ]);
  });

  test('accepts trailing ; ', () => {
    expectParsedCommands(':history;', [{ type: 'history' }]);
  });

  test('parses multiple cmds', () => {
    expectParsedCommands(':history;:history;:clear', [
      { type: 'history' },
      { type: 'history' },
      { type: 'clear' },
    ]);
  });

  test('accepts upper case', () => {
    expectParsedCommands(':HISTORY;', [{ type: 'history' }]);
  });

  test('accepts mixed case', () => {
    expectParsedCommands(':cLeaR;', [{ type: 'clear' }]);
  });

  test('handles misspelled or non-existing command', () => {
    // uses toMatchInlineSnapshot since the error message will change every time we add a command
    expect(
      parserWrapper.parse(':foo').diagnostics[0].message,
    ).toMatchInlineSnapshot(`"Expected any of param, history, clear or USE"`);

    expectErrorMessage(':clea', 'Unexpected token. Did you mean clear?');
  });
});

describe(':use', () => {
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
    // This message is not great. It would be better if it just said sometihing like unexpected extra argument
    expectErrorMessage(':use foo bar', "Expected ';' or a database name");
  });
});

describe('parameters', () => {
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
      functionSignatures: {
        'duration.inSeconds': { label: 'duration.inSeconds' },
      },
    });
    const mapCompletions = autocomplete(':param {a:  ', {
      functionSignatures: {
        'duration.inSeconds': { label: 'duration.inSeconds' },
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
  });
});

describe('command parser also handles cypher', () => {
  test('parses cypher', () => {
    expect(parserWrapper.parse('MATCH (n) RETURN n').collectedCommands).toEqual(
      [{ query: 'MATCH (n) RETURN n', type: 'cypher' }],
    );
  });

  test('preserves original whitespace', () => {
    expect(
      parserWrapper.parse('MATCH\n(n)\nRETURN n').collectedCommands,
    ).toEqual([{ query: 'MATCH\n(n)\nRETURN n', type: 'cypher' }]);
  });

  test('can split cypher into statements', () => {
    expect(
      parserWrapper.parse('CALL db.info(); RETURN 123; SHOW DATABASES')
        .collectedCommands,
    ).toEqual([
      { query: 'CALL db.info()', type: 'cypher' },
      { query: 'RETURN 123', type: 'cypher' },
      { query: 'SHOW DATABASES', type: 'cypher' },
    ]);
  });

  test('can weave cypher with cmds', () => {
    expect(
      parserWrapper.parse(
        ':use neo4j; :param x => 23;RETURN $x;:use system; SHOW DATABASES; ',
      ).collectedCommands,
    ).toEqual([
      { database: 'neo4j', type: 'use' },
      {
        parameters: [{ name: 'x', expression: '23' }],
        type: 'set-parameters',
      },
      { query: 'RETURN $x', type: 'cypher' },
      { database: 'system', type: 'use' },
      { query: 'SHOW DATABASES', type: 'cypher' },
    ]);
  });
});

// errors / completions / highlighting
// turn on / off
// can handle backticked stuff
