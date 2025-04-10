import * as fs from 'fs';
import * as https from 'https';
import os from 'os';
import * as path from 'path';
import * as tar from 'tar';
import { ExtensionContext, window, workspace } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';
import {
  disconnectDatabaseConnectionOnExtensionDeactivation,
  reconnectDatabaseConnectionOnExtensionActivation,
} from './connectionService';
import { setContext, setLanguageClient } from './contextService';
import { sendParametersToLanguageServer } from './parameterService';
import { registerDisposables } from './registrationService';

let client: LanguageClient;
let serverVersion: string;
let extensionContext: ExtensionContext;

const LANG_SERVER_BASE_DIR = path.join(os.homedir(), '.neo4jLang');

//TODO: Remove logging after testing
export async function downloadLanguageServer(version: string): Promise<string> {
  const downloadUrl = `https://registry.npmjs.org/@neo4j-cypher/language-server/-/language-server-${version}.tgz`;
  const destDir = path.join(LANG_SERVER_BASE_DIR, version);

  if (fs.existsSync(destDir)) {
    //console.log(`Language server ${version} already downloaded.`);
    return destDir;
  } else {
    //TODO: Make sure this doesnt pop up on startup when connected to a different server
    //think we had this bug
    //TODO: Update this message to contain info about neo-version, maybe
    //"The newest language server on neo4j version x's release was ...
    // Would you like to download and use this version"

    //Maybe we should even allow user to manually select from versions they have? or
    //maybe just let them choose to use newest if they dont mind
    //And maybe add something like "dont remind me again?"
    //Will be very annoying if we popup every time just for user to press no
    //Standard: Yes / No / Dont remind me
    const choice = await window.showInformationMessage(
      `The language server for Neo4j version ${version} is not installed. Do you want to download it now?`,
      'Yes',
      'No',
    );
    if (choice !== 'Yes') {
      return undefined;
    }
  }

  await fs.promises.mkdir(destDir, { recursive: true });

  //console.log(`Downloading language server version ${version} from ${downloadUrl}`);

  await new Promise<void>((resolve, reject) => {
    https
      .get(downloadUrl, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download: ${res.statusCode}`));
          return;
        }

        const extractor = tar.extract({
          cwd: destDir,
          strip: 1,
        });

        res.pipe(extractor as unknown as NodeJS.WritableStream);

        extractor.on('finish', resolve);
        extractor.on('error', reject);
      })
      .on('error', reject);
  });

  //console.log(`Downloaded and extracted to ${destDir}`);
  return destDir;
}

// Options to control the language client
const clientOptions: LanguageClientOptions = {
  // Register the server for Cypher text documents
  documentSelector: [{ language: 'cypher' }],
  synchronize: {
    // Notify the server about file changes to '.clientrc files contained in the workspace
    fileEvents: workspace.createFileSystemWatcher('**/.clientrc'),
  },
};

export async function setClient(version: string) {
  if (serverVersion === version) {
    return;
  } else {
    serverVersion = version;
  }

  const destFolder = await downloadLanguageServer(`2.0.0-next.${version}`);
  //const destFolder = path.join(LANG_SERVER_BASE_DIR, `2.0.0-next.${version}`);

  let runServer: string;
  let debugServer: string;
  //If the user has not downloaded the matching server version
  if (!destFolder) {
    runServer = extensionContext.asAbsolutePath(
      path.join('dist', 'cypher-language-server.js'),
    );
    debugServer = extensionContext.asAbsolutePath(
      path.join('..', 'language-server', 'dist', 'server.js'),
    );
  } else {
    const serverPath = path.join(destFolder, 'dist', 'cypher-language-server');
    runServer = serverPath;
    debugServer = serverPath;
  }

  //path.join(LANG_SERVER_BASE_DIR, "cypher-language-server-" + version + ".js");

  //path.join(LANG_SERVER_BASE_DIR, "cypher-language-server-" + version + ".js");

  if (client) {
    await client.stop();
  }

  const serverOptions: ServerOptions = {
    run: { module: runServer, transport: TransportKind.ipc },
    debug: {
      module: debugServer,
      transport: TransportKind.ipc,
      options: { env: { CYPHER_25: 'true' } },
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    'neo4j',
    'Cypher Language Client',
    serverOptions,
    clientOptions,
  );

  setLanguageClient(client);

  // Start the client. This will also launch the server
  await client.start();
  await sendParametersToLanguageServer();
}

// function currentWorkspaceFolder(): WorkspaceFolder | undefined {
//   const activeEditorUri = window.activeTextEditor?.document.uri;
//   if (activeEditorUri) {
//     return workspace.getWorkspaceFolder(activeEditorUri);
//   }
//   return workspace.workspaceFolders?.[0];
// }

// function serverDir(target: ConfigurationTarget): string {
//   const workspaceFolder = currentWorkspaceFolder();
//   if (target == ConfigurationTarget.Workspace && workspaceFolder) {
//     const wsDir = workspaceFolder.uri.fsPath;
//     return path.join(wsDir, ".neo4jLang");
//   } else {
//     return path.join(os.homedir(), ".neo4jLang");
//   }
// }

export async function activate(context: ExtensionContext) {
  extensionContext = context;
  // Register disposables
  // Command handlers and view registrations
  extensionContext.subscriptions.push(...registerDisposables());

  setContext(extensionContext, client);

  await setClient('19');

  // Handle any sequence events for activation
  await reconnectDatabaseConnectionOnExtensionActivation();
  //await sendParametersToLanguageServer();

  // setContext(context, client);

  // // Register disposables
  // // Command handlers and view registrations
  // context.subscriptions.push(...registerDisposables());

  // // Start the client. This will also launch the server
  // await client.start();

  // // Handle any sequence events for activation
  // await reconnectDatabaseConnectionOnExtensionActivation();
  // await sendParametersToLanguageServer();
}

export async function deactivate(): Promise<void> | undefined {
  // Handle any sequence events for deactivation
  await disconnectDatabaseConnectionOnExtensionDeactivation();

  if (!client) {
    return undefined;
  }

  return client.stop();
}
