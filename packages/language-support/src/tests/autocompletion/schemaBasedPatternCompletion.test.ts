import { CompletionItemKind } from 'vscode-languageserver-types';
import { testCompletions } from './completionAssertionHelpers';
import { _internalFeatureFlags } from '../../featureFlags';

const dbSchema = {
  labels: [
    'Pokemon',
    'Trainer',
    'Gym',
    'Type',
    'Move',
    'UnrelatedLabel',
    'Unconnected',
  ],
  relationshipTypes: [
    'CATCHES',
    'TRAINS',
    'BATTLES',
    'CHALLENGES',
    'KNOWS',
    'WEAK_TO',
    'UNRELATED_RELTYPE',
  ],
  graphSchema: [
    { from: 'Trainer', relType: 'CATCHES', to: 'Pokemon' },
    { from: 'Trainer', relType: 'TRAINS', to: 'Pokemon' },
    { from: 'Trainer', relType: 'BATTLES', to: 'Trainer' },
    { from: 'Trainer', relType: 'CHALLENGES', to: 'Gym' },
    { from: 'Pokemon', relType: 'CHALLENGES', to: 'Gym' },
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
    _internalFeatureFlags.schemaBasedPatternCompletions = true;
  });

  afterEach(() => {
    _internalFeatureFlags.schemaBasedPatternCompletions = false;
  });

  test('Completion dont crash on missing db connection', () => {
    const query = 'MATCH (t:Trainer)-[r:';

    testCompletions({
      query,
      dbSchema: undefined,
      computeSymbolsInfo: true,
      expected: [],
      excluded: [],
    });
  });

  test('Simple pattern 1', () => {
    const query = 'MATCH (t:Trainer)-[r:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
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

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
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

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
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

  test('Handles scope', () => {
    const query = `MATCH (t:Trainer)
                    CALL () {
                        MATCH (t:UnrelatedLabel)
                        RETURN t as x
                    }
                    MATCH (t)-[:`;

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      offset: query.length,
      expected: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles quantified path pattern', () => {
    const query = `MATCH (s:Pokemon) ((s)-[:`;

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
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

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
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

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
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

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
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

  test('Handles unconnected label', () => {
    const query = 'MATCH (t:Unconnected)-[r:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [],
      excluded: [
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles nodes with multiple labels properly (AND logic)', () => {
    const query = 'MATCH (n:Trainer) WHERE n:Pokemon MATCH (n)-[:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
        // Limitation: These should actually be excluded, but since we dont track direction yet, they are not
        // Note that even though we don't know the direction in the query, we can see in the graph schema that we don't
        // have ex. 'CATCHES' going to/from both Trainer and Pokemon, meaning it cant be going to/from a Pokemon&Trainer node
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles nodes that have one of multiple labels (OR logic)', () => {
    const query = 'MATCH (x) WHERE x:Trainer OR x:Pokemon MATCH (x)-[:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
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

  test('Limitation: Does not handle union types, as they are not yet supported in symbol table ', () => {
    const query = 'MATCH (x:Pokemon|Trainer)-[r:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        /* Only these should be included
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
         */
        // For now, test bail working
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        // { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Limitation: Does not handle NOT', () => {
    const query = 'MATCH (x) WHERE NOT x:Trainer MATCH (x)-[:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        // For now, test bail working
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        /* These should be included
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
         */
      ],
      excluded: [
        /* These should be excluded
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
         */
      ],
    });
  });

  test('Limitation: Does not handle anonymous variables as context ', () => {
    const query = 'MATCH (:Trainer)-[r:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
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

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
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

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
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

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      offset: beforeCursor.length,
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

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      offset: beforeCursor.length,
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

  test('Limitation: Does not deduplicate existing relationship types in pattern ', () => {
    const query = 'MATCH (t:Trainer)-[r:CATCHES|TRAINS|';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
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

  test('Handles cursor position', () => {
    const query = 'MATCH (t1:Trainer)-[r1:CATCHES]-(p1:Pokemon)-[r2:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      offset: 'MATCH (t1:Trainer)-[r1:'.length,
      expected: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },

        // there's no outoing knows from trainer
        // { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        // { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },

        // there's no BATTLE between trainer and pokemon
        // { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });
});
