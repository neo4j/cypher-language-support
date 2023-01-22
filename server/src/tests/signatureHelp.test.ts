import {
  ParameterInformation,
  SignatureHelp,
  SignatureInformation,
} from 'vscode-languageserver/node';
import { DbInfo } from '../dbInfo';
import { doSignatureHelpForQuery } from '../signatureHelp';
import { MockDbInfo } from './helpers';

export async function testSignatureHelp(
  fileText: string,
  dbInfo: DbInfo,
  expected: SignatureHelp,
) {
  const actualSignatureHelp = doSignatureHelpForQuery(fileText, dbInfo);

  expect(actualSignatureHelp.activeParameter).toBe(expected.activeParameter);
  expect(actualSignatureHelp.activeSignature).toBe(expected.activeSignature);
  expect(actualSignatureHelp.signatures).toStrictEqual(expected.signatures);
}

describe('Procedures signature help', () => {
  const procedureSignature = SignatureInformation.create(
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
    new Map([['apoc.do.when', procedureSignature]]),
  );

  function expectedArgIndex(i: number): SignatureHelp {
    return {
      signatures: [procedureSignature],
      activeSignature: 0,
      activeParameter: i,
    };
  }

  test('Provides signature help for CALLs first argument', async () => {
    await testSignatureHelp(
      'CALL apoc.do.when(',
      dbWithProcedure,
      expectedArgIndex(0),
    );

    await testSignatureHelp(
      'CALL apoc.do.when(true',
      dbWithProcedure,
      expectedArgIndex(0),
    );
  });

  test('Provides signature help for CALLs second argument', async () => {
    await testSignatureHelp(
      'CALL apoc.do.when(true,',
      dbWithProcedure,
      expectedArgIndex(1),
    );

    await testSignatureHelp(
      'CALL apoc.do.when(true, "foo"',
      dbWithProcedure,
      expectedArgIndex(1),
    );
  });

  test('Provides signature help for CALLs third argument', async () => {
    await testSignatureHelp(
      'CALL apoc.do.when(true, "foo",',
      dbWithProcedure,
      expectedArgIndex(2),
    );

    await testSignatureHelp(
      'CALL apoc.do.when(true, "foo", false',
      dbWithProcedure,
      expectedArgIndex(2),
    );
  });

  test('Provides signature help for CALLs fourth argument', async () => {
    await testSignatureHelp(
      'CALL apoc.do.when(true, "foo", false,',
      dbWithProcedure,
      expectedArgIndex(3),
    );

    await testSignatureHelp(
      'CALL apoc.do.when(true, "foo", false, "bar"',
      dbWithProcedure,
      expectedArgIndex(3),
    );
  });
});
