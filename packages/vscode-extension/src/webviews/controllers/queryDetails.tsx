import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Result, ResultMessage } from '../resultWindow';

interface vscode {
  postMessage(message: ResultsTabMessage): void;
}

declare const vscode: vscode;

type ResultState = {
  statement: string;
  state:
    | 'executing'
    | { type: 'error'; errorMessage: string }
    | { type: 'success'; result: Result };
}[];

export type ResultsTabMessage = {
  type: 'resultsWindowLoaded';
};

export function QueryDetails() {
  const [statementResults, setStatementResults] = useState<ResultState>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const message = event.data as ResultMessage;

      if (message.type === 'executing') {
        const resultState: ResultState = message.statements.map((statement) => {
          return {
            statement: statement,
            state: 'executing',
          };
        });
        setStatementResults(resultState);
      } else if (message.type === 'success') {
        setStatementResults((prev) => {
          const i = message.index;
          const newState = [...prev];
          newState[i].state = { type: 'success', result: message.result };
          return newState;
        });
      } else if (message.type === 'error') {
        setStatementResults((prev) => {
          const i = message.index;
          const newState = [...prev];
          newState[i].state = {
            type: 'error',
            errorMessage: message.errorMessage,
          };
          return newState;
        });
      }
    };

    window.addEventListener('message', handleMessage);
    vscode.postMessage({ type: 'resultsWindowLoaded' });

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div>
      {statementResults.length > 0 ? (
        statementResults.map((statements, i) => (
          <p key={i}>{statements.statement}</p>
        ))
      ) : (
        <p className="n-mt-2">Run a Cypher query to see the details</p>
      )}
    </div>
  );
}

createRoot(document.getElementById('queryDetails')).render(<QueryDetails />);
