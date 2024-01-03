import * as assert from 'assert';
import * as vscode from 'vscode';
import { eventually, getDocumentUri, openDocument } from '../helpers';

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
        'vscode.provideSignatureHelp',
        docUri,
        position,
      );

    assert.equal(signatureHelp.activeParameter, expected.activeParameter);
    assert.equal(signatureHelp.activeSignature, expected.activeSignature);

    expected.signatures.forEach((expectedSignature) => {
      const foundSignature = signatureHelp.signatures.find(
        (signature) => signature.label === expectedSignature.label,
      );

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
  test('Triggers signature help for first argument of functions', async () => {
    const position = new vscode.Position(2, 28);

    const expected: vscode.SignatureHelp = undefined;

    await testSignatureHelp({
      textFile: 'signature-help-function.cypher',
      position: position,
      expected: expected,
    });
  });
});
