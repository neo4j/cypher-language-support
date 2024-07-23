import { _Connection } from 'vscode-languageserver';
import { ExtensionRuntime } from './extensionRuntime';
import { RuntimeStrategy } from './runtimeStrategy';
import { StandaloneRuntime } from './standaloneRuntime';

export function getRuntime(
  clientName: string,
  connection: _Connection,
): RuntimeStrategy {
  switch (clientName) {
    case 'Visual Studio Code':
      return new ExtensionRuntime(connection);
    default:
      return new StandaloneRuntime(connection);
  }
}
