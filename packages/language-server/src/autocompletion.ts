import {
  CompletionParams,
  CompletionTriggerKind,
  Position,
  TextDocuments,
} from 'vscode-languageserver/node';

import type { CompletionItem } from '@neo4j-cypher/language-support';
import { autocomplete } from '@neo4j-cypher/language-support';
import { Neo4jSchemaPoller } from '@neo4j-cypher/schema-poller';
import { TextDocument } from 'vscode-languageserver-textdocument';

export function doAutoCompletion(
  documents: TextDocuments<TextDocument>,
  neo4j: Neo4jSchemaPoller,
) {
  return (completionParams: CompletionParams) => {
    const textDocument = documents.get(completionParams.textDocument.uri);
    if (textDocument === undefined) return [];

    const position: Position = completionParams.position;
    const offset = textDocument.offsetAt(position);

    const completions: CompletionItem[] = autocomplete(
      textDocument.getText(),
      neo4j.metadata?.dbSchema ?? {},
      offset,
      completionParams.context.triggerKind === CompletionTriggerKind.Invoked,
    );

    const result = completions.map((item) => {
      if (item.signature) {
        return {
          ...item,
          detail: item.detail + ' ' + item.signature,
          signature: undefined,
        };
      } else {
        return item;
      }
    });

    return result;
  };
}
