import { doSemanticAnalysis } from '@neo4j-cypher/language-support';
import { isMainThread, parentPort } from 'worker_threads';

if (!isMainThread) {
  parentPort.once('message', (value: { query: string; port: MessagePort }) => {
    const result = doSemanticAnalysis(value.query);

    value.port.postMessage(result);
    value.port.close();
  });
}
