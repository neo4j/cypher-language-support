import {
  Extension,
  ExtensionContext,
  ExtensionMode,
  GlobalEnvironmentVariableCollection,
  LanguageModelAccessInformation,
  Memento,
  Uri,
} from 'vscode';
import { InMemoryMemento } from './inMemoryMemento';
import { InMemorySecretStorage } from './inMemorySecretStorage';

export class MockExtensionContext implements ExtensionContext {
  languageModelAccessInformation: LanguageModelAccessInformation;
  subscriptions: { dispose(): unknown }[] = [];
  workspaceState: Memento;
  globalState = new InMemoryMemento();
  secrets = new InMemorySecretStorage();
  extensionUri: Uri;
  extensionPath: string;
  environmentVariableCollection: GlobalEnvironmentVariableCollection;
  asAbsolutePath(relativePath: string): string {
    return relativePath;
  }
  storageUri: Uri;
  storagePath: string;
  globalStorageUri: Uri;
  globalStoragePath: string;
  logUri: Uri;
  logPath: string;
  extensionMode: ExtensionMode;
  extension: Extension<unknown>;
}
