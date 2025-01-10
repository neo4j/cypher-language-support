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

    const triggerPhrase = 'yield ';
    const text = textDocument.getText().slice(0, offset);
    const precedingText = text
      .slice(Math.max(0, offset - triggerPhrase.length), offset)
      .toLowerCase();
    //const precedingCharacter =
    const shouldTriggerYieldCompletion =
      precedingText === triggerPhrase &&
      completionParams.context?.triggerCharacter === ' ';
    const shouldDoManualSingleCharacterOrInwordCompletion =
      completionParams.context?.triggerCharacter !== ' ';
    if (
      shouldTriggerYieldCompletion ||
      shouldDoManualSingleCharacterOrInwordCompletion
    ) {
      const completions: CompletionItem[] = autocomplete(
        // TODO This is a temporary hack because completions are not working well
        textDocument.getText().slice(0, offset),
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
    }
  };
}
