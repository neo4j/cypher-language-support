import { doSemanticAnalysis } from './semanticAnalysisWrapper.js';

type SemanticAnaylysisRequestMessage = { requestId: string; query: string };

// TODO use web-woeker npm package to make this work in node as well
self.onmessage = (event: MessageEvent) => {
  const result = doSemanticAnalysis(
    (event.data as SemanticAnaylysisRequestMessage).query,
  );

  // TODO there's something in the latest semantic anaylsis which makes this no longer possible
  postMessage({ result });
};
