import * as path from 'path';
import { Uri, window, workspace } from 'vscode';
import { Connection } from '../src/connectionService';

export async function openDocument(docUri: Uri) {
  try {
    // The language server should be activated automatically
    // when opening a file with Cypher extension
    const document = await workspace.openTextDocument(docUri);
    await window.showTextDocument(document);
  } catch (e) {
    console.error(e);
  }
}

export async function newUntitledFileWithContent(content: string) {
  try {
    // The language server will not be activated automatically
    const document = await workspace.openTextDocument({ content: content });
    await window.showTextDocument(document);
  } catch (e) {
    console.error(e);
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getDocumentUri(docName: string) {
  return Uri.file(path.resolve(__dirname, '../../e2e_tests/fixtures', docName));
}

export async function eventually(
  assertion: () => Promise<void>,
  timeoutMs = 15000,
  backoffMs = 100,
) {
  let totalWait = 0;
  let wait = backoffMs;
  let succeeded = false;

  while (!succeeded) {
    try {
      await assertion();
      succeeded = true;
    } catch (e) {
      totalWait += wait;
      if (totalWait > timeoutMs) {
        throw new Error(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `Timeout of ${timeoutMs} exceeded for test with last error: ${e}`,
        );
      } else {
        wait *= 2;
        await sleep(wait);
      }
    }
  }
}

export function getMockConnection(
  key: string = 'mock-key',
  connect: boolean = false,
): Connection {
  return {
    key: key,
    name: 'mock-connection',
    database: 'neo4j',
    connect: connect,
    user: 'neo4j',
    host: 'localhost',
    scheme: 'neo4j',
    port: '7687',
  };
}
