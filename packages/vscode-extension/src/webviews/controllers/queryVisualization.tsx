import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  QueryResultsMessage,
  QueryResult,
} from '../queryResults/queryResultsTypes';
import { VizWrapper } from '../../components/viz-wrapper';

interface vscode {
  postMessage(message: QueryResultsMessage): void;
}

declare const vscode: vscode;

const renderContent = (result: QueryResult) => {
  if (result.type === 'executing') {
    return <div className="n-px-token-5 n-py-token-4">Executing...</div>;
  }
  if (result.type === 'error') {
    return (
      <div className="n-px-token-5 n-py-token-4">{result.errorMessage}</div>
    );
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
        // passing the message to parent to update the title
        vscode.postMessage(message);
        setStatementResult(message.result);
      } else if (message.type === 'themeUpdate') {
        document.documentElement.classList.toggle(
          'ndl-theme-dark',
          message.isDarkTheme,
        );
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
          Select a statement from query details panel to see query results
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('queryVisualization')).render(
  <QueryVisualization />,
);
