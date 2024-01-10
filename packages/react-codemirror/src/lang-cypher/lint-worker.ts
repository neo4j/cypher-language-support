import {
  runSemanticAnalysis,
  validateSyntax,
  type DbSchema,
} from '@neo4j-cypher/language-support';

type SemanticAnaylysisRequestMessage = { query: string; dbSchema: DbSchema };

self.onmessage = (event: MessageEvent) => {
  const args = event.data as SemanticAnaylysisRequestMessage;
  const syntaxErrors = validateSyntax(args.query, args.dbSchema);

  const port = event.ports[0];
  const shouldDoSemanticCheck = syntaxErrors.length === 0;

  // send one message as soon as we know normal parser has no errors
  port.postMessage({ diags: syntaxErrors, done: !shouldDoSemanticCheck });

  // send another message when we have semantic errors as well
  if (shouldDoSemanticCheck) {
    const semanticErrors = runSemanticAnalysis(args.query);
    port.postMessage({ diags: semanticErrors, done: true });
  }
};
