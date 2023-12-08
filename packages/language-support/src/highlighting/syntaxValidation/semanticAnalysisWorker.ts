import { doSemanticAnalysis } from './semanticAnalysisWrapper.js';

type SemanticAnaylysisRequestMessage = { requestId: string; query: string };

self.onmessage = (event: MessageEvent) => {
  const result = doSemanticAnalysis(
    (event.data as SemanticAnaylysisRequestMessage).query,
  );
  postMessage({ result });
};
