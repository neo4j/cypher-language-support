import { ConnnectionResult } from '@neo4j-cypher/schema-poller';
import { window } from 'vscode';
import { Connection } from './connectionService';
import { CONSTANTS } from './constants';

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
