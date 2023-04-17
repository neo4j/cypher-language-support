import { signatureHelp } from 'language-support';
import {
  Position,
  Range,
  SignatureHelp,
  SignatureHelpParams,
  TextDocuments,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { DbInfo } from './dbInfo';

export const emptyResult: SignatureHelp = {
  signatures: [],
  activeSignature: undefined,
  activeParameter: undefined,
};

export function doSignatureHelp(
  documents: TextDocuments<TextDocument>,
  dbInfo: DbInfo,
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

    return signatureHelp(textDocument.getText(range), dbInfo);
  };
}
