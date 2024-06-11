import { ExtensionContext } from 'vscode';
import { LanguageClient } from 'vscode-languageclient/node';

let _context: ExtensionContext | undefined;
let _languageClient: LanguageClient | undefined;

export function setAppContext(
  context: ExtensionContext,
  languageClient: LanguageClient,
) {
  _context = context;
  _languageClient = languageClient;
}

export function getContext(): ExtensionContext {
  if (!_context) {
    throw new Error('Context is undefined');
  }
  return _context;
}

export function getLanguageClient(): LanguageClient {
  if (!_languageClient) {
    throw new Error('Language client is undefined');
  }
  return _languageClient;
}
