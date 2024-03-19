import {
  Position,
  TextDocumentPositionParams,
  TextDocuments,
} from 'vscode-languageserver/node';

import { autocomplete } from '@neo4j-cypher/language-support';
import { Neo4jSchemaPoller } from '@neo4j-cypher/schema-poller';
import { TextDocument } from 'vscode-languageserver-textdocument';

export function doAutoCompletion(
  documents: TextDocuments<TextDocument>,
  neo4j: Neo4jSchemaPoller,
) {
  return (textDocumentPosition: TextDocumentPositionParams) => {
    const textDocument = documents.get(textDocumentPosition.textDocument.uri);
    if (textDocument === undefined) return [];

    const position: Position = textDocumentPosition.position;
    const offset = textDocument.offsetAt(position);

    return autocomplete(
      textDocument.getText(),
      neo4j.metadata?.dbSchema ?? {},
      offset,
    );
  };
}
