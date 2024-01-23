import {
  ParameterInformation,
  SignatureHelp,
  SignatureInformation,
} from 'vscode-languageserver-types';
import { DbSchema } from '../dbSchema';
import { emptyResult, signatureHelp } from '../signatureHelp';
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
  const signature = SignatureInformation.create(
    procedureName,
    dbSchema.procedureSignatures[procedureName].documentation,
    ...dbSchema.procedureSignatures[procedureName].parameters.map((param) =>
      ParameterInformation.create(param.label, param.documentation),
    ),
  );

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

  test('Does not provide blow up for caret position of 0', () => {
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
});

describe('Functions signature help', () => {
  const dbSchema = testData.mockSchema;
  const functionName = 'apoc.coll.combinations';
  const signature = SignatureInformation.create(
    functionName,
    dbSchema.functionSignatures[functionName].documentation,
    ...dbSchema.functionSignatures[functionName].parameters.map((param) =>
      ParameterInformation.create(param.label, param.documentation),
    ),
  );

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
      'MATCH (n) WHERE apoc.coll.combinations(coll,',
      dbSchema,
      expectedArgIndex(1),
    );

    testSignatureHelp(
      'MATCH (n) WHERE apoc.coll.combinations(coll, "foo"',
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
         MATCH (m) WHERE apoc.coll.combinations(c`,
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

  test('Does not provide blow up for caret position of 0', () => {
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
});
