import { CompletionItemKind } from 'vscode-languageserver-types';
import { testCompletions } from './completionAssertionHelpers.js';

export const dbSchema = {
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

describe('Path segment completions', () => {
  test('Simple node segment completion', () => {
    const query = 'MATCH (t:Trainer)-[r:CATCHES]';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        {
          label: '->(:Pokemon)',
          kind: CompletionItemKind.Snippet,
          detail: 'path template',
          insertText: '->(${1: }:Pokemon)${2:}',
          insertTextFormat: 2,
        },
      ],
    });
  });

  test('Should provide node segment completion after pattern without rel', () => {
    const query = 'MATCH (t1:Trainer)--(t2:Trainer)';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        {
          label: '-[:CATCHES]->(:Pokemon)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:CATCHES]->(${2: }:Pokemon)${3:}',
          detail: 'path template',
        },
        {
          label: '-[:TRAINS]->(:Pokemon)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:TRAINS]->(${2: }:Pokemon)${3:}',
          detail: 'path template',
        },
        {
          label: '-[:BATTLES]->(:Trainer)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:BATTLES]->(${2: }:Trainer)${3:}',
          detail: 'path template',
        },
        {
          label: '<-[:BATTLES]-(:Trainer)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '<-[${1: }:BATTLES]-(${2: }:Trainer)${3:}',
          detail: 'path template',
        },
        {
          label: '-[:IS_IN]->(:Region)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:IS_IN]->(${2: }:Region)${3:}',
          detail: 'path template',
        },
        {
          label: '-[:CHALLENGES]->(:Gym)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:CHALLENGES]->(${2: }:Gym)${3:}',
          detail: 'path template',
        },
      ],
    });
  });

  test('Should abide by predefined direction for node segment completion', () => {
    const query = 'MATCH (t:Trainer)<-[r:BATTLES]';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        {
          label: '-(:Trainer)',
          kind: CompletionItemKind.Snippet,
          detail: 'path template',
          insertText: '-(${1: }:Trainer)${2:}',
          insertTextFormat: 2,
        },
      ],
      excluded: [
        {
          label: '->(:Trainer)',
          kind: CompletionItemKind.Snippet,
          detail: 'path template',
          insertText: '->(${1: }:Trainer)${2:}',
          insertTextFormat: 2,
        },
      ],
    });
  });

  test('Should assume undefined direction for node segment completion', () => {
    const query = 'MATCH (t:Trainer)-[r:BATTLES]';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        {
          label: '->(:Trainer)',
          kind: CompletionItemKind.Snippet,
          detail: 'path template',
          insertText: '->(${1: }:Trainer)${2:}',
          insertTextFormat: 2,
        },
      ],
      excluded: [
        {
          label: '-(:Trainer)',
          kind: CompletionItemKind.Snippet,
          detail: 'path template',
          insertText: '-(${1: }:Trainer)${2:}',
          insertTextFormat: 2,
        },
      ],
    });
  });

  test('Should complete full segments for node', () => {
    const query = 'MATCH (t:Trainer)';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        {
          label: '-[:CATCHES]->(:Pokemon)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:CATCHES]->(${2: }:Pokemon)${3:}',
          detail: 'path template',
        },
        {
          label: '-[:TRAINS]->(:Pokemon)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:TRAINS]->(${2: }:Pokemon)${3:}',
          detail: 'path template',
        },
        {
          label: '-[:BATTLES]->(:Trainer)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:BATTLES]->(${2: }:Trainer)${3:}',
          detail: 'path template',
        },
        {
          label: '<-[:BATTLES]-(:Trainer)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '<-[${1: }:BATTLES]-(${2: }:Trainer)${3:}',
          detail: 'path template',
        },
        {
          label: '-[:IS_IN]->(:Region)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:IS_IN]->(${2: }:Region)${3:}',
          detail: 'path template',
        },
        {
          label: '-[:CHALLENGES]->(:Gym)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:CHALLENGES]->(${2: }:Gym)${3:}',
          detail: 'path template',
        },
      ],
    });
  });

  test('Should provide node segment completion on started line', () => {
    const query = 'MATCH (t:Trainer)-[r:CATCHES]-';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        {
          label: '>(:Pokemon)',
          kind: CompletionItemKind.Snippet,
          detail: 'path template',
          insertText: '>(${1: }:Pokemon)${2:}',
          insertTextFormat: 2,
        },
      ],
    });
  });

  test('Should not provide node segment completion on arrow pointing the wrong way', () => {
    const query = 'MATCH (t:Trainer)-[r:CATCHES]<';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
  });

  test('Should suggest snippets for node when path is started 1', () => {
    testCompletions({
      query: 'MATCH (t:Trainer)<',
      dbSchema,
      computeSymbolsInfo: true,
      excluded: [
        {
          label: '[:CATCHES]->(:Pokemon)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:CATCHES]->(${2: }:Pokemon)${3:}',
          detail: 'path template',
        },
        {
          label: '[:TRAINS]->(:Pokemon)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:TRAINS]->(${2: }:Pokemon)${3:}',
          detail: 'path template',
        },
        {
          label: '[:BATTLES]->(:Trainer)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:BATTLES]->(${2: }:Trainer)${3:}',
          detail: 'path template',
        },
        {
          label: '[:IS_IN]->(:Region)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:IS_IN]->(${2: }:Region)${3:}',
          detail: 'path template',
        },
        {
          label: '[:CHALLENGES]->(:Gym)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:CHALLENGES]->(${2: }:Gym)${3:}',
          detail: 'path template',
        },
      ],
      expected: [
        {
          label: '-[:BATTLES]-(:Trainer)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:BATTLES]-(${2: }:Trainer)${3:}',
          detail: 'path template',
        },
      ],
    });
  });

  test('Should suggest snippets for node when path is started 2', () => {
    testCompletions({
      query: 'MATCH (t:Trainer)-',
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        {
          label: '[:CATCHES]->(:Pokemon)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '[${1: }:CATCHES]->(${2: }:Pokemon)${3:}',
          detail: 'path template',
        },
        {
          label: '[:TRAINS]->(:Pokemon)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '[${1: }:TRAINS]->(${2: }:Pokemon)${3:}',
          detail: 'path template',
        },
        {
          label: '[:BATTLES]->(:Trainer)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '[${1: }:BATTLES]->(${2: }:Trainer)${3:}',
          detail: 'path template',
        },
        {
          label: '[:IS_IN]->(:Region)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '[${1: }:IS_IN]->(${2: }:Region)${3:}',
          detail: 'path template',
        },
        {
          label: '[:CHALLENGES]->(:Gym)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '[${1: }:CHALLENGES]->(${2: }:Gym)${3:}',
          detail: 'path template',
        },
      ],
      excluded: [
        {
          label: '-[:BATTLES]-(:Trainer)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:BATTLES]-(${2: }:Trainer)${3:}',
          detail: 'path template',
        },
      ],
    });
  });

  test('Should not suggest snippets when path is continued beyond initial character, except when next characer in the pattern is also a trigger char', () => {
    testCompletions({
      query: 'MATCH (t:Trainer)-[',
      dbSchema,
      computeSymbolsInfo: true,
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
    testCompletions({
      query: 'MATCH (t:Trainer)-[]',
      dbSchema,
      computeSymbolsInfo: true,
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
    testCompletions({
      query: 'MATCH (t:Trainer)-[r:CATCHES]->',
      dbSchema,
      computeSymbolsInfo: true,
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
    testCompletions({
      query: 'MATCH (t:Trainer)--',
      dbSchema,
      computeSymbolsInfo: true,
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
  });

  test('Should complete with snippets when both chars in the start of a path segment are trigger characters', () => {
    testCompletions({
      query: 'MATCH (t:Trainer)<-',
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        {
          label: '[:BATTLES]-(:Trainer)',
          kind: 15,
          insertTextFormat: 2,
          insertText: '[${1: }:BATTLES]-(${2: }:Trainer)${3:}',
          detail: 'path template',
        },
      ],
    });
  });

  test('Should complete full segments for node in an existing segment', () => {
    const query = 'MATCH (t:Trainer)-[:CATCHES]->(:Pokemon)';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        {
          label: '<-[:CATCHES]-(:Trainer)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '<-[${1: }:CATCHES]-(${2: }:Trainer)${3:}',
          detail: 'path template',
        },
        {
          label: '<-[:TRAINS]-(:Trainer)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '<-[${1: }:TRAINS]-(${2: }:Trainer)${3:}',
          detail: 'path template',
        },
        {
          label: '-[:CHALLENGES]->(:Gym)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:CHALLENGES]->(${2: }:Gym)${3:}',
          detail: 'path template',
        },
        {
          label: '-[:KNOWS]->(:Move)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:KNOWS]->(${2: }:Move)${3:}',
          detail: 'path template',
        },
        {
          label: '-[:WEAK_TO]->(:Type)',
          kind: CompletionItemKind.Snippet,
          insertTextFormat: 2,
          insertText: '-[${1: }:WEAK_TO]->(${2: }:Type)${3:}',
          detail: 'path template',
        },
      ],
    });
  });

  test('Should not give path segments when last node has no labels', () => {
    const query = 'MATCH (t:Trainer)-[:CATCHES]->(n)';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      excluded: [
        {
          kind: CompletionItemKind.Snippet,
        },
      ],
    });
  });

  test('Should not provide node path segment completion when last rel has no relType', () => {
    const query = 'MATCH (t:Trainer)-[r]';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      excluded: [{ kind: CompletionItemKind.Snippet }],
    });
  });

  test('Should provide node path segment completion even if label of previous node is not defined', () => {
    const query = 'MATCH (t)-[:CATCHES]';

    testCompletions({
      query,
      dbSchema,
      computeSymbolsInfo: true,
      expected: [
        {
          label: '->(:Pokemon)',
          kind: CompletionItemKind.Snippet,
          detail: 'path template',
          insertText: '->(${1: }:Pokemon)${2:}',
          insertTextFormat: 2,
        },
      ],
    });
  });
});
