import {
  getTaggedRegistryVersions,
  linterFileToServerVersion,
  NpmRelease,
  serverVersionToLinter,
} from '@neo4j-cypher/lint-worker';
import { getSchemaPoller } from './contextService';
import * as vscode from 'vscode';
import { CONSTANTS } from './constants';
import {
  downloadLintWorker,
  getFilesInExtensionStorage,
  getStorageUri,
  switchWorkerOnLanguageServer,
} from './linterService';

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
      const { linterVersion, notResolved, notSupported } =
        serverVersionToLinter(serverVersion);

      if (notResolved) {
        void vscode.window.showWarningMessage(
          CONSTANTS.MESSAGES.LINTER_SERVER_NOT_RESOLVED,
        );
      } else if (notSupported) {
        void vscode.window.showWarningMessage(
          CONSTANTS.MESSAGES.LINTER_SERVER_NOT_SUPPORTED,
        );
      }

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
  const expectedFileName = `${linterVersion}-lintWorker-${newestLegacyLinter?.version}.cjs`;
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
  if (matchingFile) {
    const storageUri = await getStorageUri();
    await switchWorkerOnLanguageServer(matchingFile, storageUri);
  } else {
    await switchWorkerOnLanguageServer();
  }
}
