/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { doSemanticAnalysis } from './semanticAnalysisWrapper.js';

type SemanticAnaylysisRequestMessage = { query: string };

// TODO use web-worker npm package to make this work in node as well
self.onmessage = (event: MessageEvent) => {
  const result = doSemanticAnalysis(
    (event.data as SemanticAnaylysisRequestMessage).query,
  );

  const port = event.ports[0];
  port.postMessage({
    errors: result.errors.map(({ message, position }) => ({
      message,
      position: {
        column: position.column,
        line: position.line,
        offset: position.offset,
      },
    })),
    notifications: result.notifications.map(({ message, position }) => ({
      message,
      position: {
        column: position.column,
        line: position.line,
        offset: position.offset,
      },
    })),
  });
};
