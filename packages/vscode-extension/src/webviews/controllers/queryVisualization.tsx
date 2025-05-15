import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryResultsMessage, QueryResult } from '../queryResults/viewRegistry';
import { VizWrapper } from '../../components/viz-wrapper';

interface vscode {
  postMessage(message: QueryResultsMessage): void;
}

declare const vscode: vscode;

const renderContent = (result: QueryResult) => {
  if (result.type === 'executing') {
    return 'Executing...';
  }
  if (result.type === 'error') {
    return result.errorMessage;
  }
  if (result.type === 'success') {
    return (
      <VizWrapper
        key={result.statement}
        rows={result.rows}
        nodes={result.nodes}
        relationships={result.relationships}
      />
    );
  }
  return null;
};

export function QueryVisualization() {
  const [statementResult, setStatementResult] = useState<QueryResult>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data as QueryResultsMessage;

      if (message.to !== 'visualizationView') {
        return;
      }

      if (message.type === 'visualizationUpdate') {
        // passing the message(high likely from queryDetails) to the visualization view
        vscode.postMessage(message);
        setStatementResult(message.result);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div>
      {statementResult ? (
        renderContent(statementResult)
      ) : (
        <div className="n-px-token-5 n-py-token-4">
          Please select a statement to see query results.
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('queryVisualization')).render(
  <QueryVisualization />,
);
