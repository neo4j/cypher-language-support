import { validateSyntax, type DbSchema } from '@neo4j-cypher/language-support';

type SemanticAnaylysisRequestMessage = { query: string; dbSchema: DbSchema };

self.onmessage = (event: MessageEvent) => {
  const args = event.data as SemanticAnaylysisRequestMessage;
  const result = validateSyntax(args.query, args.dbSchema);

  const port = event.ports[0];
  port.postMessage(result);
};
