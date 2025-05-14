import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryResultsMessage } from '../queryResults/viewRegistry';

interface vscode {
  postMessage(message: QueryResultsMessage): void;
}

declare const vscode: vscode;

export function QueryVisualization() {
  //   const [statementResults, setStatementResults] = useState<ResultRows>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const message = event.data as QueryResultsMessage;

      if (
        message.to === 'visualizationView' &&
        message.type === 'statementSelect'
      ) {
        // passing the message(high likely from queryDetails) to the visualization view
        vscode.postMessage(message);
      }

      if (message.type === 'executionUpdate') {
        console.log('Execution update message received:', message);
        // handle execution update messages
        // setStatementResults(message.result);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return <div>Query viz should come here</div>;
}

createRoot(document.getElementById('queryVisualization')).render(
  <QueryVisualization />,
);
