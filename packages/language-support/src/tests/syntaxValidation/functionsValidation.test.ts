import { DiagnosticTag } from 'vscode-languageserver-types';
import { testData } from '../testData';
import { getDiagnosticsForQuery } from './helpers';

describe('Functions semantic validation spec', () => {
  test('Syntax validation warns on deprecated function when database can be contacted', () => {
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
});
