import { CompletionItemKind } from 'vscode-languageserver-types';
import { testCompletions } from './completionAssertionHelpers';
import { SymbolTable } from '../../types';
import { _internalFeatureFlags } from '../../featureFlags';

const dbSchema = {
  labels: ['Pokemon', 'Trainer', 'Gym', 'Type', 'Move', 'UnrelatedLabel'],
  relationshipTypes: [
    'CATCHES',
    'TRAINS',
    'BATTLES',
    'KNOWS',
    'WEAK_TO',
    'UNRELATED_RELTYPE',
  ],
  graphSchema: [
    { from: 'Trainer', relType: 'CATCHES', to: 'Pokemon' },
    { from: 'Trainer', relType: 'TRAINS', to: 'Pokemon' },
    { from: 'Trainer', relType: 'BATTLES', to: 'Trainer' },
    { from: 'Pokemon', relType: 'KNOWS', to: 'Move' },
    { from: 'Pokemon', relType: 'WEAK_TO', to: 'Type' },
    {
      from: 'UnrelatedLabel',
      relType: 'UNRELATED_RELTYPE',
      to: 'UnrelatedLabel',
    },
  ],
};

describe('completeRelationshipType', () => {
  beforeEach(() => {
    _internalFeatureFlags.schemaBasedPatternCompletion = true;
  });

  afterEach(() => {
    _internalFeatureFlags.schemaBasedPatternCompletion = false;
  });

  test('Simple pattern 1', () => {
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
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Simple pattern 2', () => {
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
      excluded: [
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Longer path pattern', () => {
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
      excluded: [
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles quantified path pattern', () => {
    const query = `MATCH (s:Pokemon) ((s)-[:`;
    const symbolTables: SymbolTable = [
      {
        variable: 's',
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
      excluded: [
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Works in pattern expression ', () => {
    const query = `MATCH (p:Pokemon)
WHERE EXISTS {
  (p)-[:`;

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

  test('Works in pattern comprehension ', () => {
    const query = `MATCH (p:Pokemon)
RETURN [(p)-[:`;

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
        // below should be excluded
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles patterns with multiple variables ', () => {
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
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Limitation: Does not handle anonymous variables as context ', () => {
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
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Limitation: Does not properly handle quantifiers ', () => {
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
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        // below should be included, as we should bail out
        // { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        // { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Limitation: Does not handle direction-aware completions ', () => {
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
        // below should be excluded
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Limitation: Does not handle mid query cursor', () => {
    const beforeCursor = 'MATCH (p:Pokemon)-[r:';
    const query = beforeCursor + ']-(t:Trainer)--(u:UnrelatedLabel)';

    const symbolTables: SymbolTable = [
      {
        variable: 'p',
        definitionPosition: 7,
        types: ['Pokemon'],
        references: [],
      },
      {
        variable: 't',
        definitionPosition: 26,
        types: ['Trainer'],
        references: [],
      },
      {
        variable: 'u',
        definitionPosition: 43,
        types: ['UnrelatedLabel'],
        references: [],
      },
    ];

    testCompletions({
      query,
      dbSchema,
      offset: beforeCursor.length,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
      expected: [
        // always takes the latest finished node, rather than the correct one
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Limitation: Does not handle direction-aware completions ', () => {
    const beforeCursor = 'MATCH (p:Pokemon)-[r:';
    const query = beforeCursor + ']->(t:Trainer)';

    const symbolTables: SymbolTable = [
      {
        variable: 'p',
        definitionPosition: 7,
        types: ['Pokemon'],
        references: [],
      },
      {
        variable: 't',
        definitionPosition: 26,
        types: ['Trainer'],
        references: [],
      },
    ];

    testCompletions({
      query,
      dbSchema,
      offset: beforeCursor.length,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
      expected: [
        // all should be excluded as there is no relationship from pokemon to trainer
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles union types ', () => {
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
      excluded: [
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Limitation: Does not deduplicate existing relationship types in pattern ', () => {
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
      expected: [
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        // below should be excluded
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Limitation: Does not handle cursor position', () => {
    const query = 'MATCH (t1:Trainer)-[r1:CATCHES]-(p1:Pokemon)-[r2:';
    const symbolTables: SymbolTable = [
      {
        variable: 't1',
        definitionPosition: 7,
        types: ['Trainer'],
        references: [],
      },
      {
        variable: 'p1',
        definitionPosition: 26,
        types: ['Pokemon'],
        references: [],
      },
      {
        variable: 'r1',
        definitionPosition: 16,
        types: ['CATCHES'],
        references: [],
      },
    ];

    testCompletions({
      query,
      dbSchema,
      offset: 'MATCH (t1:Trainer)-[r1:'.length,
      overrideSymbolsInfo: { query, symbolTables: [symbolTables] },
      // this should give the suggestions for trainer, not pokemon
      expected: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        // below should be excluded
        // { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        // { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        // { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });
});
