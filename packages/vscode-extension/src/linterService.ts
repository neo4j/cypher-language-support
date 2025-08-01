import { linterFileToServerVersion } from '@neo4j-cypher/lint-worker';
import { getExtensionContext } from './contextService';
import * as vscode from 'vscode';
import { sendNotificationToLanguageClient } from './languageClientService';
import { linterStatusBarItem } from './extension';
import { CONSTANTS } from './constants';

export async function getFilesInExtensionStorage(): Promise<string[]> {
  const storageUri = await getStorageUri();
  try {
    const entries = await vscode.workspace.fs.readDirectory(storageUri);
    return entries
      .filter(([, fileType]) => fileType === vscode.FileType.File)
      .map(([name]) => name);
  } catch (err) {
    void vscode.window.showErrorMessage(
      CONSTANTS.MESSAGES.GLOBALSTORAGE_READ_FAILED,
    );
    return [];
  }
}

/**
 * Notifies the language client it should switch linter. Calling without defining parameters
 * is a sign to the language server to use the default linter packaged in the extension.
 * @param fileName The name of the linter file, e.g. "5.20.0-lintWorker-0.0.0.cjs".
 * @param storageUri The uri pointing to the vscode global storage of the extension.
 */
export async function switchWorkerOnLanguageServer(
  fileName?: string,
  storageUri?: vscode.Uri,
) {
  const linterPath =
    fileName && storageUri
      ? vscode.Uri.joinPath(storageUri, fileName).fsPath
      : undefined;
  const linterVersion = linterFileToServerVersion(fileName);
  await sendNotificationToLanguageClient('updateLintWorker', {
    lintWorkerPath: linterPath,
    linterVersion: linterVersion,
  });
  linterStatusBarItem.text = linterVersion ? linterVersion : 'Default';
}

async function getStorageUri(): Promise<vscode.Uri> {
  const storageUri = getExtensionContext().globalStorageUri;
  await vscode.workspace.fs.createDirectory(storageUri);
  return storageUri;
}
