import { validateSemantics } from '@neo4j-cypher/language-support';

export type SemanticAnalysisRequestMessage = { query: string };

self.onmessage = (event: MessageEvent) => {
  const args = event.data as SemanticAnalysisRequestMessage;

  const port = event.ports[0];

  const semanticErrors = validateSemantics(args.query);
  port.postMessage(semanticErrors);
};
