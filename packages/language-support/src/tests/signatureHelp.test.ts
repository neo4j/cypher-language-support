import { SignatureHelp } from 'vscode-languageserver-types';
import { DbSchema } from '../dbSchema';
import {
  emptyResult,
  signatureHelp,
  toSignatureInformation,
} from '../signatureHelp';
import { testData } from './testData';

export function testSignatureHelp(
  fileText: string,
  dbSchema: DbSchema,
  expected: SignatureHelp,
  offset: number = fileText.length,
) {
  const actualSignatureHelp = signatureHelp(fileText, dbSchema, offset);

  expect(actualSignatureHelp.activeParameter).toBe(expected.activeParameter);
  expect(actualSignatureHelp.activeSignature).toBe(expected.activeSignature);
  expect(actualSignatureHelp.signatures).toStrictEqual(expected.signatures);
}

describe('Procedures signature help', () => {
  const dbSchema = testData.mockSchema;
  const procedureName = 'apoc.do.when';
  const procedure = dbSchema.procedures['cypher 5'][procedureName];
  const signature = toSignatureInformation(procedure);

  function expectedArgIndex(i: number): SignatureHelp {
    return {
      signatures: [signature],
      activeSignature: 0,
      activeParameter: i,
    };
  }

  test('Provides signature help for subquery CALLs', () => {
    testSignatureHelp(
      `MATCH (n)
         CALL apoc.do.when(`,
      dbSchema,
      expectedArgIndex(0),
    );

    testSignatureHelp(
      `MATCH (n)
         CALL apoc.do.when(true`,
      dbSchema,
      expectedArgIndex(0),
    );
  });

  test('Provides signature help for CALLs first argument', () => {
    testSignatureHelp('CALL apoc.do.when(', dbSchema, expectedArgIndex(0));

    testSignatureHelp('CALL apoc.do.when(true', dbSchema, expectedArgIndex(0));
  });

  test('Provides signature help for CALLs second argument', () => {
    testSignatureHelp('CALL apoc.do.when(true,', dbSchema, expectedArgIndex(1));

    testSignatureHelp(
      'CALL apoc.do.when(true, "foo"',
      dbSchema,
      expectedArgIndex(1),
    );
  });

  test('Provides signature help for CALLs third argument', () => {
    testSignatureHelp(
      'CALL apoc.do.when(true, "foo",',
      dbSchema,
      expectedArgIndex(2),
    );

    testSignatureHelp(
      'CALL apoc.do.when(true, "foo", false',
      dbSchema,
      expectedArgIndex(2),
    );
  });

  test('Provides signature help for CALLs fourth argument', () => {
    testSignatureHelp(
      'CALL apoc.do.when(true, "foo", false,',
      dbSchema,
      expectedArgIndex(3),
    );

    testSignatureHelp(
      'CALL apoc.do.when(true, "foo", false, "bar"',
      dbSchema,
      expectedArgIndex(3),
    );
  });

  test('Provides signature help with several statements where cursor one requires autocompletion', () => {
    testSignatureHelp(
      `MATCH (n) RETURN n;
         CALL apoc.do.when(`,
      dbSchema,
      expectedArgIndex(0),
    );
  });

  test('Does not provide signature help with several statements where cursor one does not require autocompletion', () => {
    testSignatureHelp(
      `CALL apoc.do.when(true, "foo", false, "bar");
   
         MATCH (`,
      dbSchema,
      emptyResult,
    );
  });

  test('Does not blow up for caret position of 0', () => {
    testSignatureHelp('', dbSchema, emptyResult);
  });

  test('Provides signature help for CALLs when offset is before end of query for first argument', () => {
    testSignatureHelp(
      'CALL apoc.do.when(true, something',
      dbSchema,
      expectedArgIndex(0),
      18,
    );

    testSignatureHelp(
      'CALL apoc.do.when(true, something',
      dbSchema,
      expectedArgIndex(0),
      20,
    );

    testSignatureHelp(
      'CALL apoc.do.when(true, something',
      dbSchema,
      expectedArgIndex(0),
      22,
    );
  });

  test('Provides signature help for CALLs when offset is before end of query for second argument', () => {
    testSignatureHelp(
      'CALL apoc.do.when(true, foo, bar',
      dbSchema,
      expectedArgIndex(1),
      23,
    );

    testSignatureHelp(
      'CALL apoc.do.when(true, foo, bar',
      dbSchema,
      expectedArgIndex(1),
      25,
    );

    testSignatureHelp(
      'CALL apoc.do.when(true, foo, bar',
      dbSchema,
      expectedArgIndex(1),
      27,
    );
  });

  test('Provides signature help for CALLs even on several spaces', () => {
    testSignatureHelp(
      'CALL apoc.do.when(true,   )',
      dbSchema,
      expectedArgIndex(1),
      25,
    );
  });

  test('Provides signature help for CALLs even on several spaces', () => {
    testSignatureHelp(
      'CALL apoc.do.when(true,   )',
      dbSchema,
      expectedArgIndex(1),
      25,
    );
  });

  test('Provides signature help for CALLs when argument far apart from parenthesis', () => {
    testSignatureHelp('CALL apoc.do.when     (', dbSchema, expectedArgIndex(0));
  });

  test('Provides signature help for CALLs when name and parenthesis contain spaces', () => {
    testSignatureHelp(
      'CALL apoc       .  do     .  when   (arg  ,    ',
      dbSchema,
      expectedArgIndex(1),
    );
  });

  test('Does not provide signature help for functions when parenthesis not opened', () => {
    testSignatureHelp(`CALL apoc.do.when`, dbSchema, emptyResult);
  });

  test('Provides signature help for the right CALL when there are several procedures in the same statement', () => {
    testSignatureHelp(
      `CALL apoc.do.when(true, if, else, {})
       CALL apoc.do.case([], else, {})`,
      dbSchema,
      expectedArgIndex(1),
      26,
    );

    testSignatureHelp(
      `CALL apoc.do.case([], else, {})
       CALL apoc.do.when(true, if, else, {})`,
      dbSchema,
      expectedArgIndex(1),
      63,
    );
  });

  test('Does not crash on missing schema', () => {
    testSignatureHelp(`CALL apoc.do.when`, undefined, emptyResult);
    testSignatureHelp(`CALL apoc.do.when`, {}, emptyResult);
  });

  test('Provides signature help for procedures when another argument is a function', () => {
    testSignatureHelp(
      'CALL apoc.do.when(apoc.coll.combinations(coll, something), ',
      dbSchema,
      expectedArgIndex(1),
    );
  });

  test('Signature help depends on cypher version', () => {
    const dbSchema = {
      functions: {},
      procedures: {
        'cypher 5': {
          [procedureName]: procedure,
        },
        'cypher 25': {},
      },
    };

    testSignatureHelp(
      'CYPHER 5 CALL apoc.do.when(',
      dbSchema,
      expectedArgIndex(0),
    );

    testSignatureHelp('CYPHER 25 CALL apoc.do.when(', dbSchema, {
      activeParameter: 0,
      activeSignature: undefined,
      signatures: [],
    });
  });
});

