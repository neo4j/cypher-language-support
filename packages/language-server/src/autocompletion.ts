import {
  CompletionParams,
  CompletionTriggerKind,
  Position,
  TextDocuments,
} from 'vscode-languageserver/node';

import type { CompletionItem } from '@neo4j-cypher/language-support';
import { autocomplete } from '@neo4j-cypher/language-support';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { RuntimeStrategy } from './runtime/runtimeStrategy';

export function doAutoCompletion(
  documents: TextDocuments<TextDocument>,
  runtime: RuntimeStrategy,
) {
  return (completionParams: CompletionParams) => {
    const dbSchema = runtime.getDbSchema();
    const textDocument = documents.get(completionParams.textDocument.uri);
    if (textDocument === undefined) return [];

    const position: Position = completionParams.position;
    const offset = textDocument.offsetAt(position);

    const completions: CompletionItem[] = autocomplete(
      textDocument.getText(),
      dbSchema,
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
