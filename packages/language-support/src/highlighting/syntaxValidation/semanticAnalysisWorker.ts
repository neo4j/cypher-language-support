/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { doSemanticAnalysis } from './semanticAnalysisWrapper.js';

type SemanticAnaylysisRequestMessage = { requestId: string; query: string };

// TODO use web-woeker npm package to make this work in node as well
self.onmessage = (event: MessageEvent) => {
  const result = doSemanticAnalysis(
    (event.data as SemanticAnaylysisRequestMessage).query,
  );

  // TODO there's something in the latest semantic anaylsis which makes this no longer possible
  console.log(result.errors);
  postMessage({
    result: {
      errors: result.errors.map(({ message, position }) => ({
        message,
        position: {
          // @ts-ignore sdf
          column: position.$column2,
          // @ts-ignore sdf
          line: position.$line2,
          // @ts-ignore sdf
          offset: position.$offset2,
        },
      })),
      notifications: result.notifications.map(({ message, position }) => ({
        message,
        position: {
          // @ts-ignore sdf
          column: position.$column2,
          // @ts-ignore sdf
          line: position.$line2,
          // @ts-ignore sdf
          offset: position.$offset2,
        },
      })),
    },
  });
};
