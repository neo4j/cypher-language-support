import {
  Position,
  TextDocumentPositionParams,
  TextDocuments,
} from 'vscode-languageserver/node';

import { Range } from 'vscode-languageserver-types';

import { autocomplete, DbInfo } from 'language-support';
import { TextDocument } from 'vscode-languageserver-textdocument';

export function doAutoCompletion(
  documents: TextDocuments<TextDocument>,
  dbInfo: DbInfo,
) {
  return (textDocumentPosition: TextDocumentPositionParams) => {
    const textDocument = documents.get(textDocumentPosition.textDocument.uri);
    if (textDocument === undefined) return [];

    const position: Position = textDocumentPosition.position;
    const range: Range = {
      // TODO Nacho: We are parsing from the begining of the file.
      // Do we need to parse from the begining of the current query?
      start: Position.create(0, 0),
      end: position,
    };

    return autocomplete(textDocument.getText(range), position, dbInfo);
  };
}
