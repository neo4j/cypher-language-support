import {
  applySyntaxColouring,
  mapCypherToSemanticTokenIndex,
} from '@neo4j-cypher/language-support';
import {
  SemanticTokensBuilder,
  SemanticTokensParams,
  TextDocument,
  TextDocuments,
} from 'vscode-languageserver';

export function applySyntaxColouringForDocument(
  documents: TextDocuments<TextDocument>,
) {
  return (params: SemanticTokensParams) => {
    const textDocument = documents.get(params.textDocument.uri);
    if (textDocument === undefined) return { data: [] };

    const tokens = applySyntaxColouring(textDocument.getText());

    const builder = new SemanticTokensBuilder();

    tokens.forEach((token) => {
      const tokenColour = mapCypherToSemanticTokenIndex(token.tokenType);

      if (tokenColour !== undefined) {
        builder.push(
          token.position.line,
          token.position.startCharacter,
          token.length,
          tokenColour,
          0,
        );
      }
    });
    const results = builder.build();
    return results;
  };
}
