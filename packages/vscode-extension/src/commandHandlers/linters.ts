import {
  compareMajorMinorVersions,
  getTaggedRegistryVersions,
  linterFileToServerVersion,
  npmTagToLinterVersion,
} from '@neo4j-cypher/lint-worker';
import { getFilesInExtensionStorage, switchToLinter } from '../linterSwitching';
import { window } from 'vscode';

/**
 * Handler for SWITCH_LINTWORKER_COMMAND (neo4j.editLinter)
 * This can be triggered on the connection tree view, through the status bar or via the command palette.
 * Triggering shows a list of available linters. Picking one switches the linter used.
 * @returns A promise that resolves when the handler has completed.
 */
export async function manuallyAdjustLinter(): Promise<void> {
  const npmReleases = await getTaggedRegistryVersions();
  const fileNames = await getFilesInExtensionStorage();
  const npmLinterVersions = npmReleases.map((release) =>
    npmTagToLinterVersion(release.tag),
  );
  const existingVersions = fileNames.map((name) =>
    linterFileToServerVersion(name),
  );
  const allVersions = new Set(
    existingVersions.concat(npmLinterVersions).filter((v) => v !== undefined),
  );
  // This is to show Default on top and then the versions in decreasing order
  const sanitizedVersions = [
    'Default',
    ...Array.from(allVersions).sort(compareMajorMinorVersions).reverse(),
  ];
  const picked = await window.showQuickPick(sanitizedVersions, {
    placeHolder: 'Select Cypher linter version',
  });
  //closing the quickpick menu will return undefined
  if (picked === undefined) {
    return;
  }
  await switchToLinter(picked, npmReleases);
}
