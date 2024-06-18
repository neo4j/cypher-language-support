import { Connection, Scheme } from '../../connectionService';
import { ConnectionPanelMessage } from '../connectionPanel';

interface vscode {
  postMessage(message: ConnectionPanelMessage): void;
}

declare const vscode: vscode;

export function validateConnection(
  connection: Connection | null,
  password: string,
): boolean {
  highlightInvalidFields();
  return (
    !connection ||
    (!!connection.scheme &&
      !!connection.host &&
      !!connection.database &&
      !!connection.user &&
      !!password)
  );
}

export function highlightInvalidFields(): void {
  const scheme = document.getElementById('scheme') as HTMLInputElement;
  const host = document.getElementById('host') as HTMLInputElement;
  const user = document.getElementById('user') as HTMLInputElement;
  const database = document.getElementById('database') as HTMLInputElement;
  const password = document.getElementById('password') as HTMLInputElement;

  scheme.classList.toggle(
    'invalid',
    !scheme.value || !isValidScheme(scheme.value),
  );
  host.classList.toggle('invalid', !host.value);
  database.classList.toggle('invalid', !database.value);
  user.classList.toggle('invalid', !user.value);
  password.classList.toggle('invalid', !password.value);
}

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

export function isValidScheme(scheme: string): scheme is Scheme {
  return ['neo4j', 'neo4j+s', 'bolt', 'bolt+s'].includes(scheme);
}

export function getPassword(): string {
  const password = document.getElementById('password') as HTMLInputElement;
  return password.value;
}

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

addEventListener('submit', (event) => onSubmit(event));
