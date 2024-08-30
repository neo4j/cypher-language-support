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
              name: 'db.cdc.current',
              description:
                'Returns the current change identifier that can be used to stream changes from.',
              mode: 'READ',
              worksOnSystem: false,
              argumentDescription: [],
              signature: 'db.cdc.current() :: (id :: STRING)',
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

  test.skip('Syntax validation does not warn on existing function with spaces when database can be contacted', () => {
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

  test.skip('Syntax validation warns with correct positions with spaces when database can be contacted', () => {
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
        severity: 2,
      },
    ]);
  });

  test.skip('Syntax validation does not warn on existing function with new lines when database can be contacted', () => {
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

  test.skip('Syntax validation warns with correct positions with spaces when database can be contacted', () => {
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
        severity: 2,
      },
    ]);
  });

  test.skip('Syntax validation should recognize escaped function names', () => {
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

  test.skip('Syntax validation should fail on escaped function names that do not exist', () => {
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
        severity: 2,
      },
    ]);
  });

  test.skip('Syntax validation should pass on escaped function names with namespaces', () => {
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

  test.skip('Syntax validation should fail on escaped function names with namespaces that do not exist', () => {
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
        severity: 2,
      },
    ]);
  });

  test.skip('Syntax validation should fail if whole name and namespaces are escaped', () => {
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
          functions: testData.mockSchema.functions,
          procedures: testData.mockSchema.procedures,
        },
      }).length,
    ).toEqual(2);
  });
});
