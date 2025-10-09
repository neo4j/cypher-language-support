import { CompletionItemKind } from 'vscode-languageserver-types';
import { testCompletions } from './completionAssertionHelpers';
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

  test.only('Simple pattern 1', () => {
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

  test('Handles union types ', () => {
    const query = 'MATCH (x:Pokemon|Trainer)-[r:';

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
      excluded: [
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

  test('Limitation: Does not handle cursor position', () => {
    const query = 'MATCH (t1:Trainer)-[r1:CATCHES]-(p1:Pokemon)-[r2:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      offset: 'MATCH (t1:Trainer)-[r1:'.length,
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
