import { Diagnostic } from 'vscode-languageserver-types';

import { parserCache } from '../parserCache';

export function validateSyntax(wholeFileText: string): Diagnostic[] {
  const result = parserCache.parse(wholeFileText);
  return result.diagnostics;
}
