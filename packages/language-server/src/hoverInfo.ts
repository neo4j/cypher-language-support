import type { Hover, HoverParams, TextDocuments } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import { languageService } from './server.js';
import type { Neo4jSchemaPoller } from '@neo4j-cypher/query-tools';

export function doHoverInfo(
  documents: TextDocuments<TextDocument>,
  neo4jSchemaPoller: Neo4jSchemaPoller,
  params: HoverParams,
): Hover | null {
  const textDocument = documents.get(params.textDocument.uri);
  if (textDocument === undefined) return null;
  const position = params.position;
  const offset = textDocument.offsetAt(position);
  const hoverInfo = languageService.hoverInfo(textDocument.getText(), {
    caretPosition: offset,
    dbSchema: neo4jSchemaPoller.metadata?.dbSchema ?? {},
  });
  return hoverInfo ? hoverInfo : null;
}
