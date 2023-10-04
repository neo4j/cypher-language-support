import { CompletionItemKind } from 'vscode-languageserver-types';
import {
  testCompletionContains,
  testCompletionDoesNotContain,
} from './completion-assertion-helpers';

describe('expression completions', () => {
  describe('misc expression tests', () => {
    test('Can offer keyword literals in expressions when appropriate', () => {
      const query = 'MATCH (n:Person) WHERE n.name = N';

      testCompletionContains({
        query,
        expected: [
          { label: 'NAN', kind: CompletionItemKind.Keyword },
          { label: 'NULL', kind: CompletionItemKind.Keyword },
        ],
      });
    });

    test('Does not incorrectly offer keywords when building string', () => {
      const query = 'MATCH (n:Person) WHERE n.name = "N';

      testCompletionDoesNotContain({
        query,
        excluded: [
          { label: 'NONE', kind: CompletionItemKind.Keyword },
          { label: 'NULL', kind: CompletionItemKind.Keyword },
          { label: 'UnescapedSymbolicName', kind: CompletionItemKind.Keyword },
          { label: 'EscapedSymbolicName', kind: CompletionItemKind.Keyword },
        ],
      });
    });
  });
});
