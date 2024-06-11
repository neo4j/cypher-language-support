/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Extension,
  ExtensionContext,
  ExtensionMode,
  GlobalEnvironmentVariableCollection,
  Memento,
  Uri,
} from 'vscode';
import { InMemoryMemento } from './inMemoryMemento';
import { InMemorySecretStorage } from './inMemorySecretStorage';

export class MockExtensionContext implements ExtensionContext {
  subscriptions: { dispose(): any }[] = [];
  workspaceState: Memento;
  globalState = new InMemoryMemento();
  secrets = new InMemorySecretStorage();
  extensionUri: Uri;
  extensionPath: string;
  environmentVariableCollection: GlobalEnvironmentVariableCollection;
  asAbsolutePath(relativePath: string): string {
    throw new Error('Method not implemented.');
  }
  storageUri: Uri;
  storagePath: string;
  globalStorageUri: Uri;
  globalStoragePath: string;
  logUri: Uri;
  logPath: string;
  extensionMode: ExtensionMode;
  extension: Extension<any>;
}
