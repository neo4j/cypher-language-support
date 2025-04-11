import { signatureHelp } from '@neo4j-cypher/language-support';
import {
  SignatureHelp,
  SignatureHelpParams,
  TextDocuments,
} from 'vscode-languageserver/node';

import { Neo4jSchemaPoller } from '@neo4j-cypher/query-tools';
import { TextDocument } from 'vscode-languageserver-textdocument';

export const emptyResult: SignatureHelp = {
  signatures: [],
  activeSignature: undefined,
  activeParameter: undefined,
};

export function doSignatureHelp(
  documents: TextDocuments<TextDocument>,
  neo4j: Neo4jSchemaPoller,
) {
  return (params: SignatureHelpParams) => {
    const textDocument = documents.get(params.textDocument.uri);
    const endOfTriggerHelp = params.context?.triggerCharacter === ')';
    if (textDocument === undefined || endOfTriggerHelp) return emptyResult;

    const position = params.position;
    const offset = textDocument.offsetAt(position);

    return signatureHelp(
      textDocument.getText(),
      neo4j.metadata?.dbSchema ?? {},
      offset,
    );
  };
}
