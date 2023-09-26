import * as path from 'path';
import { Uri, window, workspace } from 'vscode';

export async function openDocument(docUri: Uri) {
  try {
    // The language server should be activated automatically when opening a file with Cypher extension
    const document = await workspace.openTextDocument(docUri);
    await window.showTextDocument(document);
    // Wait 5 seconds for the language server to activate
    await sleep(5000);
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
