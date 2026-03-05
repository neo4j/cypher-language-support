import { ExtensionContext, Uri } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
} from 'vscode-languageclient/browser';

let client: LanguageClient;

export async function activate(context: ExtensionContext) {
  const serverMain = Uri.joinPath(
    context.extensionUri,
    'dist',
    'browserServerMain.js',
  );
  const worker = new Worker(serverMain.toString(true));

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ language: 'cypher' }],
  };

  client = new LanguageClient(
    'neo4j',
    'Cypher Language Client',
    clientOptions,
    worker,
  );

  await client.start();
}

export async function deactivate(): Promise<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
