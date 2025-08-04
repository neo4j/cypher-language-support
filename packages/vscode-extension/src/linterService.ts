import {
  linterFileToServerVersion,
  NpmRelease,
} from '@neo4j-cypher/lint-worker';
import { getExtensionContext } from './contextService';
import * as vscode from 'vscode';
import { sendNotificationToLanguageClient } from './languageClientService';
import { linterStatusBarItem } from './extension';
import { CONSTANTS } from './constants';
import axios from 'axios';
import * as tar from 'tar';
import { pipeline } from 'stream/promises';

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

export async function getStorageUri(): Promise<vscode.Uri> {
  const storageUri = getExtensionContext().globalStorageUri;
  await vscode.workspace.fs.createDirectory(storageUri);
  return storageUri;
}

/**
 * Attempts to download the latest linter of version $linterVersion,
 * saving the file as "$linterVersion-lintWorker-$npmVersion.cjs"
 * returning the name of the file saved if successful, and a blank string otherwise
 */
export async function downloadLintWorker(
  linterVersion: string,
  storageUri: vscode.Uri,
  npmReleases: NpmRelease[],
): Promise<{ success: false } | { success: true; fileName?: string }> {
  void vscode.window.showInformationMessage(
    `Downloading linter ${linterVersion} for your server`,
  );

  const newestLegacyLinter = npmReleases?.find(
    (release) => release.tag === `neo4j-${linterVersion}`,
  );
  if (!newestLegacyLinter) {
    void vscode.window.showErrorMessage(
      CONSTANTS.MESSAGES.LINTER_VERSION_NOT_AVAILABLE,
    );
    return { success: false };
  }
  const fileName = `${linterVersion}-lintWorker-${newestLegacyLinter.version}.cjs`;
  const fileUri = vscode.Uri.joinPath(storageUri, fileName);

  const downloadUrl = `https://registry.npmjs.org/@neo4j-cypher/lint-worker/-/lint-worker-${newestLegacyLinter.version}.tgz`;
  try {
    const response = await axios.get(downloadUrl, { responseType: 'stream' });
    await pipeline(
      response.data,
      tar.x({
        cwd: storageUri.fsPath,
        filter: (path) => path === 'package/dist/cjs/lintWorker.cjs',
      }),
    );

    const extractedUri = vscode.Uri.joinPath(
      storageUri,
      'package',
      'dist',
      'cjs',
      'lintWorker.cjs',
    );
    const newFolderUri = vscode.Uri.joinPath(storageUri, 'package');
    await vscode.workspace.fs.rename(extractedUri, fileUri, {
      overwrite: true,
    });
    await vscode.workspace.fs.delete(newFolderUri, { recursive: true });
    return { success: true, fileName: fileName };
  } catch (error) {
    void vscode.window.showErrorMessage(
      CONSTANTS.MESSAGES.LINTER_DOWNLOAD_FAILED,
    );
    return { success: false };
  }
}

export async function deleteOutdatedLinters(
  linterVersion: string,
  newFile: string,
  storageUri: vscode.Uri,
) {
  const fileNames = await getFilesInExtensionStorage();
  const outDatedLinters: Record<string, string> = Object.fromEntries(
    fileNames
      .map((name) => [linterFileToServerVersion(name), name])
      .filter(
        (v): v is [string, string] =>
          v !== undefined &&
          v.length === 2 &&
          v[0] === linterVersion &&
          v[1] !== newFile,
      ),
  );
  for (const [, fileName] of Object.entries(outDatedLinters)) {
    await vscode.workspace.fs.delete(vscode.Uri.joinPath(storageUri, fileName));
  }
}
