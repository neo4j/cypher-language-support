import { signatureHelp } from '@neo4j-cypher/language-support';
import {
  SignatureHelp,
  SignatureHelpParams,
  TextDocuments,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { RuntimeStrategy } from './runtime/runtimeStrategy';

export const emptyResult: SignatureHelp = {
  signatures: [],
  activeSignature: undefined,
  activeParameter: undefined,
};

export function doSignatureHelp(
  documents: TextDocuments<TextDocument>,
  runtime: RuntimeStrategy,
) {
  return (params: SignatureHelpParams) => {
    const dbSchema = runtime.getDbSchema();
    const textDocument = documents.get(params.textDocument.uri);
    const endOfTriggerHelp = params.context?.triggerCharacter === ')';
    if (textDocument === undefined || endOfTriggerHelp) return emptyResult;

    const position = params.position;
    const offset = textDocument.offsetAt(position);

    return signatureHelp(textDocument.getText(), dbSchema, offset);
  };
}
