import {
  ParameterInformation,
  SignatureHelp,
  SignatureInformation,
} from 'vscode-languageserver/node';
import { DbInfo } from '../dbInfo';
import { doSignatureHelpText, emptyResult } from '../signatureHelp';
import { MockDbInfo } from './testHelpers';

export function testSignatureHelp(
  fileText: string,
  dbInfo: DbInfo,
  expected: SignatureHelp,
) {
  const actualSignatureHelp = doSignatureHelpText(fileText, dbInfo);

  expect(actualSignatureHelp.activeParameter).toBe(expected.activeParameter);
  expect(actualSignatureHelp.activeSignature).toBe(expected.activeSignature);
  expect(actualSignatureHelp.signatures).toStrictEqual(expected.signatures);
}

describe('Procedures signature help', () => {
  const signature = SignatureInformation.create(
    'apoc.do.when',
    'Runs the given read/write ifQuery if the conditional has evaluated to true, otherwise the elseQuery will run.',
    ...[
      ParameterInformation.create('condition', 'condition :: BOOLEAN?'),
      ParameterInformation.create('ifQuery', 'ifQuery :: STRING?'),
      ParameterInformation.create('elseQuery', 'condition :: STRING?'),
      ParameterInformation.create('params', 'params = {} :: MAP?'),
    ],
  );
  const dbWithProcedure = new MockDbInfo(
    [],
    [],
    new Map([['apoc.do.when', signature]]),
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
      dbWithProcedure,
      expectedArgIndex(0),
    );

    testSignatureHelp(
      `MATCH (n)
       CALL apoc.do.when(true`,
      dbWithProcedure,
      expectedArgIndex(0),
    );
  });

  test('Provides signature help for CALLs first argument', () => {
    testSignatureHelp(
      'CALL apoc.do.when(',
      dbWithProcedure,
      expectedArgIndex(0),
    );

    testSignatureHelp(
      'CALL apoc.do.when(true',
      dbWithProcedure,
      expectedArgIndex(0),
    );
  });

  test('Provides signature help for CALLs second argument', () => {
    testSignatureHelp(
      'CALL apoc.do.when(true,',
      dbWithProcedure,
      expectedArgIndex(1),
    );

    testSignatureHelp(
      'CALL apoc.do.when(true, "foo"',
      dbWithProcedure,
      expectedArgIndex(1),
    );
  });

  test('Provides signature help for CALLs third argument', () => {
    testSignatureHelp(
      'CALL apoc.do.when(true, "foo",',
      dbWithProcedure,
      expectedArgIndex(2),
    );

    testSignatureHelp(
      'CALL apoc.do.when(true, "foo", false',
      dbWithProcedure,
      expectedArgIndex(2),
    );
  });

  test('Provides signature help for CALLs fourth argument', () => {
    testSignatureHelp(
      'CALL apoc.do.when(true, "foo", false,',
      dbWithProcedure,
      expectedArgIndex(3),
    );

    testSignatureHelp(
      'CALL apoc.do.when(true, "foo", false, "bar"',
      dbWithProcedure,
      expectedArgIndex(3),
    );
  });

  test('Provides signature help with several statements where cursor one requires autocompletion', () => {
    testSignatureHelp(
      `MATCH (n) RETURN n;
       CALL apoc.do.when(`,
      dbWithProcedure,
      expectedArgIndex(0),
    );
  });

  test('Does not provide signature help with several statements where cursor one does not require autocompletion', () => {
    testSignatureHelp(
      `CALL apoc.do.when(true, "foo", false, "bar");
 
       MATCH (`,
      dbWithProcedure,
      emptyResult,
    );
  });
});

describe('Functions signature help', () => {
  const signature = SignatureInformation.create(
    'apoc.do.when',
    'Runs the given read/write ifQuery if the conditional has evaluated to true, otherwise the elseQuery will run.',
    ...[
      ParameterInformation.create('condition', 'condition :: BOOLEAN?'),
      ParameterInformation.create('ifQuery', 'ifQuery :: STRING?'),
      ParameterInformation.create('elseQuery', 'condition :: STRING?'),
    ],
  );
  const dbWithFunction = new MockDbInfo(
    [],
    [],
    new Map(),
    new Map([['apoc.do.when', signature]]),
  );

  function expectedArgIndex(i: number): SignatureHelp {
    return {
      signatures: [signature],
      activeSignature: 0,
      activeParameter: i,
    };
  }

  test('Provides signature help for functions first argument', () => {
    testSignatureHelp(
      `MATCH (n)
       RETURN apoc.do.when(`,
      dbWithFunction,
      expectedArgIndex(0),
    );

    testSignatureHelp(
      `MATCH (n)
       RETURN apoc.do.when(true`,
      dbWithFunction,
      expectedArgIndex(0),
    );
  });

  test('Provides signature help for functions second argument', () => {
    testSignatureHelp(
      'MATCH (n) WHERE apoc.do.when(true,',
      dbWithFunction,
      expectedArgIndex(1),
    );

    testSignatureHelp(
      'MATCH (n) WHERE apoc.do.when(true, "foo"',
      dbWithFunction,
      expectedArgIndex(1),
    );
  });

  test('Provides signature help for functions third argument', () => {
    testSignatureHelp(
      'RETURN true OR apoc.do.when(true, "foo",',
      dbWithFunction,
      expectedArgIndex(2),
    );

    testSignatureHelp(
      'RETURN true OR apoc.do.when(true, "foo", false',
      dbWithFunction,
      expectedArgIndex(2),
    );
  });

  test('Provides signature help with several statements where cursor one requires autocompletion', () => {
    testSignatureHelp(
      `MATCH (n) RETURN n;
       MATCH (m) WHERE apoc.do.when(`,
      dbWithFunction,
      expectedArgIndex(0),
    );
  });

  test('Does not provide signature help with several statements where cursor one does not require autocompletion', () => {
    testSignatureHelp(
      `RETURN apoc.do.when(true, "foo", false, "bar");
 
       MATCH (`,
      dbWithFunction,
      emptyResult,
    );
  });
});
