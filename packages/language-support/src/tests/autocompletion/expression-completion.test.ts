import { CompletionItemKind } from 'vscode-languageserver-types';
import { testCompletions } from './completion-assertion-helpers';

describe('expression completions', () => {
  describe('misc expression tests', () => {
    test('Can offer keyword literals in expressions when appropriate', () => {
      const query = 'MATCH (n:Person) WHERE n.name = N';

      testCompletions({
        query,
        expected: [
          { label: 'NAN', kind: CompletionItemKind.Keyword },
          { label: 'NULL', kind: CompletionItemKind.Keyword },
        ],
      });
    });

    test('Does not incorrectly offer keywords when building string', () => {
      const query = 'MATCH (n:Person) WHERE n.name = "N';

      testCompletions({
        query,
        excluded: [
          { label: 'NONE', kind: CompletionItemKind.Keyword },
          { label: 'NULL', kind: CompletionItemKind.Keyword },
          { label: 'UnescapedSymbolicName', kind: CompletionItemKind.Keyword },
          { label: 'EscapedSymbolicName', kind: CompletionItemKind.Keyword },
        ],
      });
    });

    test('Completes expression in a multiline query', () => {
      const query = `MATCH (n) WHERE n:A|B AND n.name = 'foo'
                     CALL {
                        MATCH (n) WHERE n:A|AND 
      `;

      expect(
        testCompletionContains({
          query: query,
          expected: [{ label: 'AND', kind: CompletionItemKind.Keyword }],
        }),
      );
    });
  });
});
