import {
  CompletionParams,
  CompletionTriggerKind,
  Position,
  TextDocuments,
} from 'vscode-languageserver';

import type { CompletionItem } from '@neo4j-cypher/language-support';
import {
  autocomplete,
  DbSchema,
  shouldAutoCompleteYield,
} from '@neo4j-cypher/language-support';
import { TextDocument } from 'vscode-languageserver-textdocument';

export function doAutoCompletion(
  documents: TextDocuments<TextDocument>,
  getDbSchema: () => DbSchema,
) {
  return (completionParams: CompletionParams) => {
    const textDocument = documents.get(completionParams.textDocument.uri);
    if (textDocument === undefined) return [];

    const position: Position = completionParams.position;
    const offset = textDocument.offsetAt(position);
    const yieldTriggered = shouldAutoCompleteYield(
      textDocument.getText(),
      offset,
    );
    const manualOrCharacterOrInwordTriggered =
      completionParams.context?.triggerCharacter !== ' ';
    if (yieldTriggered || manualOrCharacterOrInwordTriggered) {
      const completions: CompletionItem[] = autocomplete(
        textDocument.getText(),
        getDbSchema(),
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
