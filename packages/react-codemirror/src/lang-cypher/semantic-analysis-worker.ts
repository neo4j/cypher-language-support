import { doSemanticAnalysis } from '@neo4j-cypher/language-support';

type SemanticAnaylysisRequestMessage = { query: string };

self.onmessage = (event: MessageEvent) => {
  const result = doSemanticAnalysis(
    (event.data as SemanticAnaylysisRequestMessage).query,
  );

  const port = event.ports[0];
  port.postMessage(result);
};
