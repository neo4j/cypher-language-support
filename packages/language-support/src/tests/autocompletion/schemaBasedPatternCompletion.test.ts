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
  test('Trainer relationships', () => {
    const query = 'MATCH (t:Trainer)-[r:';
    const symbolTables: SymbolTable = [
      {
        variable: 't',
        definitionPosition: 7,
        types: ['Trainer'],
        references: [],
      },
    ];

    testCompletions({
      query,
      dbSchema,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
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

  test('Pokemon relationships', () => {
    const query = 'MATCH (p:Pokemon)-[r:';
    const symbolTables: SymbolTable = [
      {
        variable: 'p',
        definitionPosition: 7,
        types: ['Pokemon'],
        references: [],
      },
    ];

    testCompletions({
      query,
      dbSchema,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
      expected: [
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [{ label: 'BATTLES', kind: CompletionItemKind.TypeParameter }],
    });
  });

  test('Longer path - middle of chain', () => {
    const query = 'MATCH (t:Trainer)-[:CATCHES]->(p:Pokemon)-[r:';
    const symbolTables: SymbolTable = [
      {
        variable: 't',
        definitionPosition: 7,
        types: ['Trainer'],
        references: [],
      },
      {
        variable: 'p',
        definitionPosition: 26,
        types: ['Pokemon'],
        references: [],
      },
    ];

    testCompletions({
      query,
      dbSchema,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
      expected: [
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [{ label: 'BATTLES', kind: CompletionItemKind.TypeParameter }],
    });
  });

  test('Three-hop path completion', () => {
    const query =
      'MATCH (t:Trainer)-[:CATCHES]->(p:Pokemon)-[:KNOWS]->(m:Move) WITH t, p, m MATCH (p)-[r:';
    const symbolTables: SymbolTable = [
      {
        variable: 't',
        definitionPosition: 7,
        types: ['Trainer'],
        references: [58],
      },
      {
        variable: 'p',
        definitionPosition: 26,
        types: ['Pokemon'],
        references: [60, 78],
      },
      {
        variable: 'm',
        definitionPosition: 48,
        types: ['Move'],
        references: [63],
      },
    ];

    testCompletions({
      query,
      dbSchema,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
      expected: [
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [{ label: 'BATTLES', kind: CompletionItemKind.TypeParameter }],
    });
  });

  // Test cases for current limitations of the implementations
  test.skip('Can use anonymous variables as context', () => {
    const query = 'MATCH (:Trainer)-[r:';
    const symbolTables: SymbolTable = [];

    testCompletions({
      query,
      dbSchema,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
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

  test.skip('Handles quantifiers gracefully', () => {
    const query = 'MATCH (t:Trainer)-[r:CATCHES*1..3]->(p:Pokemon)-[r2:';
    const symbolTables: SymbolTable = [
      {
        variable: 't',
        definitionPosition: 7,
        types: ['Trainer'],
        references: [],
      },
      {
        variable: 'p',
        definitionPosition: 39,
        types: ['Pokemon'],
        references: [],
      },
    ];

    testCompletions({
      query,
      dbSchema,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
      expected: [
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test.skip('Handles direction-aware completions', () => {
    const query = 'MATCH (p:Pokemon)<-[r:';
    const symbolTables: SymbolTable = [
      {
        variable: 'p',
        definitionPosition: 7,
        types: ['Pokemon'],
        references: [],
      },
    ];

    testCompletions({
      query,
      dbSchema,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
      expected: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test.skip('Works with union types', () => {
    const query = 'MATCH (x:Pokemon|Trainer)-[r:';
    const symbolTables: SymbolTable = [
      {
        variable: 'x',
        definitionPosition: 7,
        types: ['Pokemon', 'Trainer'],
        references: [],
      },
    ];

    testCompletions({
      query,
      dbSchema,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
      expected: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test.skip('Handles complex patterns with multiple variables', () => {
    const query = 'MATCH (t:Trainer)-[:CATCHES]->(p:Pokemon), (p)-[r:';
    const symbolTables: SymbolTable = [
      {
        variable: 't',
        definitionPosition: 7,
        types: ['Trainer'],
        references: [],
      },
      {
        variable: 'p',
        definitionPosition: 26,
        types: ['Pokemon'],
        references: [43],
      },
    ];

    testCompletions({
      query,
      dbSchema,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
      expected: [
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test.skip('Handles subqueries and scope isolation', () => {
    const query = `
      MATCH (t:Trainer)
      CALL {
        MATCH (p:Pokemon)-[r:
    `;
    const symbolTables: SymbolTable = [
      {
        variable: 't',
        definitionPosition: 13,
        types: ['Trainer'],
        references: [],
      },
      {
        variable: 'p',
        definitionPosition: 51,
        types: ['Pokemon'],
        references: [],
      },
    ];
    testCompletions({
      query,
      dbSchema,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
      expected: [
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test.skip('Handles parenthesized paths', () => {
    const query = 'MATCH (t:Trainer)-[((p:Pokemon)-[r:';
    const symbolTables: SymbolTable = [
      {
        variable: 't',
        definitionPosition: 7,
        types: ['Trainer'],
        references: [],
      },
      {
        variable: 'p',
        definitionPosition: 21,
        types: ['Pokemon'],
        references: [],
      },
    ];

    testCompletions({
      query,
      dbSchema,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
      expected: [
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test.skip('Handles multiple relationship types in pattern', () => {
    const query = 'MATCH (t:Trainer)-[r:CATCHES|TRAINS|';
    const symbolTables: SymbolTable = [
      {
        variable: 't',
        definitionPosition: 7,
        types: ['Trainer'],
        references: [],
      },
    ];

    testCompletions({
      query,
      dbSchema,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
      expected: [{ label: 'BATTLES', kind: CompletionItemKind.TypeParameter }],
      excluded: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test.skip('Handles PathPatternNonEmptyContext patterns', () => {
    const query = 'MATCH p = (t:Trainer)-[r:';
    const symbolTables: SymbolTable = [
      {
        variable: 't',
        definitionPosition: 11,
        types: ['Trainer'],
        references: [],
      },
    ];

    testCompletions({
      query,
      dbSchema,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
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

  test.skip('Respects scope rules', () => {});
});
