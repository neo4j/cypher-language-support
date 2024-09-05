import { testData } from '../testData';
import { getDiagnosticsForQuery } from './helpers';

describe('Procedures syntactic validation spec', () => {
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
        severity: 2,
      },
    ]);
  });

  test('Syntax validation does not warn on existing procedure when database can be contacted', () => {
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

  test('Syntax validation warns on missing procedure with namespace when database can be contacted', () => {
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
        severity: 2,
      },
    ]);
  });

  test('Syntax validation does not warn on existing procedure with namespace when database can be contacted', () => {
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

  test('Syntax validation warns on missing procedure with namespace split in multiple lines when database can be contacted', () => {
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
        severity: 2,
      },
    ]);
  });

  test('Syntax validation does not warn on existing procedure with namespace split in multiple lines when database can be contacted', () => {
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
        severity: 2,
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
        severity: 2,
      },
    ]);
  });

  test('Syntax validation does not warn on existing procedure with spaces when database can be contacted', () => {
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

  test('Syntax validation warns with correct positions with spaces when database can be contacted', () => {
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
        severity: 2,
      },
    ]);
  });

  test('Syntax validation does not warn on existing procedure with new lines when database can be contacted', () => {
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

  test('Syntax validation warns with correct positions with spaces when database can be contacted', () => {
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
        severity: 2,
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
        severity: 2,
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
        severity: 2,
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
        severity: 2,
      },
    ]);
  });

  // Fix this, it should be treating errors in each query independently
  test.skip('Warnings and errors should be treated independently per query', () => {
    const query = `CALL db.awaitIndeX;
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
      }).length,
    ).toEqual(2);
  });
});