describe('Functions signature help', () => {
  const dbSchema = testData.mockSchema;
  const functionName = 'apoc.coll.combinations';
  const fn = dbSchema.functions['cypher 5'][functionName];
  const signature = toSignatureInformation(fn);

  function expectedArgIndex(i: number): SignatureHelp {
    return {
      signatures: [signature],
      activeSignature: 0,
      activeParameter: i,
    };
  }

  test('Provides signature help for functions first argument when argument non started', () => {
    testSignatureHelp(
      `MATCH (n)
         RETURN apoc.coll.combinations(`,
      dbSchema,
      expectedArgIndex(0),
    );
  });

  test('Provides signature help for functions first argument when argument started', () => {
    testSignatureHelp(
      `MATCH (n)
         RETURN apoc.coll.combinations(coll`,
      dbSchema,
      expectedArgIndex(0),
    );
  });

  test('Provides signature help for functions second argument', () => {
    testSignatureHelp(
      'RETURN apoc.coll.combinations(coll,',
      dbSchema,
      expectedArgIndex(1),
    );

    testSignatureHelp(
      'RETURN apoc.coll.combinations(coll, "foo"',
      dbSchema,
      expectedArgIndex(1),
    );
  });

  test('Provides signature help for functions third argument', () => {
    testSignatureHelp(
      'RETURN true OR apoc.coll.combinations(coll, "foo",',
      dbSchema,
      expectedArgIndex(2),
    );

    testSignatureHelp(
      'RETURN true OR apoc.coll.combinations(coll, "foo", false',
      dbSchema,
      expectedArgIndex(2),
    );
  });

  test('Provides signature help with several statements where cursor one requires autocompletion', () => {
    testSignatureHelp(
      `MATCH (n) RETURN n;
      RETURN apoc.coll.combinations(c`,
      dbSchema,
      expectedArgIndex(0),
    );
  });

  test('Does not provide signature help with several statements where cursor one does not require autocompletion', () => {
    testSignatureHelp(
      `RETURN apoc.coll.combinations(coll, minSelect, maxSelect);
   
         MATCH (`,
      dbSchema,
      emptyResult,
    );
  });

  test('Does not blow up for caret position of 0', () => {
    testSignatureHelp('', dbSchema, emptyResult);
  });

  test('Provides signature help for functions when offset is before end of query for first argument', () => {
    testSignatureHelp(
      'MATCH (n) WHERE apoc.coll.combinations(coll, "foo"',
      dbSchema,
      expectedArgIndex(0),
      39,
    );

    testSignatureHelp(
      'MATCH (n) WHERE apoc.coll.combinations(coll, "foo"',
      dbSchema,
      expectedArgIndex(0),
      41,
    );

    testSignatureHelp(
      'MATCH (n) WHERE apoc.coll.combinations(coll, "foo"',
      dbSchema,
      expectedArgIndex(0),
      43,
    );
  });

  test('Provides signature help for functions when offset is before end of query for second argument', () => {
    testSignatureHelp(
      'MATCH (n) WHERE apoc.coll.combinations(coll, "foo", bar',
      dbSchema,
      expectedArgIndex(1),
      45,
    );

    testSignatureHelp(
      'MATCH (n) WHERE apoc.coll.combinations(coll, "foo", bar',
      dbSchema,
      expectedArgIndex(1),
      50,
    );
  });

  test('Provides signature help for functions when argument far apart from parenthesis', () => {
    testSignatureHelp(
      `MATCH (n)
         RETURN apoc.coll.combinations   (`,
      dbSchema,
      expectedArgIndex(0),
    );
  });

  test('Provides signature help for functions when name and parenthesis contain spaces', () => {
    testSignatureHelp(
      'RETURN apoc       .  coll     .  combinations   (arg  ,    ',
      dbSchema,
      expectedArgIndex(1),
    );
  });

  test('Does not provide signature help for functions when parenthesis not opened', () => {
    testSignatureHelp(
      `MATCH (n)
         RETURN apoc.coll.combinations`,
      dbSchema,
      emptyResult,
    );
  });

  test('Provides signature help for the right function when there are several functions in the same statement', () => {
    testSignatureHelp(
      `RETURN apoc.coll.combinations(coll, minSelect, maxSelect), 
              apoc.coll.contains(coll, value)`,
      dbSchema,
      expectedArgIndex(1),
      37,
    );

    testSignatureHelp(
      `RETURN apoc.coll.contains(coll, value), 
              apoc.coll.combinations(coll, minSelect, maxSelect)`,
      dbSchema,
      expectedArgIndex(1),
      89,
    );
  });

  test('Does not crash on missing schema', () => {
    testSignatureHelp(`CALL apoc.do.when`, undefined, emptyResult);
    testSignatureHelp(`CALL apoc.do.when`, {}, emptyResult);
  });

  test('Provides signature help for functions inside procedures, first argument', () => {
    testSignatureHelp(
      'CALL apoc.do.when(apoc.coll.combinations(',
      dbSchema,
      expectedArgIndex(0),
    );
  });

  test('Provides signature help for functions inside procedures, second argument', () => {
    testSignatureHelp(
      'CALL apoc.do.when(apoc.coll.combinations(coll,',
      dbSchema,
      expectedArgIndex(1),
    );
  });

  test('Signature help depends on cypher version', () => {
    const dbSchema = {
      procedures: {},
      functions: {
        'cypher 5': {
          [functionName]: fn,
        },
        'cypher 25': {},
      },
    };

    testSignatureHelp(
      'CYPHER 5 RETURN apoc.coll.combinations(',
      dbSchema,
      expectedArgIndex(0),
    );

    testSignatureHelp('CYPHER 25 RETURN apoc.coll.combinations(', dbSchema, {
      activeParameter: 0,
      activeSignature: undefined,
      signatures: [],
    });
  });
});
