import { MarkupContent } from 'vscode-languageserver-types';

export function getDocString(result: string | MarkupContent): string {
  if (MarkupContent.is(result)) {
    return result.value;
  } else {
    return result;
  }
}
