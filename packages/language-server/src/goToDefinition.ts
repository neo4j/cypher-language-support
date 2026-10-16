import type {
  Definition,
  DefinitionParams,
  TextDocuments,
} from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import { languageService } from './server.js';

export function goToDefinition(documents: TextDocuments<TextDocument>) {
  return (params: DefinitionParams): Definition | undefined => {
    const textDocument = documents.get(params.textDocument.uri);
    const offset = textDocument.offsetAt(params.position);
    const result = languageService.findDefinitionPosition(
      textDocument.getText(),
      offset,
    );
    if (result) {
      const { startOffset: definitionStart, endOffset: definitionEnd } = result;
      return {
        uri: params.textDocument.uri,
        range: {
          start: textDocument.positionAt(definitionStart),
          end: textDocument.positionAt(definitionEnd),
        },
      };
    }
    return undefined;
  };
}
