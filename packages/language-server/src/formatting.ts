import { formatQuery } from '@neo4j-cypher/language-support';
import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  DocumentFormattingParams,
  TextDocuments,
  TextEdit,
} from 'vscode-languageserver/node';

export const formatDocument = (
  params: DocumentFormattingParams,
  documents: TextDocuments<TextDocument>,
): TextEdit[] => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }

  const text = document.getText();
  const formattedText = formatQuery(text);

  if (text === formattedText) {
    return [];
  }

  return [
    TextEdit.replace(
      {
        start: { line: 0, character: 0 },
        end: { line: document.lineCount, character: 0 },
      },
      formattedText,
    ),
  ];
};
