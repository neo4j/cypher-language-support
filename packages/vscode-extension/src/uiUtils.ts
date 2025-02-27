import { ConnnectionResult } from '@neo4j-cypher/schema-poller';
import { window } from 'vscode';
import { Connection } from './connectionService';
import { CONSTANTS } from './constants';
import { ConnectionItem } from './treeviews/connectionTreeDataProvider';

/**
 * Utility function to manage what type of message type to display to the user based on the result of a connection attempt.
 * @param connection The Connection that was tried.
 * @param result The result of the connection attempt.
 */
export function displayMessageForConnectionResult(
  connection: Connection | null,
  result: ConnnectionResult,
): void {
  if (!connection) {
    return;
  }

  if (result.success && connection.state !== 'inactive') {
    void window.showInformationMessage(CONSTANTS.MESSAGES.CONNECTED_MESSAGE);
  } else if (result.success && connection.state === 'inactive') {
    void window.showInformationMessage(CONSTANTS.MESSAGES.DISCONNECTED_MESSAGE);
  } else if (!result.success && !result.retriable) {
    void window.showErrorMessage(
      `${result.error?.message}. ${result.error?.friendlyMessage}.`,
    );
  } else {
    void window.showWarningMessage(
      `${result.error?.message}. ${result.error?.friendlyMessage}.`,
    );
  }
}

/**
 * Utility function to prompt the user to save a connection that failed with a retriable error.
 * @returns A promise that resolves with the result of the prompt ("Yes" or null).
 */
export async function displaySaveConnectionAnywayPrompt(
  detail?: string,
): Promise<string | null> {
  return await window.showWarningMessage<string>(
    'Unable to connect to Neo4j. Would you like to save the connection anyway?',
    {
      modal: true,
      detail: detail,
    },
    'Yes',
  );
}

/**
 * Utility function to prompt the user whether they're sure they want to delete a Connection.
 * @param connectionItem The ConnectionItem to prompt for deletion.
 * @returns A promise that resolves with the result of the prompt ("Yes" or null).
 */
export async function displayConfirmConnectionDeletionPrompt(
  connectionItem: ConnectionItem,
): Promise<string | null> {
  return await window.showWarningMessage<string>(
    `Are you sure you want to delete connection ${connectionItem.label}?`,
    { modal: true },
    'Yes',
  );
}

/**
 * Utility function to display a message to the user based on the result of switching databases.
 * @param database The database that was switched to.
 * @param result The result of the switch database attempt.
 */
export function displayMessageForSwitchDatabaseResult(
  database: string,
  result: ConnnectionResult,
): void {
  result.success
    ? void window.showInformationMessage(
        `${CONSTANTS.MESSAGES.SUCCESSFULLY_SWITCHED_DATABASE_MESSAGE} '${database}'.`,
      )
    : void window.showErrorMessage(
        `${CONSTANTS.MESSAGES.ERROR_SWITCHING_DATABASE_MESSAGE} '${database}'. ${result.error?.message}. ${result.error?.friendlyMessage}.`,
      );
}
