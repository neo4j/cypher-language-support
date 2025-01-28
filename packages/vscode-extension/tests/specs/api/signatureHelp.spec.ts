import {
  testData,
  toSignatureInformation,
} from '@neo4j-cypher/language-support';
import * as assert from 'assert';
import * as vscode from 'vscode';
import {
  documentationToString,
  eventually,
  getDocumentUri,
  newUntitledFileWithContent,
  openDocument,
  parameterLabelToString,
} from '../../helpers';

type InclusionTestArgs = {
  textFile: string | vscode.Uri;
  position: vscode.Position;
  expected: vscode.SignatureHelp;
};

export async function testSignatureHelp({
  textFile,
  position,
  expected,
}: InclusionTestArgs) {
  let docUri: vscode.Uri;
  if (typeof textFile === 'string') {
    docUri = getDocumentUri(textFile);
    await openDocument(docUri);
  } else {
    docUri = textFile;
  }

  await eventually(async () => {
    const signatureHelp: vscode.SignatureHelp =
      await vscode.commands.executeCommand(
        'vscode.executeSignatureHelpProvider',
        docUri,
        position,
      );

    assert.equal(
      signatureHelp.activeParameter,
      expected.activeParameter,
      `Active parameter does not match. Actual: ${signatureHelp.activeParameter}, expected: ${expected.activeParameter}`,
    );

    expected.signatures.forEach((expectedSignature) => {
      const foundSignature = signatureHelp.signatures.find((signature) => {
        return signature.label === expectedSignature.label;
      });

      assert.equal(
        foundSignature.documentation,
        expectedSignature.documentation,
        `Documentation for the signature does not match. Actual: ${documentationToString(
          foundSignature.documentation,
        )}, expected: ${documentationToString(
          expectedSignature.documentation,
        )}`,
      );

      expectedSignature.parameters.forEach((expectedParameter) => {
        const foundParameter = foundSignature.parameters.find(
          (parameter) => parameter.label === expectedParameter.label,
        );

        assert.equal(
          foundParameter?.documentation,
          expectedParameter.documentation,
          `Documentation for the parameter ${parameterLabelToString(
            expectedParameter.label,
          )} does not match. Actual: ${documentationToString(
            foundParameter?.documentation,
          )}, expected: ${documentationToString(
            expectedParameter.documentation,
          )}`,
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
          testData.mockSchema.functions['CYPHER 5']['abs'],
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
          testData.mockSchema.procedures['CYPHER 5']['apoc.import.csv'],
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
          testData.mockSchema.procedures['CYPHER 5']['apoc.import.csv'],
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
          testData.mockSchema.procedures['CYPHER 5']['apoc.import.csv'],
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
          testData.mockSchema.procedures['CYPHER 5']['apoc.import.csv'],
        ) as vscode.SignatureInformation,
      ],
    };

    await testSignatureHelp({
      textFile: 'signature-help.cypher',
      position: position,
      expected: expected,
    });
  });

  test('Signature help depends on the Cypher version', async () => {
    const textDocument = await newUntitledFileWithContent(`
          CYPHER 5 RETURN apoc.create.uuid( ;
          CYPHER 25 RETURN apoc.create.uuid(
        `);
    const cypher5Position = new vscode.Position(1, 43);
    const cypher25Position = new vscode.Position(2, 44);

    const cypher5Expected: vscode.SignatureHelp = {
      // This is what would make it show only the function description
      // since there are only 3 arguments in the signature and the last index is 2
      activeParameter: 0,
      activeSignature: undefined,
      signatures: [
        toSignatureInformation(
          testData.mockSchema.functions['CYPHER 5']['apoc.create.uuid'],
        ) as vscode.SignatureInformation,
      ],
    };

    await testSignatureHelp({
      textFile: textDocument.uri,
      position: cypher5Position,
      expected: cypher5Expected,
    });

    // TODO Using assert.rejects is not ideal but I couldn't find
    // a procedure that was specifically added in Cypher 25
    // In next apoc releases, apoc.cypher.runTimeboxed
    // will add an extra config argument in Cypher 25,
    // so we could improve this test
    await assert.rejects(
      testSignatureHelp({
        textFile: textDocument.uri,
        position: cypher25Position,
        expected: cypher5Expected,
      }),
    );
  });
});
