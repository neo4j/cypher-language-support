import { Connection } from '../../connectionService';
import { WebViewMessage } from '../connectionPanel';

interface vscode {
  postMessage(message: WebViewMessage): void;
}

declare const vscode: vscode;

export function validateConnection(
  connection: Connection,
  password: string,
): boolean {
  return (
    !!connection.key &&
    !!connection.name &&
    !!connection.scheme &&
    !!connection.host &&
    !!connection.port &&
    !!connection.user &&
    !!connection.database &&
    !!password
  );
}

export function getConnection(): Connection {
  const key = document.getElementById('key') as HTMLInputElement;
  const scheme = document.getElementById('scheme') as HTMLInputElement;
  const host = document.getElementById('host') as HTMLInputElement;
  const port = document.getElementById('port') as HTMLInputElement;
  const user = document.getElementById('user') as HTMLInputElement;
  const database = document.getElementById('database') as HTMLInputElement;
  const connect = document.getElementById('connect') as HTMLInputElement;

  return {
    key: key.value,
    name: 'Default connection',
    scheme: scheme.value,
    host: host.value,
    port: port.value,
    user: user.value,
    database: database.value,
    connect: connect.value === 'true',
  };
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

document.getElementById('test-connection').addEventListener('click', () => {
  const connection = getConnection();
  const password = getPassword();

  if (!validateConnection(connection, password)) {
    vscode.postMessage({
      command: 'onValidationError',
    });
  } else {
    vscode.postMessage({
      command: 'onTestConnection',
      connection: connection,
      password: password,
    });
  }
});
