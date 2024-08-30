import {
  testData,
  toSignatureInformation,
} from '@neo4j-cypher/language-support';
import * as assert from 'assert';
import * as vscode from 'vscode';
import { eventually, getDocumentUri, openDocument } from '../../helpers';

type InclusionTestArgs = {
  textFile: string;
  position: vscode.Position;
  expected: vscode.SignatureHelp;
};

export async function testSignatureHelp({
  textFile,
  position,
  expected,
}: InclusionTestArgs) {
  const docUri = getDocumentUri(textFile);

  await openDocument(docUri);

  await eventually(async () => {
    const signatureHelp: vscode.SignatureHelp =
      await vscode.commands.executeCommand(
        'vscode.executeSignatureHelpProvider',
        docUri,
        position,
      );

    assert.equal(signatureHelp.activeParameter, expected.activeParameter);

    expected.signatures.forEach((expectedSignature) => {
      const foundSignature = signatureHelp.signatures.find((signature) => {
        return signature.label === expectedSignature.label;
      });

      assert.equal(
        foundSignature.documentation,
        expectedSignature.documentation,
      );

      expectedSignature.parameters.forEach((expectedParameter) => {
        const foundParameter = foundSignature.parameters.find(
          (parameter) => parameter.label === expectedParameter.label,
        );

        assert.equal(
          foundParameter.documentation,
          expectedParameter.documentation,
        );
      });
    });
  });
}

suite('Signature help spec', () => {
  test('Signature help works for functions', async () => {
    const position = new vscode.Position(0, 11);

    const expected: vscode.SignatureHelp = {
      activeParameter: 0,
      // We don't test the active signature, otherwise we would have to modify
      // these tests every time a new function is added to the database
      activeSignature: undefined,
      signatures: [
        toSignatureInformation(
          testData.mockSchema.functions.abs,
        ) as vscode.SignatureInformation,
      ],
    };

    await testSignatureHelp({
      textFile: 'signature-help.cypher',
      position: position,
      expected: expected,
    });
  });

  test('Signature help works for procedures', async () => {
    const position = new vscode.Position(1, 21);

    const expected: vscode.SignatureHelp = {
      activeParameter: 0,
      activeSignature: undefined,
      signatures: [
        toSignatureInformation(
          testData.mockSchema.procedures['apoc.import.csv'],
        ) as vscode.SignatureInformation,
      ],
    };

    await testSignatureHelp({
      textFile: 'signature-help.cypher',
      position: position,
      expected: expected,
    });
  });

  test('Signature help works when changing arguments', async () => {
    const position = new vscode.Position(1, 27);

    const expected: vscode.SignatureHelp = {
      activeParameter: 1,
      activeSignature: undefined,
      signatures: [
        toSignatureInformation(
          testData.mockSchema.procedures['apoc.import.csv'],
        ) as vscode.SignatureInformation,
      ],
    };

    await testSignatureHelp({
      textFile: 'signature-help.cypher',
      position: position,
      expected: expected,
    });
  });

  test('Signature help works for arguments with a space following a separator', async () => {
    const position = new vscode.Position(1, 28);

    const expected: vscode.SignatureHelp = {
      activeParameter: 1,
      activeSignature: undefined,
      signatures: [
        toSignatureInformation(
          testData.mockSchema.procedures['apoc.import.csv'],
        ) as vscode.SignatureInformation,
      ],
    };

    await testSignatureHelp({
      textFile: 'signature-help.cypher',
      position: position,
      expected: expected,
    });
  });

  test('Signature help only shows the description past the last argument', async () => {
    const position = new vscode.Position(2, 42);

    const expected: vscode.SignatureHelp = {
      // This is what would make it show only the function description
      // since there are only 3 arguments in the signature and the last index is 2
      activeParameter: 3,
      activeSignature: undefined,
      signatures: [
        toSignatureInformation(
          testData.mockSchema.procedures['apoc.import.csv'],
        ) as vscode.SignatureInformation,
      ],
    };

    await testSignatureHelp({
      textFile: 'signature-help.cypher',
      position: position,
      expected: expected,
    });
  });
});
