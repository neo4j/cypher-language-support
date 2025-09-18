import { CompletionItemKind } from 'vscode-languageserver-types';
import { testCompletions } from './completionAssertionHelpers';
import { SymbolTable } from '../../types';

const dbSchema = {
  labels: ['Pokemon', 'Trainer', 'Gym', 'Type', 'Move'],
  relationshipTypes: ['CATCHES', 'TRAINS', 'BATTLES', 'KNOWS', 'WEAK_TO'],
  graphSchema: [
    { from: 'Trainer', relType: 'CATCHES', to: 'Pokemon' },
    { from: 'Trainer', relType: 'TRAINS', to: 'Pokemon' },
    { from: 'Trainer', relType: 'BATTLES', to: 'Trainer' },
    { from: 'Pokemon', relType: 'KNOWS', to: 'Move' },
    { from: 'Pokemon', relType: 'WEAK_TO', to: 'Type' },
  ],
};

describe('completeRelationshipType', () => {
  test('Pokemon relationships', () => {
    const query = 'MATCH (t:Trainer)-[r:';
    const symbolTables: SymbolTable[] = [];

    testCompletions({
      query,
      dbSchema,
      overrideSymbolsInfo: { query, symbolTables },
      expected: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });
});
