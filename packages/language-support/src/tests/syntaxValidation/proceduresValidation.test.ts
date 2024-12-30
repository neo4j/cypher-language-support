import { DiagnosticTag } from 'vscode-languageserver-types';
import { testData } from '../testData';
import { getDiagnosticsForQuery } from './helpers';

describe('Procedures semantic validation spec', () => {
  test('Syntax validation warns on deprecated procedure when database can be contacted', () => {
    const query = `CALL db.create.setVectorProperty()`;
    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual(
      expect.arrayContaining([
        {
          tags: [DiagnosticTag.Deprecated],
          offsets: {
            end: 32,
            start: 5,
          },
          message:
            'Procedure db.create.setVectorProperty is deprecated. Use db.create.setNodeVectorProperty instead.',
          range: {
            end: {
              character: 32,
              line: 0,
            },
            start: {
              character: 5,
              line: 0,
            },
          },
          severity: 2,
        },
      ]),
    );
  });

  test('Syntax validation warns on missing procedures when database can be contacted', () => {
    const query = `CALL dontpanic("marvin")`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([
      {
        offsets: {
          end: 14,
          start: 5,
        },
        message:
          "Procedure dontpanic is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        range: {
          end: {
            character: 14,
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

  test('Syntax validation does not error on existing procedure when database can be contacted', () => {
    const query = `CALL mockProcedure()`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: {
            mockProcedure: {
              name: 'mockProcedure',
              description:
                'Returns the current change identifier that can be used to stream changes from.',
              mode: 'READ',
              worksOnSystem: false,
              argumentDescription: [],
              signature: 'mockProcedure() :: (id :: STRING)',
              returnDescription: [
                {
                  isDeprecated: false,
                  description: 'id :: STRING',
                  name: 'id',
                  type: 'STRING',
                },
              ],
              admin: false,
              option: {
                deprecated: false,
              },
            },
          },
        },
      }),
    ).toEqual([]);
  });

  test('Syntax validation errors on missing procedure with namespace when database can be contacted', () => {
    const query = `CALL test.dontpanic("marvin")`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([
      {
        offsets: {
          end: 19,
          start: 5,
        },
        message:
          "Procedure test.dontpanic is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        range: {
          end: {
            character: 19,
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

  test('Syntax validation does not error on existing procedure with namespace when database can be contacted', () => {
    const query = `CALL db.cdc.current()`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([]);
  });

  test('Syntax validation errors on missing procedure with namespace split in multiple lines when database can be contacted', () => {
    const query = `CALL test.
    dontpanic
    ("marvin")
    `;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([
      {
        offsets: {
          end: 24,
          start: 5,
        },
        message:
          "Procedure test.dontpanic is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        range: {
          end: {
            character: 13,
            line: 1,
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

  test('Syntax validation does not error on existing procedure with namespace split in multiple lines when database can be contacted', () => {
    const query = `
    CALL db
      .cdc
      .current
      ()
    `;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([]);
  });

  test('Syntax validation is not case insensitive on built-in procedures', () => {
    const query = `
    CALL db.cdc.currenT()
    `;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([
      {
        message:
          "Procedure db.cdc.currenT is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 24,
          start: 10,
        },
        range: {
          end: {
            character: 23,
            line: 1,
          },
          start: {
            character: 9,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation is not case insensitive on user defined procedures', () => {
    const query = `
    CALL apoc.coll.ZIPTOROWS([0,0,0], [1,1,1])
    `;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([
      {
        message:
          "Procedure apoc.coll.ZIPTOROWS is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 29,
          start: 10,
        },
        range: {
          end: {
            character: 28,
            line: 1,
          },
          start: {
            character: 9,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation does not error on existing procedure with spaces when database can be contacted', () => {
    const query = `CALL apoc   .      coll      .      zipToRows      ([0,0,0], [1,1,1])`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([]);
  });

  test('Syntax validation errors with correct positions with spaces when database can be contacted', () => {
    const query = `CALL apoc.   text.  dontpanic   ("Marvin")`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([
      {
        message:
          "Procedure apoc.text.dontpanic is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 29,
          start: 5,
        },
        range: {
          end: {
            character: 29,
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

  test('Syntax validation does not error on existing procedure with new lines when database can be contacted', () => {
    const query = `CALL db
      .cdc
      .current
      ()`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([]);
  });

  test('Syntax validation errors with correct positions with spaces when database can be contacted', () => {
    const query = `CALL apoc.   text. 
     dontpanic  
     ("Marvin")`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([
      {
        message:
          "Procedure apoc.text.dontpanic is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 34,
          start: 5,
        },
        range: {
          end: {
            character: 14,
            line: 1,
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

  test('Syntax validation should recognize escaped procedure names', () => {
    const query = `
    CALL \`mockProcedure\`()
    `;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: {
            mockProcedure: {
              name: 'mockProcedure',
              description:
                'Returns the current change identifier that can be used to stream changes from.',
              mode: 'READ',
              worksOnSystem: false,
              argumentDescription: [],
              signature: 'mockProcedure() :: (id :: STRING)',
              returnDescription: [
                {
                  isDeprecated: false,
                  description: 'id :: STRING',
                  name: 'id',
                  type: 'STRING',
                },
              ],
              admin: false,
              option: {
                deprecated: false,
              },
            },
          },
        },
      }),
    ).toEqual([]);
  });

  test('Syntax validation should fail on escaped procedure names that do not exist', () => {
    const query = `
    CALL \`doesNotExist\`()
    `;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: {
            mockProcedure: {
              name: 'mockProcedure',
              description:
                'Returns the current change identifier that can be used to stream changes from.',
              mode: 'READ',
              worksOnSystem: false,
              argumentDescription: [],
              signature: 'mockProcedure() :: (id :: STRING)',
              returnDescription: [
                {
                  isDeprecated: false,
                  description: 'id :: STRING',
                  name: 'id',
                  type: 'STRING',
                },
              ],
              admin: false,
              option: {
                deprecated: false,
              },
            },
          },
        },
      }),
    ).toEqual([
      {
        message:
          "Procedure doesNotExist is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 24,
          start: 10,
        },
        range: {
          end: {
            character: 23,
            line: 1,
          },
          start: {
            character: 9,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation should pass on escaped procedure names with namespaces', () => {
    const query = 'CALL `db`.cdc.`current`();';

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([]);
  });

  test('Syntax validation should fail on escaped procedure names with namespaces that do not exist', () => {
    const query = 'CALL `doesNotExist`.cdc.`current`();';

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([
      {
        message:
          "Procedure doesNotExist.cdc.current is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 33,
          start: 5,
        },
        range: {
          end: {
            character: 33,
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

  test('Syntax validation should fail if whole name and namespaces are escaped', () => {
    const query = 'CALL `db.cdc.current`();';

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
        },
      }),
    ).toEqual([
      {
        message:
          "Procedure `db.cdc.current` is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 21,
          start: 5,
        },
        range: {
          end: {
            character: 21,
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

  test('Errors should be treated independently per query', () => {
    const query = `CALL db.awaitIndeX();
      RETURN aBs(4, 4);
    `;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          labels: ['Dog', 'Cat'],
          relationshipTypes: ['Person'],
          procedures: testData.mockSchema.procedures,
          functions: testData.mockSchema.functions,
        },
      }),
    ).toEqual([
      {
        message:
          "Procedure db.awaitIndeX is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 18,
          start: 5,
        },
        range: {
          end: {
            character: 18,
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
        message: "Too many parameters for function 'abs'",
        offsets: {
          end: 44,
          start: 35,
        },
        range: {
          end: {
            character: 22,
            line: 1,
          },
          start: {
            character: 13,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Provides semantic validation for procedures when a schema is available', () => {
    expect(
      getDiagnosticsForQuery({
        query: `
        CALL db.awaitIndex('index', 'time')
        CALL db.awaitIndex()
        `,
        dbSchema: testData.mockSchema,
      }),
    ).toEqual([
      {
        message: 'Type mismatch: expected Integer but was String',
        offsets: {
          end: 43,
          start: 37,
        },
        range: {
          end: {
            character: 42,
            line: 1,
          },
          start: {
            character: 36,
            line: 1,
          },
        },
        severity: 1,
      },
      {
        message: `Procedure call does not provide the required number of arguments: got 0 expected at least 1 (total: 2, 1 of which have default values).

Procedure db.awaitIndex has signature: db.awaitIndex(indexName :: STRING, timeOutSeconds  =  300 :: INTEGER) :: 
meaning that it expects at least 1 argument of type STRING
`,
        offsets: {
          end: 73,
          start: 53,
        },
        range: {
          end: {
            character: 28,
            line: 2,
          },
          start: {
            character: 8,
            line: 2,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows default values correctly for external procedures', () => {
    expect(
      getDiagnosticsForQuery({
        query: 'CALL apoc.load.xml()',
        dbSchema: testData.mockSchema,
      }),
    ).toEqual([
      {
        message: `Procedure call does not provide the required number of arguments: got 0 expected at least 1 (total: 4, 3 of which have default values).

Procedure apoc.load.xml has signature: apoc.load.xml(urlOrBinary :: ANY, path  =  / :: STRING, config  =  {} :: MAP, simple  =  false :: BOOLEAN) :: value :: MAP
meaning that it expects at least 1 argument of type ANY
`,
        offsets: {
          end: 20,
          start: 0,
        },
        range: {
          end: {
            character: 20,
            line: 0,
          },
          start: {
            character: 0,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Does not fail if default arguments for procedure not provided', () => {
    expect(
      getDiagnosticsForQuery({
        query: `CALL apoc.load.xml('url', '/path')`,
        dbSchema: testData.mockSchema,
      }),
    ).toEqual([]);
  });

  // TODO This doesn't seem to warn on deprecated
  // arguments for either functions or procedures,
  // needs to be solved in the database first
  test('Notifies of deprecated returns in procedures', () => {
    expect(
      getDiagnosticsForQuery({
        query: `CALL apoc.meta.graphSample({})`,
        dbSchema: {
          functions: {},
          procedures: {
            'apoc.meta.graphSample': {
              name: 'apoc.meta.graphSample',
              description:
                'Examines the full graph and returns a meta-graph.\nUnlike `apoc.meta.graph`, this procedure does not filter away non-existing paths.',
              mode: 'DEFAULT',
              worksOnSystem: false,
              argumentDescription: [
                {
                  isDeprecated: false,
                  default: 'DefaultParameterValue{value={}, type=MAP}',
                  description: 'config = {} :: MAP',
                  name: 'config',
                  type: 'MAP',
                },
              ],

              signature:
                'apoc.meta.graphSample(config = {} :: MAP) :: (nodes :: LIST<NODE>, relationships :: LIST<RELATIONSHIP>)',
              returnDescription: [
                {
                  isDeprecated: true,
                  description: 'nodes :: LIST<NODE>',
                  name: 'nodes',
                  type: 'LIST<NODE>',
                },
                {
                  isDeprecated: false,
                  description: 'relationships :: LIST<RELATIONSHIP>',
                  name: 'relationships',
                  type: 'LIST<RELATIONSHIP>',
                },
              ],

              admin: false,
              option: {
                deprecated: false,
              },
            },
          },
        },
      }),
    ).toEqual([
      {
        message:
          "The query used a deprecated field from a procedure. ('nodes' returned by 'apoc.meta.graphSample' is deprecated.)",
        offsets: {
          end: 30,
          start: 0,
        },
        range: {
          end: {
            character: 30,
            line: 0,
          },
          start: {
            character: 0,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });
});
