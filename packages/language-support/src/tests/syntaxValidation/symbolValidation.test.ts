import { getDiagnosticsForQuery } from './helpers.js';

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

describe('Semantic validation spec', () => {
  test('Warns on invalid path segments. Node->Rel', () => {
    const query = 'MATCH (n:Trainer)-[:WEAK_TO]->() RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: 'Path segment does not exist on graph.',
        offsets: {
          end: 30,
          start: 6,
        },
        range: {
          end: {
            character: 30,
            line: 0,
          },
          start: {
            character: 6,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Does not warn on valid path segments. Node->Rel', () => {
    const query = 'MATCH (n:Pokemon)-[:WEAK_TO]->() RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Warns on invalid path segments. Node<-Rel', () => {
    const query = 'MATCH (n:Pokemon)<-[:WEAK_TO]-() RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: 'Path segment does not exist on graph.',
        offsets: {
          end: 30,
          start: 6,
        },
        range: {
          end: {
            character: 30,
            line: 0,
          },
          start: {
            character: 6,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Does not warn on valid path segments. Node<-Rel', () => {
    const query = 'MATCH (n:Type)<-[:WEAK_TO]-() RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Warns on invalid path segments. Rel->Node', () => {
    const query = 'MATCH ()-[:WEAK_TO]->(:Gym) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: 'Path segment does not exist on graph.',
        offsets: {
          end: 27,
          start: 8,
        },
        range: {
          end: {
            character: 27,
            line: 0,
          },
          start: {
            character: 8,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Does not warn on valid path segments. Rel->Node', () => {
    const query = 'MATCH ()-[:WEAK_TO]->(:Type) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Warns on invalid path segments. <-Rel-Node', () => {
    const query = 'MATCH ()<-[:WEAK_TO]-(:Gym) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: 'Path segment does not exist on graph.',
        offsets: {
          end: 27,
          start: 8,
        },
        range: {
          end: {
            character: 27,
            line: 0,
          },
          start: {
            character: 8,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Does not warn on valid path segments. <-Rel-Node', () => {
    const query = 'MATCH ()<-[:WEAK_TO]-(:Pokemon) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Warns on multiple invalid path segments at once', () => {
    const query = 'MATCH (:Trainer)<-[:WEAK_TO]->(:Gym) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: 'Path segment does not exist on graph.',
        offsets: {
          end: 30,
          start: 6,
        },
        range: {
          end: {
            character: 30,
            line: 0,
          },
          start: {
            character: 6,
            line: 0,
          },
        },
        severity: 2,
      },
      {
        message: 'Path segment does not exist on graph.',
        offsets: {
          end: 36,
          start: 16,
        },
        range: {
          end: {
            character: 36,
            line: 0,
          },
          start: {
            character: 16,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Does not warn on valid path segments. Node<-Rel->Node', () => {
    const query = 'MATCH (:Type)<-[:WEAK_TO]->(:Pokemon) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Handles multiple labels on first variable in path segment (node)', () => {
    const query = 'MATCH (:Trainer|Gym)<-[:WEAK_TO]-(:Pokemon) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: 'Path segment does not exist on graph.',
        offsets: {
          end: 33,
          start: 6,
        },
        range: {
          end: {
            character: 33,
            line: 0,
          },
          start: {
            character: 6,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Handles multiple labels on first variable in path segment (rel)', () => {
    const query = 'MATCH (:Trainer)<-[:WEAK_TO|IS_IN]-(:Move) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: 'Path segment does not exist on graph.',
        offsets: {
          end: 42,
          start: 16,
        },
        range: {
          end: {
            character: 42,
            line: 0,
          },
          start: {
            character: 16,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Limitation: Bails on multiple labels on second variable in path segment (node)', () => {
    const query = 'MATCH (:Type)<-[:WEAK_TO]-(:Trainer|Gym) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Limitation: Bails on multiple labels on second variable in path segment (rel)', () => {
    const query = 'MATCH (:Gym)<-[:WEAK_TO|IS_IN]-(:Pokemon) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });
});
