import { doSemanticAnalysis } from '@neo4j-cypher/language-support';
import { parentPort } from 'worker_threads';

parentPort.on('message', (value: { query: string; port: MessagePort }) => {
  const result = doSemanticAnalysis(value.query);

  value.port.postMessage(result);
  value.port.close();
});
