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
import { CONSTANTS } from './constants';
import { pipeline } from 'stream/promises';
import {
  getFilesInExtensionStorage,
  switchToLocalLinter,
  switchWorkerOnLanguageServer,
} from './linterService';

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
    `Downloading linter ${linterVersion} for your server`,
  );

  const newestLegacyLinter = npmReleases?.find(
    (release) => release.tag === `neo4j-${linterVersion}`,
  );
  if (!newestLegacyLinter) {
    void vscode.window.showErrorMessage(
      CONSTANTS.MESSAGES.LINTER_VERSION_NOT_AVAILABLE,
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

async function getStorageUri(): Promise<vscode.Uri> {
  const storageUri = getExtensionContext().globalStorageUri;
  await vscode.workspace.fs.createDirectory(storageUri);
  return storageUri;
}
