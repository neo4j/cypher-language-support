import * as path from 'path';
import * as vscode from 'vscode';
import * as os from 'os';
import { TextDocument, Uri, window, workspace } from 'vscode';
import { Connection } from '../src/connectionService';
import { getNonce } from '../src/getNonce';

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

export async function newUntitledFileWithContent(
  content: string,
): Promise<TextDocument> {
  try {
    // The language server will not be activated automatically
    const document = await workspace.openTextDocument({ content: content });
    await window.showTextDocument(document);
    const editor = vscode.window.activeTextEditor;
    await vscode.languages.setTextDocumentLanguage(editor.document, 'cypher');
    return document;
  } catch (e) {
    console.error(e);
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getDocumentUri(docName: string) {
  return Uri.file(path.resolve(__dirname, '../../tests/fixtures', docName));
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

export function getMockConnection(activate: boolean = false): Connection {
  return {
    key: getNonce(16),
    database: 'neo4j',
    user: 'neo4j',
    host: 'localhost',
    scheme: 'neo4j',
    port: '7687',
    state: activate ? 'activating' : 'inactive',
  };
}

export function getNeo4j2025Configuration() {
  return {
    scheme: process.env.NEO4J_SCHEME || 'neo4j',
    host: process.env.NEO4J_HOST || 'localhost',
    port: process.env.NEO4J_2025_PORT || '7687',
    user: process.env.NEO4J_USER || 'neo4j',
    database: process.env.NEO4J_DATABASE || 'neo4j',
    password: process.env.NEO4J_PASSWORD || 'password',
  };
}

export function getNeo4j5Configuration() {
  return {
    scheme: process.env.NEO4J_SCHEME || 'neo4j',
    host: process.env.NEO4J_HOST || 'localhost',
    port: process.env.NEO4J_5_PORT || '7687',
    user: process.env.NEO4J_USER || 'neo4j',
    database: process.env.NEO4J_DATABASE || 'neo4j',
    password: process.env.NEO4J_PASSWORD || 'password',
  };
}

export function rangeToString(range: vscode.Range) {
  return `${range.start.line}:${range.start.character} to ${range.end.line}:${range.end.character}`;
}

export function documentationToString(
  doc: string | vscode.MarkdownString | undefined,
) {
  if (typeof doc === 'string') {
    return doc;
  } else if (typeof doc === 'undefined') {
    return 'undefined';
  } else {
    return doc.value;
  }
}

export function tagsToString(
  doc: readonly vscode.CompletionItemTag[] | undefined,
) {
  if (!doc) {
    return 'undefined';
  } else {
    return doc.map((tag) => tag.toString()).join(', ');
  }
}

export function parameterLabelToString(label: string | [number, number]) {
  if (Array.isArray(label)) {
    return `${label[0]}:${label[1]}`;
  } else {
    return label;
  }
}

export async function toggleLinting(value: boolean) {
  const config = vscode.workspace.getConfiguration('neo4j.features');
  await config.update('linting', value, vscode.ConfigurationTarget.Global);
}

export function getExtensionStoragePath(): string {
  const extensionId = 'neo4j-extensions.neo4j-for-vscode';
  const platform = os.platform();

  let userDataDir: string;

  if (platform === 'darwin') {
    // macOS
    userDataDir = path.join(
      os.homedir(),
      'Library',
      'Application Support',
      'Code',
    );
  } else if (platform === 'win32') {
    // Windows
    const appData =
      process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    userDataDir = path.join(appData, 'Code');
  } else {
    // Linux
    userDataDir = path.join(os.homedir(), '.config', 'Code');
  }

  return path.join(userDataDir, 'User', 'globalStorage', extensionId);
}
