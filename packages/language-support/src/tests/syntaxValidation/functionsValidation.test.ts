import { DiagnosticTag } from 'vscode-languageserver-types';
import { testData } from '../testData';
import { getDiagnosticsForQuery } from './helpers';

describe('Functions semantic validation spec', () => {
  test('Syntax validation warns on deprecated function when database can be contacted and deprecated by is not present', () => {
    const query = `RETURN id()`;
    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual(
      expect.arrayContaining([
        {
          tags: [DiagnosticTag.Deprecated],
          offsets: {
            end: 9,
            start: 7,
          },
          message: 'Function id is deprecated.',
          range: {
            end: {
              character: 9,
              line: 0,
            },
            start: {
              character: 7,
              line: 0,
            },
          },
          severity: 2,
        },
      ]),
    );
  });

  test('Syntax validation warns on deprecated function when database can be contacted and deprecated by is present', () => {
    const query = `RETURN apoc.text.regreplace("Neo4j GraphQL Neo4j GraphQL", "GraphQL", "GRANDstack") AS output;`;
    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([
      {
        message:
          'Function apoc.text.regreplace is deprecated. Alternative: apoc.text.replace',
        offsets: {
          end: 27,
          start: 7,
        },
        range: {
          end: {
            character: 27,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 2,
        tags: [2],
      },
    ]);
  });

  test('Syntax validation error on function used as procedure returns helpful message', () => {
    const query = `CALL abs(-50) YIELD *`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([
      {
        message:
          'abs is a function, not a procedure. Did you mean to use the function abs with a RETURN instead of a CALL clause?',
        offsets: {
          end: 8,
          start: 5,
        },
        range: {
          end: {
            character: 8,
            line: 0,
          },
          start: {
            character: 5,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Using improved message for function used as procedure is not case sensitive for built-in functions', () => {
    const query = `CALL aBs(-50) YIELD *`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([
      {
        message:
          'aBs is a function, not a procedure. Did you mean to use the function aBs with a RETURN instead of a CALL clause?',
        offsets: {
          end: 8,
          start: 5,
        },
        range: {
          end: {
            character: 8,
            line: 0,
          },
          start: {
            character: 5,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Using improved message for function used as procedure is case sensitive for external functions', () => {
    const query = `CALL apoc.text.TOUpperCase("message") YIELD *`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([
      {
        message:
          "Procedure apoc.text.TOUpperCase is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 26,
          start: 5,
        },
        range: {
          end: {
            character: 26,
            line: 0,
          },
          start: {
            character: 5,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation errors on missing function when database can be contacted', () => {
    const query = `RETURN dontpanic("marvin")`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([
      {
        offsets: {
          end: 16,
          start: 7,
        },
        message:
          "Function dontpanic is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        range: {
          end: {
            character: 16,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation does not error on existing function when database can be contacted', () => {
    const query = `RETURN abs(4)`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([]);
  });

  test('Syntax validation errors on missing function with namespace when database can be contacted', () => {
    const query = `RETURN test.dontpanic("marvin")`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([
      {
        offsets: {
          end: 21,
          start: 7,
        },
        message:
          "Function test.dontpanic is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        range: {
          end: {
            character: 21,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation does not error on existing function with namespace when database can be contacted', () => {
    const query = `RETURN apoc.text.decapitalize("Marvin")`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([]);
  });

  test('Syntax validation errors on missing function with namespace split in multiple lines when database can be contacted', () => {
    const query = `RETURN test.
    dontpanic
    ("marvin")
    `;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([
      {
        offsets: {
          end: 26,
          start: 7,
        },
        message:
          "Function test.dontpanic is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        range: {
          end: {
            character: 13,
            line: 1,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation does not error on existing function with namespace split in multiple lines when database can be contacted', () => {
    const query = `
    RETURN apoc.text.
      capitalize
      ("marvin")
    `;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([]);
  });

  test('Syntax validation is case insensitive on built-in functions', () => {
    const query = `
    RETURN aBS(123)
    `;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([]);
  });

  test('Syntax validation is not case insensitive on user defined functions', () => {
    const query = `
    RETURN apoc.text.capiTALize("marvin")
    `;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([
      {
        message:
          "Function apoc.text.capiTALize is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 32,
          start: 12,
        },
        range: {
          end: {
            character: 31,
            line: 1,
          },
          start: {
            character: 11,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation does not error on existing function with spaces when database can be contacted', () => {
    const query = `RETURN apoc.   text.  decapitalize   ("Marvin")`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([]);
  });

  test('Syntax validation errors with correct positions with spaces when database can be contacted', () => {
    const query = `RETURN apoc.   text.  dontpanic   ("Marvin")`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([
      {
        message:
          "Function apoc.text.dontpanic is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 31,
          start: 7,
        },
        range: {
          end: {
            character: 31,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation does not error on existing function with new lines when database can be contacted', () => {
    const query = `RETURN apoc. 
     text. 
    decapitalize  
    ("Marvin")`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([]);
  });

  test('Syntax validation errors with correct positions with spaces when database can be contacted', () => {
    const query = `RETURN apoc.   text. 
     dontpanic  
     ("Marvin")`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([
      {
        message:
          "Function apoc.text.dontpanic is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 36,
          start: 7,
        },
        range: {
          end: {
            character: 14,
            line: 1,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation should recognize escaped function names', () => {
    const query = `
    RETURN \`abs\`(123)
    `;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([]);
  });

  test('Syntax validation should fail on escaped function names that do not exist', () => {
    const query = `
    RETURN \`dontpanic\`(123)
    `;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([
      {
        message:
          "Function dontpanic is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 23,
          start: 12,
        },
        range: {
          end: {
            character: 22,
            line: 1,
          },
          start: {
            character: 11,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation should pass on escaped function names with namespaces', () => {
    const query = "RETURN `apoc`.text.`capitalize`('Marvin');";

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([]);
  });

  test('Syntax validation should fail on escaped function names with namespaces that do not exist', () => {
    const query = "RETURN `apoc`.text.`dontpanic`('Marvin');";

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([
      {
        message:
          "Function apoc.text.dontpanic is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 30,
          start: 7,
        },
        range: {
          end: {
            character: 30,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation should fail if whole name and namespaces are escaped', () => {
    const query = "RETURN `apoc.text.capitalize`('Marvin');";

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([
      {
        message:
          "Function `apoc.text.capitalize` is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 29,
          start: 7,
        },
        range: {
          end: {
            character: 29,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Does not fail semantic validation for functions that expect LIST<ANY>', () => {
    expect(
      getDiagnosticsForQuery({
        query: `RETURN apoc.coll.max(['a'])`,
        dbSchema: testData.mockSchema,
      }),
    ).toEqual([]);
  });

  test('Provides semantic validation for functions that expect LIST<NUMBER>', () => {
    expect(
      getDiagnosticsForQuery({
        query: `RETURN apoc.coll.sum(['a', 'b'])`,
        dbSchema: testData.mockSchema,
      }),
    ).toEqual([
      {
        message:
          'Type mismatch: expected List<Float>, List<Integer> or List<Number> but was List<String>',
        offsets: {
          end: 31,
          start: 21,
        },
        range: {
          end: {
            character: 31,
            line: 0,
          },
          start: {
            character: 21,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Does not provide semantic validation for pluggeable functions when schema is not available', () => {
    expect(
      getDiagnosticsForQuery({
        query: `RETURN apoc.coll.sum(['a', 'b'])`,
        dbSchema: {},
      }),
    ).toEqual([]);
  });

  test('Provides semantic validation for built-in functions', () => {
    expect(
      getDiagnosticsForQuery({
        query: `WITH character_length() AS a
        WITH character_length(1) AS b, a
        RETURN a,b`,
      }),
    ).toEqual([
      {
        message: "Insufficient parameters for function 'character_length'",
        offsets: {
          end: 28,
          start: 5,
        },
        range: {
          end: {
            character: 28,
            line: 0,
          },
          start: {
            character: 5,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: 'Type mismatch: expected String but was Integer',
        offsets: {
          end: 60,
          start: 59,
        },
        range: {
          end: {
            character: 31,
            line: 1,
          },
          start: {
            character: 30,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Deprecations and removals for functions are based on the cypher version', () => {
    const dbSchema = {
      functions: {
        'cypher 5': {
          'apoc.create.uuid': {
            name: 'apoc.create.uuid',
            category: '',
            description: 'Returns a UUID.',
            signature: 'apoc.create.uuid(config :: MAP) :: STRING',
            isBuiltIn: false,
            argumentDescription: [
              {
                isDeprecated: true,
                description: '',
                name: 'config',
                type: 'MAP',
              },
            ],
            returnDescription: 'STRING',
            aggregating: false,
            isDeprecated: false,
            deprecatedBy: 'Neo4j randomUUID() function',
          },
        },
        'cypher 25': {
          'apoc.create.uuid': {
            name: 'apoc.create.uuid',
            category: '',
            description: 'Returns a UUID.',
            signature: 'apoc.create.uuid() :: STRING',
            isBuiltIn: false,
            argumentDescription: [],
            returnDescription: 'STRING',
            aggregating: false,
            isDeprecated: false,
            deprecatedBy: 'Neo4j randomUUID() function',
          },
        },
      },
    };

    expect(
      getDiagnosticsForQuery({
        query: 'CYPHER 5 RETURN apoc.create.uuid()',
        dbSchema: dbSchema,
      }),
    ).toEqual([
      {
        message: `Function call does not provide the required number of arguments: expected 1 got 0.

Function apoc.create.uuid has signature: apoc.create.uuid(config :: MAP) :: STRING
meaning that it expects 1 argument of type MAP`,
        offsets: {
          end: 34,
          start: 16,
        },
        range: {
          end: {
            character: 34,
            line: 0,
          },
          start: {
            character: 16,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          "The function has a deprecated field. ('config' used by 'apoc.create.uuid' is deprecated.)",
        offsets: {
          end: 34,
          start: 16,
        },
        range: {
          end: {
            character: 34,
            line: 0,
          },
          start: {
            character: 16,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);

    expect(
      getDiagnosticsForQuery({
        query: 'CYPHER 25 RETURN apoc.create.uuid()',
        dbSchema: dbSchema,
      }),
    ).toEqual([]);
  });

  test('Errors and notifications for functions are different based on the cypher version', () => {
    expect(
      getDiagnosticsForQuery({
        query: `
          CYPHER 5 call apoc.cypher.runTimeboxed("match (n:Node), (m:Node)
          WHERE n <> m
          match path = shortestpath((n)-[:CONNECTED_TO*]-(m))
          RETURN n, m, length(path) AS path", {}, 100, {})
          YIELD value
          RETURN value.n.uuid, value.m.uuid, value.path;`,
        dbSchema: testData.mockSchema,
      }),
    ).toEqual([
      {
        message: `Procedure call provides too many arguments: got 4 expected no more than 3.

Procedure apoc.cypher.runTimeboxed has signature: apoc.cypher.runTimeboxed(statement :: STRING, params :: MAP, timeout :: INTEGER) :: value :: MAP
meaning that it expects at least 3 arguments of types STRING, MAP, INTEGER
`,
        offsets: {
          end: 297,
          start: 20,
        },
        range: {
          end: {
            character: 74,
            line: 6,
          },
          start: {
            character: 19,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);

    expect(
      getDiagnosticsForQuery({
        query: `
          CYPHER 25 call apoc.cypher.runTimeboxed("match (n:Node), (m:Node)
          WHERE n <> m
          match path = shortestpath((n)-[:CONNECTED_TO*]-(m))
          RETURN n, m, length(path) AS path", {}, 100, {})
          YIELD value
          RETURN value.n.uuid, value.m.uuid, value.path;`,
        dbSchema: testData.mockSchema,
      }),
    ).toEqual([]);
  });

  test('Warnings for procedures misused as functions are different depending on cypher the version', () => {
    // Procedure misused as function, but deprecated in Cypher5, so removed in Cypher25
    expect(
      getDiagnosticsForQuery({
        query: 'CYPHER 5 RETURN apoc.create.uuids(5)',
        dbSchema: testData.mockSchema,
      }),
    ).toEqual([
      {
        message:
          'apoc.create.uuids is a procedure, not a function. Did you mean to call the procedure apoc.create.uuids inside a CALL clause?',
        offsets: {
          end: 33,
          start: 16,
        },
        range: {
          end: {
            character: 33,
            line: 0,
          },
          start: {
            character: 16,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);

    expect(
      getDiagnosticsForQuery({
        query: 'CYPHER 25 RETURN apoc.create.uuids(5)',
        dbSchema: testData.mockSchema,
      }),
    ).toEqual([
      {
        message:
          "Function apoc.create.uuids is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 34,
          start: 17,
        },
        range: {
          end: {
            character: 34,
            line: 0,
          },
          start: {
            character: 17,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });
});
