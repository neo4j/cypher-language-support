import { CompletionItemKind } from 'vscode-languageserver-types';
import { testCompletions } from './completionAssertionHelpers';

const dbSchema = {
  labels: [
    'Pokemon',
    'Trainer',
    'Gym',
    'Region',
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
    'STRONG_AGAINST',
    'IS_IN',
    'UNRELATED_RELTYPE',
  ],
  graphSchema: [
    { from: 'Trainer', relType: 'CATCHES', to: 'Pokemon' },
    { from: 'Trainer', relType: 'TRAINS', to: 'Pokemon' },
    { from: 'Trainer', relType: 'BATTLES', to: 'Trainer' },
    { from: 'Trainer', relType: 'IS_IN', to: 'Region' },
    { from: 'Gym', relType: 'IS_IN', to: 'Region' },
    { from: 'Trainer', relType: 'CHALLENGES', to: 'Gym' },
    { from: 'Pokemon', relType: 'CHALLENGES', to: 'Gym' },
    { from: 'Pokemon', relType: 'CHALLENGES', to: 'Pokemon' },
    { from: 'Pokemon', relType: 'KNOWS', to: 'Move' },
    { from: 'Pokemon', relType: 'WEAK_TO', to: 'Type' },
    { from: 'Type', relType: 'STRONG_AGAINST', to: 'Type' },
    {
      from: 'UnrelatedLabel',
      relType: 'UNRELATED_RELTYPE',
      to: 'UnrelatedLabel',
    },
  ],
};

