/* 
import { doSemanticAnalysis } from '@neo4j-cypher/language-support/src/highlighting/syntaxValidation/semanticAnalysisWrapper.js';

type SemanticAnaylysisRequestMessage = { query: string };

self.onmessage = (event: MessageEvent) => {
  const result = doSemanticAnalysis(
    (event.data as SemanticAnaylysisRequestMessage).query,
  );

  const port = event.ports[0];
  port.postMessage(result);
};

// TODO make normal tests work even if using older method.
// TODO make it work for node with web-worker
// TODO make it work for jest
// TODO make it work for vsocde extension -> cjs

const semanticAnalysisWorker = Worker
  ? new Worker(new URL('./semanticAnalysisWorker.js', import.meta.url), {
      type: 'module',
    })
  : null;


  ): Promise<SyntaxDiagnostic[]> {
    if (semanticAnalysisWorker !== null) {
      // See explaination here on why and how we use the MessageChannel API rather than just postMessage():
      // https://stackoverflow.com/questions/62076325/how-to-let-a-webworker-do-multiple-tasks-simultaneously
  
      const channel = new MessageChannel();
  
      semanticAnalysisWorker.postMessage({ query }, [channel.port1]);
  
      return new Promise((resolve) => {
        channel.port2.onmessage = (event) => {
          const result = event.data as SemanticAnalysisResult;
  
          const errors = getSemanticAnalysisDiagnostics(
            result.errors,
            DiagnosticSeverity.Error,
            parsingResult,
          );
  
          const warnings = getSemanticAnalysisDiagnostics(
            result.notifications,
            DiagnosticSeverity.Warning,
            parsingResult,
          );
  
          resolve([...errors, ...warnings]);
        };
      });
      */
