import { Diagnostic } from 'vscode-languageserver-types';

import { parserWrapper } from '../parserWrapper';

export function validateSyntax(wholeFileText: string): Diagnostic[] {
  const result = parserWrapper.parse(wholeFileText);
  return result.diagnostics;
}