describe('completeRelationshipType', () => {
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

  test('Simple node completion pattern 1', () => {
    const query = 'MATCH (t:Trainer)-[r:CATCHES]->(:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [{ label: 'Pokemon', kind: CompletionItemKind.TypeParameter }],
      excluded: [
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
        { label: 'Type', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Simple node completion pattern 2', () => {
    const query = 'MATCH (g:Gym)<-[r:CHALLENGES]-(:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'Pokemon', kind: CompletionItemKind.TypeParameter },
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
        { label: 'Region', kind: CompletionItemKind.TypeParameter },
        { label: 'Type', kind: CompletionItemKind.TypeParameter },
        { label: 'Move', kind: CompletionItemKind.TypeParameter },
        { label: 'UnrelatedLabel', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Simple node completion pattern with WHERE', () => {
    const query = 'MATCH (n)-[r]->(m) WHERE r:IS_IN MATCH (n)-[r]->(:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [{ label: 'Region', kind: CompletionItemKind.TypeParameter }],
      excluded: [
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
        { label: 'Pokemon', kind: CompletionItemKind.TypeParameter },
        { label: 'Type', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Simple rel completion pattern 1', () => {
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

  test('Simple rel completion pattern 2', () => {
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

  test('Longer relationship path pattern', () => {
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

  test('Longer node path pattern', () => {
    const query = 'MATCH (t:Trainer)-[:CATCHES]->(p:Pokemon)-[r:WEAK_TO]->(:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [{ label: 'Type', kind: CompletionItemKind.TypeParameter }],
      excluded: [
        { label: 'Pokemon', kind: CompletionItemKind.TypeParameter },
        { label: 'UnrelatedLabel', kind: CompletionItemKind.TypeParameter },
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
        { label: 'Region', kind: CompletionItemKind.TypeParameter },
        { label: 'Move', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles variables overlapping from other statements', () => {
    const query = `MATCH (p:Trainer) RETURN p;
    MATCH (p:Gym) RETURN p;
    MATCH (p:Pokemon)-[r:`;

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

  test('Node completion works in pattern expression ', () => {
    const query = `MATCH (p:Pokemon)-[r:KNOWS]->(m)
WHERE EXISTS {
  (p)-[r]->(:`;

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [{ label: 'Move', kind: CompletionItemKind.TypeParameter }],
      excluded: [
        { label: 'Pokemon', kind: CompletionItemKind.TypeParameter },
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
        { label: 'Type', kind: CompletionItemKind.TypeParameter },
        { label: 'Region', kind: CompletionItemKind.TypeParameter },
      ],
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
      ],
      excluded: [
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
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

  test('Handles deeper label trees, and mixing AND/OR logic', () => {
    const query = 'MATCH (x:Trainer) WHERE x:Gym OR x:Pokemon MATCH (x)-[:';
    // -> AND(Trainer, OR(Gym, Pokemon))
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
        { label: 'IS_IN', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles AND logic with self-referencing', () => {
    const query = 'MATCH (x) WHERE x:Pokemon OR x:Type MATCH (x)-[:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'STRONG_AGAINST', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles undirected rels for node completions', () => {
    const query = 'MATCH (p:Pokemon)-[r:KNOWS]-(:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'Move', kind: CompletionItemKind.TypeParameter },
        { label: 'Pokemon', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
        { label: 'Region', kind: CompletionItemKind.TypeParameter },
        { label: 'Type', kind: CompletionItemKind.TypeParameter },
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles undirected rels for rel completions', () => {
    const query =
      'MATCH (p:Pokemon)-[r:CHALLENGES]-(m:Gym)-[r2:IS_IN]->(reg:Region)-[:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [{ label: 'IS_IN', kind: CompletionItemKind.TypeParameter }],
      excluded: [
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'STRONG_AGAINST', kind: CompletionItemKind.TypeParameter },
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles |-syntax', () => {
    const query = 'MATCH (x:Pokemon|Trainer)-[r:';

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

  test('Handles &-syntax', () => {
    const query = 'MATCH (x:Pokemon&Trainer)-[r:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles join &/|-syntax', () => {
    //AND (&) gets evaluated first, so we get OR(AND(Pokemon, Trainer), Type)
    const query = 'MATCH (x:Pokemon&Trainer|Type)-[r:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
        { label: 'STRONG_AGAINST', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles OR-syntax', () => {
    const query = 'MATCH (x WHERE x:Pokemon OR x:Trainer)-[r:';

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

  test('Handles AND-syntax', () => {
    const query = 'MATCH (x WHERE x:Pokemon AND x:Trainer)-[r:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles joint AND/OR-syntax', () => {
    //AND gets evaluated first, so we get OR(AND(Pokemon, Trainer), Type)
    const query = 'MATCH (x WHERE x:Pokemon AND x:Trainer OR x:Type)-[r:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
        { label: 'STRONG_AGAINST', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

 

  test('Handles simple NOT for labels', () => {
    const query = 'MATCH (x) WHERE NOT x:Trainer MATCH (x)-[:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles NOT in conjunction with |', () => {
    const query = 'MATCH (x:!(Trainer|Pokemon))-[:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });
  
  test('Handles NOT in conjunction with &', () => {
    const query = 'MATCH (x:!(Trainer|Pokemon)&Gym)-[:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'IS_IN', kind: CompletionItemKind.TypeParameter },
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles NOT of rel types', () => {
    const query = 'MATCH (x)-[:!(IS_IN)]->(:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
        { label: 'Pokemon', kind: CompletionItemKind.TypeParameter },
        { label: 'Type', kind: CompletionItemKind.TypeParameter },
        { label: 'Move', kind: CompletionItemKind.TypeParameter },
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'Region', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  
  test('Does not remove label with multiple origins when NOTing one origin', () => {
    const query = 'MATCH ()<-[:!TRAINS]-(:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
        { label: 'Pokemon', kind: CompletionItemKind.TypeParameter },
        { label: 'Type', kind: CompletionItemKind.TypeParameter },
        //Trainer here would be removed if we naively did "all in-labels - in-labels from TRAIN"
        //Trainer should not be removed, since it except for going into TRAINS also goes into CATCHES
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'Move', kind: CompletionItemKind.TypeParameter },
        { label: 'Region', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles NOT of rel types in conjunction with |', () => {
    const query = 'MATCH (x)-[:!(CHALLENGES|IS_IN)]->(:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
        { label: 'Pokemon', kind: CompletionItemKind.TypeParameter },
        { label: 'Type', kind: CompletionItemKind.TypeParameter },
        { label: 'Move', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
        { label: 'Region', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  //!CHALLENGES -> Pokemon
  //!KNOWS -> Pokemon
  //etc. because each has a Pokemon from a different relType

  //!CATCHES&!TRAINS

  test('Works as expected for big |-case', () => {
    const query = 'MATCH ()<-[:!(CATCHES|TRAINS|BATTLES|IS_IN|CHALLENGES|KNOWS|WEAK_TO|STRONG_AGAINST|UNRELATED_RELTYPE)]-(:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        //Trainer here would be removed if we naively did "all in-labels - in-labels from TRAIN"
        //Trainer should not be removed, since it except for going into TRAINS also goes into CATCHES
      ],
      excluded: [
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
        { label: 'Pokemon', kind: CompletionItemKind.TypeParameter },
        { label: 'Type', kind: CompletionItemKind.TypeParameter },
        { label: 'Move', kind: CompletionItemKind.TypeParameter },
        { label: 'Region', kind: CompletionItemKind.TypeParameter },        
      ],
    });
  });

  // !Gym&!Trainer&!Pokemon&!Type&!Move&!Region&!UnrelatedLabel ->
  // ALL&{ALL-BATTLES}&{ALL-CATCHES,TRAINS}&{ALL-WEAK_TO,STRONG_AGAINST}&{ALL-KNOWS}&{ALL-IS_IN}&{ALL-UNRELATED_LABELTYPE} =
  //ALL - BATTLES,CATCHES,TRAINS,WEAK_TO,STRONG_AGAINST,KNOWS,IS_IN,UNRELATED_LABELTYPE = CHALLENGES
  //But how could n:!(OR(<...all labels>)) giving any completion be valid?
  //If we instead make ORs like NOT(x)= All-x
  //AND(OR(Trainer,Pokemon,Type,Move,Region,UnrelatedLabel),OR(Gym,Pokemon,Type,Move,Region,UnrelatedLabel), ...)
  // If we don't join ORs... 
  // If we join ORs we get AND(0)
  //But to rewrite NOT(x) to All-x we need All... -> suddenly need actual labels to rewrite tree (which is otherwise just from parsing query, containing even labels not in schema)

  test('Works as expected for big |-case in node label', () => {
    const query = 'MATCH (n:!(Gym|Trainer|Pokemon|Type|Move|Region|UnrelatedLabel))<-[:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
      ],
      excluded: [
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'IS_IN', kind: CompletionItemKind.TypeParameter },
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  //!Gym&!Trainer -> Pokemon|Type|Move|Region|UnrelatedLabel
  // expect CATCHES, TRAINS, BATTLES, IS_IN, CHALLENGES, KNOWS, WEAK_TO, STRONG_AGAINST, UNRELATED_RELTYPE
  
  test('Works as expected for big |-case in node label', () => {
    const query = 'MATCH (n:!(Gym|Trainer))<-[:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'IS_IN', kind: CompletionItemKind.TypeParameter },
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles anonymous variables as context - relationship completion ', () => {
    const query = 'MATCH (:Trainer)-[r:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'IS_IN', kind: CompletionItemKind.TypeParameter },
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles anonymous variables as context - node completion', () => {
    const query = 'MATCH (:Trainer)-[:TRAINS]->(:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [{ label: 'Pokemon', kind: CompletionItemKind.TypeParameter }],
      excluded: [{ label: 'Trainer', kind: CompletionItemKind.TypeParameter }],
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

  test('Handles direction-aware completions for nodes with leftArrow-rel', () => {
    const query = 'MATCH (p:Move)<-[r:KNOWS]-(:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [{ label: 'Pokemon', kind: CompletionItemKind.TypeParameter }],
      excluded: [
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
        { label: 'Region', kind: CompletionItemKind.TypeParameter },
        { label: 'Type', kind: CompletionItemKind.TypeParameter },
        { label: 'Move', kind: CompletionItemKind.TypeParameter },
        { label: 'UnrelatedLabel', kind: CompletionItemKind.TypeParameter },
        { label: 'Unconnected', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles direction-aware completions for nodes with rightArrow-rel', () => {
    const query = 'MATCH (t:Trainer)-[r:IS_IN]->(:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [{ label: 'Region', kind: CompletionItemKind.TypeParameter }],
      excluded: [
        { label: 'Pokemon', kind: CompletionItemKind.TypeParameter },
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
        { label: 'Type', kind: CompletionItemKind.TypeParameter },
        { label: 'Move', kind: CompletionItemKind.TypeParameter },
        { label: 'UnrelatedLabel', kind: CompletionItemKind.TypeParameter },
        { label: 'Unconnected', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles direction-aware completions for nodes with bidirectional rel', () => {
    const query = 'MATCH (t:Trainer)-[r:IS_IN]-(:';
    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'Region', kind: CompletionItemKind.TypeParameter },
        // Limitation: Only takes one step back in account
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'Pokemon', kind: CompletionItemKind.TypeParameter },
        { label: 'Type', kind: CompletionItemKind.TypeParameter },
        { label: 'Move', kind: CompletionItemKind.TypeParameter },
        { label: 'UnrelatedLabel', kind: CompletionItemKind.TypeParameter },
        { label: 'Unconnected', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles direction-aware completions with arrow before rel', () => {
    const query = 'MATCH (p:Pokemon)<-[r:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'IS_IN', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles schema-aware completions with directionless rel', () => {
    const query = 'MATCH (p:Pokemon)-[r:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [{ label: 'IS_IN', kind: CompletionItemKind.TypeParameter }],
    });
  });

  test('Limitation: Does not handle direction-aware completions with context after caret', () => {
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
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'IS_IN', kind: CompletionItemKind.TypeParameter },
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Does not break on intersection where first label has no matches', () => {
    const query = 'MATCH (n:Unconnected) MATCH (n:Trainer)-[:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [],
      excluded: [
        { label: 'IS_IN', kind: CompletionItemKind.TypeParameter },
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
        { label: 'CHALLENGES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },
        { label: 'STRONG_AGAINST', kind: CompletionItemKind.TypeParameter },
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

  test('Limitation: Does not deduplicate existing node labels in simple "|" pattern ', () => {
    const query = 'MATCH (g)<-[r:CHALLENGES]-(p:Pokemon|Gym|';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
        // below should be excluded
        { label: 'Pokemon', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
        { label: 'Type', kind: CompletionItemKind.TypeParameter },
        { label: 'Region', kind: CompletionItemKind.TypeParameter },
        { label: 'Move', kind: CompletionItemKind.TypeParameter },
        { label: 'UnrelatedLabel', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Limitation: Does not deduplicate existing node labels in simple "&" pattern ', () => {
    const query = 'MATCH (g)<-[r:CHALLENGES]-(p:Pokemon&Gym&';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
        // below should be excluded
        { label: 'Pokemon', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
        { label: 'Type', kind: CompletionItemKind.TypeParameter },
        { label: 'Region', kind: CompletionItemKind.TypeParameter },
        { label: 'Move', kind: CompletionItemKind.TypeParameter },
        { label: 'UnrelatedLabel', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles cursor position for rel completion', () => {
    const beforeCursor = 'MATCH (t1:Trainer)-[r1:';
    const query = beforeCursor + 'CATCHES]-(p1:Pokemon)-[r2:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      offset: beforeCursor.length,
      expected: [
        { label: 'CATCHES', kind: CompletionItemKind.TypeParameter },
        { label: 'TRAINS', kind: CompletionItemKind.TypeParameter },
        { label: 'IS_IN', kind: CompletionItemKind.TypeParameter },
        //Limitation: Only take preceding node into account
        { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'UNRELATED_RELTYPE', kind: CompletionItemKind.TypeParameter },

        // there's no in/outoing knows from trainer
        { label: 'KNOWS', kind: CompletionItemKind.TypeParameter },
        { label: 'WEAK_TO', kind: CompletionItemKind.TypeParameter },

        // there's no BATTLE between trainer and pokemon
        // { label: 'BATTLES', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });

  test('Handles cursor position for node completion', () => {
    const beforeCursor = 'MATCH (t1:Trainer)-[r1:CATCHES]-(p1:';
    const query = beforeCursor + 'Pokemon)-[r2:IS_IN]->(:';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      offset: beforeCursor.length,
      expected: [
        { label: 'Pokemon', kind: CompletionItemKind.TypeParameter },
        //limitation: only takes one step back into account
        { label: 'Trainer', kind: CompletionItemKind.TypeParameter },
      ],
      excluded: [
        { label: 'Region', kind: CompletionItemKind.TypeParameter },
        { label: 'Gym', kind: CompletionItemKind.TypeParameter },
      ],
    });
  });
});
