import { Connection, Scheme } from '../../connectionService';
import { ConnectionPanelMessage } from '../connectionPanel';

interface vscode {
  postMessage(message: ConnectionPanelMessage): void;
}

declare const vscode: vscode;

/**
 * These functions are all bundled into an IIFE with esbuild and injected into the webview as a script.
 */

/**
 * Validates a Connection object and a password from the webview form.ƒ
 * @param connection The Connection object to validate. Only scheme, host, user, and password are required.
 * @param password The password to validate.
 * @returns True if the connection is valid, false otherwise.
 */
export function validateConnection(
  connection: Connection | null,
  password: string,
): boolean {
  highlightInvalidFields();
  return (
    !connection ||
    (!!connection.scheme &&
      !!connection.host &&
      !!connection.user &&
      !!password)
  );
}

/**
 * Highlights any invalid fields in the webview form by toggling the invalid class.
 * Only scheme, host, user, and password are required.
 */
export function highlightInvalidFields(): void {
  const scheme = document.getElementById('scheme') as HTMLInputElement;
  const host = document.getElementById('host') as HTMLInputElement;
  const user = document.getElementById('user') as HTMLInputElement;
  const password = document.getElementById('password') as HTMLInputElement;

  scheme.classList.toggle(
    'invalid',
    !scheme.value || !isValidScheme(scheme.value),
  );
  host.classList.toggle('invalid', !host.value);
  user.classList.toggle('invalid', !user.value);
  password.classList.toggle('invalid', !password.value);
}

/**
 * @returns A Connection object from the webview form.
 */
export function getConnection(): Connection | null {
  const key = document.getElementById('key') as HTMLInputElement;
  const scheme = document.getElementById('scheme') as HTMLInputElement;
  const host = document.getElementById('host') as HTMLInputElement;
  const port = document.getElementById('port') as HTMLInputElement;
  const user = document.getElementById('user') as HTMLInputElement;
  const database = document.getElementById('database') as HTMLInputElement;

  if (!isValidScheme(scheme.value)) {
    return null;
  }

  return {
    key: key.value,
    name: 'Default connection',
    scheme: scheme.value,
    host: host.value,
    port: port.value,
    user: user.value,
    database: database.value,
    connect: true,
    state: 'connecting',
  };
}

/**
 * Guard function to validate a string is a Scheme.
 * @param scheme A string to validate as a Scheme.
 * @returns True if the string is a valid Scheme, false otherwise.
 */
export function isValidScheme(scheme: string): scheme is Scheme {
  return ['neo4j', 'neo4j+s', 'bolt', 'bolt+s'].includes(scheme);
}

/**
 * @returns The password from the webview form.
 */
export function getPassword(): string {
  const password = document.getElementById('password') as HTMLInputElement;
  return password.value;
}

/**
 * Handles the form submission event by validating the connection and password and invoking the appropriate command via the vscode API.
 * If the connection is valid, the connection and password are sent to the extension.
 * If the connection is invalid, a validation error is sent to the extension.
 * @param event The form submission event.
 * @returns False to prevent the default form submission behavior.
 */
export function onSubmit(event: Event): boolean {
  event.preventDefault();

  const connection = getConnection();
  const password = getPassword();

  if (!validateConnection(connection, password)) {
    vscode.postMessage({
      command: 'onValidationError',
    });
    return false;
  } else {
    vscode.postMessage({
      command: 'onSaveConnection',
      connection: connection,
      password: password,
    });
  }
}

/**
 * Adds an event listener to the form submission event.
 */
addEventListener('submit', (event) => onSubmit(event));
