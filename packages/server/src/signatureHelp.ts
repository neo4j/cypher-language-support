import { signatureHelp } from 'language-support';
import {
  Position,
  Range,
  SignatureHelp,
  SignatureHelpParams,
  TextDocuments,
} from 'vscode-languageserver/node';

import { Neo4jSchemaPoller } from 'neo4j-schema-poller';
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
    const range: Range = {
      start: Position.create(0, 0),
      end: position,
    };

    return signatureHelp(
      textDocument.getText(range),
      neo4j.metadata?.dbSchema ?? {},
    );
  };
}
