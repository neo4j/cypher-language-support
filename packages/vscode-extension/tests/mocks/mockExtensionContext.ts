import {
  Extension,
  ExtensionContext,
  ExtensionMode,
  EnvironmentVariableCollection,
  Memento,
  Uri,
} from 'vscode';
import { InMemoryMemento } from './inMemoryMemento';
import { InMemorySecretStorage } from './inMemorySecretStorage';
import { getExtensionStoragePath } from '../helpers';

export class MockExtensionContext implements ExtensionContext {
  subscriptions: { dispose(): unknown }[] = [];
  workspaceState: Memento;
  globalState = new InMemoryMemento();
  secrets = new InMemorySecretStorage();
  extensionUri: Uri;
  extensionPath: string;
  environmentVariableCollection: EnvironmentVariableCollection;
  asAbsolutePath(relativePath: string): string {
    return relativePath;
  }
  storageUri: Uri;
  storagePath: string;
  globalStorageUri: Uri = Uri.file(getExtensionStoragePath());
  globalStoragePath: string;
  logUri: Uri;
  logPath: string;
  extensionMode: ExtensionMode;
  extension: Extension<unknown>;
}
