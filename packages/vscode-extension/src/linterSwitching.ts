import {
  getTaggedRegistryVersions,
  linterFileToServerVersion,
  NpmRelease,
  serverVersionToLinter,
} from '@neo4j-cypher/lint-worker';
import axios from 'axios';
import { getExtensionContext, getSchemaPoller } from './contextService';
import * as vscode from 'vscode';
import * as tar from 'tar';
import { sendNotificationToLanguageClient } from './languageClientService';
import { linterStatusBarItem } from './extension';
import { CONSTANTS } from './constants';
import { pipeline } from 'stream/promises';

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

/**
 * Attempts to download the latest linter of version $linterVersion,
 * saving the file as "$linterVersion-lintWorker-$npmVersion.cjs"
 * returning the name of the file saved if successful, and a blank string otherwise
 */
export async function downloadLintWorker(
  linterVersion: string,
  storageUri: vscode.Uri,
  npmReleases: NpmRelease[],
): Promise<boolean> {
  void vscode.window.showInformationMessage(
    'Downloading linter for your server',
  );

  const newestLegacyLinter = npmReleases?.find(
    (release) => release.tag === `neo4j-${linterVersion}`,
  );
  if (!newestLegacyLinter) {
    void vscode.window.showErrorMessage(
      CONSTANTS.MESSAGES.LINTER_DOWNLOAD_FAILED,
    );
    return false;
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
    await deleteOutdatedLinters(linterVersion, fileName, storageUri);
    return true;
  } catch (error) {
    void vscode.window.showErrorMessage(
      CONSTANTS.MESSAGES.LINTER_DOWNLOAD_FAILED,
    );
    return false;
  }
}

//checking metadata of file, just to see if the file is there
export async function fileExists(fileUri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(fileUri);
    return true;
  } catch (e) {
    return false;
  }
}

export async function dynamicallyAdjustLinter(): Promise<void> {
  const poller = getSchemaPoller();
  if (poller) {
    const serverVersion = poller.connection?.serverVersion;

    if (serverVersion) {
      //since not every release has a linter release
      const linterVersion = serverVersionToLinter(serverVersion);
      const npmReleases = await getTaggedRegistryVersions();
      await switchToLinter(linterVersion, npmReleases);
    }
  }
}

async function expectedLinterExists(
  linterVersion: string,
  npmReleases: NpmRelease[],
  storageUri: vscode.Uri,
): Promise<{ expectedFileName: string; isExpectedLinterDownloaded: boolean }> {
  const newestLegacyLinter = npmReleases.find(
    (release) => release.tag === `neo4j-${linterVersion}`,
  );
  const expectedFileName = `${linterVersion}-lintWorker-${newestLegacyLinter.version}.cjs`;
  const expectedUri = vscode.Uri.joinPath(storageUri, expectedFileName);
  const isExpectedLinterDownloaded = await fileExists(expectedUri);
  return { expectedFileName, isExpectedLinterDownloaded };
}

export async function switchToLinter(
  linterVersion: string,
  npmReleases: NpmRelease[],
): Promise<void> {
  try {
    if (linterVersion === 'Default') {
      return await switchWorkerOnLanguageServer();
    }
    if (npmReleases.length === 0) {
      await switchToLocalLinter(linterVersion);
    } else {
      const storageUri = await getStorageUri();
      const { expectedFileName, isExpectedLinterDownloaded } =
        await expectedLinterExists(linterVersion, npmReleases, storageUri);
      if (isExpectedLinterDownloaded) {
        await switchWorkerOnLanguageServer(expectedFileName, storageUri);
      } else {
        const success = await downloadLintWorker(
          linterVersion,
          storageUri,
          npmReleases,
        );
        if (success) {
          await switchWorkerOnLanguageServer(expectedFileName, storageUri);
        } else {
          await switchToLocalLinter(linterVersion);
        }
      }
    }
  } catch (e) {
    // In case of error use default linter (i.e. the one included with the language server)
    await switchWorkerOnLanguageServer();
  }
}

export async function switchToLocalLinter(
  linterVersion: string,
): Promise<void> {
  const fileNames = await getFilesInExtensionStorage();
  const downloadedLinterVersions: Record<string, string> = Object.fromEntries(
    fileNames
      .map((name) => [linterFileToServerVersion(name), name])
      .filter(
        (v): v is [string, string] => v !== undefined && v[0] !== undefined,
      ),
  );
  const matchingFile = downloadedLinterVersions[linterVersion];
  const storageUri = await getStorageUri();
  if (matchingFile) {
    await switchWorkerOnLanguageServer(matchingFile, storageUri);
  } else {
    await switchWorkerOnLanguageServer();
  }
}

async function getStorageUri(): Promise<vscode.Uri> {
  const storageUri = getExtensionContext().globalStorageUri;
  await vscode.workspace.fs.createDirectory(storageUri);
  return storageUri;
}
