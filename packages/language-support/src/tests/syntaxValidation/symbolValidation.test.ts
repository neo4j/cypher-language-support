import { _internalFeatureFlags } from '../../featureFlags.js';
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

describe('Schema based linting spec', () => {
  test('Warns on invalid path segments. Node->Rel', () => {
    const query = 'MATCH (n:Trainer)-[:WEAK_TO]->() RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '[:WEAK_TO] has no incoming (:Trainer)',
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
        message: '[:WEAK_TO] has no outgoing (:Pokemon)',
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
        message: '(:Gym) has no incoming [:WEAK_TO]',
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
        message: '(:Gym) has no outgoing [:WEAK_TO]',
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
        message: '[:WEAK_TO] has no incoming/outgoing (:Trainer)',
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
        message: '(:Gym) has no incoming/outgoing [:WEAK_TO]',
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
        message: '[:WEAK_TO] has no outgoing (:(Trainer | Gym))',
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

  test('Handles multiple labels on both variables in path segment', () => {
    const query = 'MATCH (:Trainer)<-[:WEAK_TO|IS_IN]-(:Move) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '[:(WEAK_TO | IS_IN)] has no outgoing (:Trainer)',
        offsets: {
          end: 35,
          start: 6,
        },
        range: {
          end: {
            character: 35,
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
        message: '(:Move) has no outgoing [:(WEAK_TO | IS_IN)]',
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

  test('Handles multiple labels on first variable in path segment. Extreme case', () => {
    const query =
      'MATCH (:(Trainer|Gym) & (Gym | (Trainer & Pokemon)))<-[:WEAK_TO]-(:Pokemon) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          '[:WEAK_TO] has no outgoing (:((Trainer | Gym) & (Gym | (Trainer & Pokemon))))',
        offsets: {
          end: 65,
          start: 6,
        },
        range: {
          end: {
            character: 65,
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

  test('Handles multiple labels on second variable in path segment (node)', () => {
    const query = 'MATCH (:Type)<-[:WEAK_TO]-(:Trainer|Gym) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '(:(Trainer | Gym)) has no outgoing [:WEAK_TO]',
        offsets: {
          end: 40,
          start: 13,
        },
        range: {
          end: {
            character: 40,
            line: 0,
          },
          start: {
            character: 13,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Handles multiple labels on second variable in path segment (rel)', () => {
    const query = 'MATCH (:Gym)<-[:WEAK_TO|IS_IN]-(:Pokemon) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '[:(WEAK_TO | IS_IN)] has no outgoing (:Gym)',
        offsets: {
          end: 31,
          start: 6,
        },
        range: {
          end: {
            character: 31,
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

  //This should be invalid even though Type and Trainer are both individually possible, this syntax means the node will have both, but there is no single
  //rel type of the CHALLENGES|STRONG_AGAINST rel that would give both
  test('Handles more complex labels on both variables in path segment, v1', () => {
    const query =
      'MATCH (:Type)<-[:CHALLENGES|STRONG_AGAINST]-(:(Type & Trainer)) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          '(:(Type & Trainer)) has no outgoing [:(CHALLENGES | STRONG_AGAINST)]',
        offsets: {
          end: 63,
          start: 13,
        },
        range: {
          end: {
            character: 63,
            line: 0,
          },
          start: {
            character: 13,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Handles more complex labels on both variables in path segment, v2', () => {
    const query =
      'MATCH (:Type & (Pokemon|Trainer))<-[:BATTLES|(!STRONG_AGAINST & !KNOWS & BATTLES)]-(:Trainer) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          '[:(BATTLES | (!STRONG_AGAINST & !KNOWS & BATTLES))] has no outgoing (:(Type & (Pokemon | Trainer)))',
        offsets: {
          end: 83,
          start: 6,
        },
        range: {
          end: {
            character: 83,
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

  test('Handles more complex labels on both variables in path segment, no false positives v1', () => {
    const query =
      'MATCH (:Type)<-[:CHALLENGES|STRONG_AGAINST]-(:(Pokemon & Trainer)|Type) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Handles more complex labels on both variables in path segment, no false positives v2', () => {
    const query =
      'MATCH (:Type|(Pokemon & Trainer))<-[:BATTLES|(!STRONG_AGAINST & !KNOWS)]-(:Trainer) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Handles ANDed negations on relationship', () => {
    const query =
      'MATCH (:Type)<-[:!CATCHES & !TRAINS & !CHALLENGES & !BATTLES & !IS_IN]-(:Trainer) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          '(:Trainer) has no outgoing [:(!CATCHES & !TRAINS & !CHALLENGES & !BATTLES & !IS_IN)]',
        offsets: {
          end: 81,
          start: 13,
        },
        range: {
          end: {
            character: 81,
            line: 0,
          },
          start: {
            character: 13,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Handles ANDed negations on relationship v2', () => {
    const query =
      'MATCH (:Trainer)<-[:!CATCHES & !TRAINS & !CHALLENGES & !BATTLES & !IS_IN]-(:Pokemon) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          '[:(!CATCHES & !TRAINS & !CHALLENGES & !BATTLES & !IS_IN)] has no outgoing (:Trainer)',
        offsets: {
          end: 74,
          start: 6,
        },
        range: {
          end: {
            character: 74,
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

  test('Handles ANDed negations on node, v1', () => {
    const query =
      'MATCH (:!Type & !Pokemon & !Gym & !Move)<-[:CATCHES|TRAINS]-(x:Trainer) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          '[:(CATCHES | TRAINS)] has no outgoing (:(!Type & !Pokemon & !Gym & !Move))',
        offsets: {
          end: 60,
          start: 6,
        },
        range: {
          end: {
            character: 60,
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

  test('Handles ANDed negations on node, v2', () => {
    const query =
      'MATCH (:Pokemon)<-[:CATCHES|TRAINS|IS_IN]-(x:!Type & !Trainer & !Gym & !Move) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          '(:(!Type & !Trainer & !Gym & !Move)) has no outgoing [:(CATCHES | TRAINS | IS_IN)]',
        offsets: {
          end: 77,
          start: 16,
        },
        range: {
          end: {
            character: 77,
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

  test('No false positives with ANDed negations on relationship', () => {
    const query =
      'MATCH (:Type)<-[:!CATCHES & !TRAINS & !CHALLENGES & !BATTLES & !IS_IN]-(:Pokemon) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('No false positives with ANDed negations on node v1', () => {
    const query =
      'MATCH (:!Type & !Trainer & !Gym & !Move)<-[:CATCHES|TRAINS]-(:Trainer) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('No false positives with ANDed negations on node v2', () => {
    const query =
      'MATCH (:Pokemon)<-[:CATCHES|TRAINS]-(:!Type & !Pokemon & !Gym & !Move) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Handles unfinished rel when reltype is defined', () => {
    const query = 'MATCH (:Gym)-[:WEAK_TO RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '[:WEAK_TO] has no incoming/outgoing (:Gym)',
        offsets: {
          end: 22,
          start: 6,
        },
        range: {
          end: {
            character: 22,
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
        message:
          "Invalid input 'RETURN': expected a parameter, '&', '*', ':', 'WHERE', ']', '{' or '|'",
        offsets: {
          end: 29,
          start: 23,
        },
        range: {
          end: {
            character: 29,
            line: 0,
          },
          start: {
            character: 23,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 32,
          start: 32,
        },
        range: {
          end: {
            character: 32,
            line: 0,
          },
          start: {
            character: 32,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Assumes undirected direction if rel direction is unfinished (expect no path issues when one way of undirected could be true) v1', () => {
    const query = 'MATCH (:Region)-[:IS_IN RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          "Invalid input 'RETURN': expected a parameter, '&', '*', ':', 'WHERE', ']', '{' or '|'",
        offsets: {
          end: 30,
          start: 24,
        },
        range: {
          end: {
            character: 30,
            line: 0,
          },
          start: {
            character: 24,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 33,
          start: 33,
        },
        range: {
          end: {
            character: 33,
            line: 0,
          },
          start: {
            character: 33,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Assumes undirected direction if rel direction is unfinished (expect no path issues when one way of undirected could be true) v2', () => {
    const query = 'MATCH (:Pokemon)<-[:WEAK_TO RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          "Invalid input 'RETURN': expected a parameter, '&', '*', ':', 'WHERE', ']', '{' or '|'",
        offsets: {
          end: 34,
          start: 28,
        },
        range: {
          end: {
            character: 34,
            line: 0,
          },
          start: {
            character: 28,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 37,
          start: 37,
        },
        range: {
          end: {
            character: 37,
            line: 0,
          },
          start: {
            character: 37,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Handles unfinished node when label is defined', () => {
    const query = 'MATCH (:Gym)-[:IS_IN]->(:Pokemon RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '(:Pokemon) has no incoming [:IS_IN]',
        offsets: {
          end: 32,
          start: 12,
        },
        range: {
          end: {
            character: 32,
            line: 0,
          },
          start: {
            character: 12,
            line: 0,
          },
        },
        severity: 2,
      },
      {
        message:
          "Invalid input 'RETURN': expected a parameter, '&', ')', ':', 'WHERE', '{' or '|'",
        offsets: {
          end: 39,
          start: 33,
        },
        range: {
          end: {
            character: 39,
            line: 0,
          },
          start: {
            character: 33,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 42,
          start: 42,
        },
        range: {
          end: {
            character: 42,
            line: 0,
          },
          start: {
            character: 42,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Should not fail on broken rel', () => {
    const query = 'MATCH (n:Gym)<-[ :';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          "Invalid input '': expected a node label/relationship type name, '$', '%' or '('",
        offsets: {
          end: 18,
          start: 18,
        },
        range: {
          end: {
            character: 18,
            line: 0,
          },
          start: {
            character: 18,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 18,
          start: 18,
        },
        range: {
          end: {
            character: 18,
            line: 0,
          },
          start: {
            character: 18,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Should not fail on broken rel v2', () => {
    const query = 'MATCH (n:Gym)<-[';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          "Invalid input '': expected a parameter, a variable name, '*', ':', 'IS', 'WHERE', ']' or '{'",
        offsets: {
          end: 16,
          start: 16,
        },
        range: {
          end: {
            character: 16,
            line: 0,
          },
          start: {
            character: 16,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 16,
          start: 16,
        },
        range: {
          end: {
            character: 16,
            line: 0,
          },
          start: {
            character: 16,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Should not fail on broken node', () => {
    const query = 'MATCH (n)<-[:WEAK_TO]-( ';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          "Invalid input '': expected a parameter, a variable name, ')', ':', 'IS', 'WHERE' or '{'",
        offsets: {
          end: 23,
          start: 23,
        },
        range: {
          end: {
            character: 23,
            line: 0,
          },
          start: {
            character: 23,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 23,
          start: 23,
        },
        range: {
          end: {
            character: 23,
            line: 0,
          },
          start: {
            character: 23,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Should not fail on broken node v2', () => {
    const query = 'MATCH (n)<-[:WEAK_TO]-(m ';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          "Invalid input '': expected a parameter, ')', ':', 'IS', 'WHERE' or '{'",
        offsets: {
          end: 24,
          start: 24,
        },
        range: {
          end: {
            character: 24,
            line: 0,
          },
          start: {
            character: 24,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 24,
          start: 24,
        },
        range: {
          end: {
            character: 24,
            line: 0,
          },
          start: {
            character: 24,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Should not warn on unlabeled nodes/rels', () => {
    const query =
      'MATCH (n)-[]->()-[R]-(m:Trainer)-[]-(q)-[:IS_IN]-() RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Warns both on missing label and path segment at once', () => {
    const query = 'MATCH (n)<-[:MISSED]-(:Archer) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '(:Archer) has no outgoing [:MISSED]',
        offsets: {
          end: 30,
          start: 9,
        },
        range: {
          end: {
            character: 30,
            line: 0,
          },
          start: {
            character: 9,
            line: 0,
          },
        },
        severity: 2,
      },
      {
        message:
          "Relationship type MISSED is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 19,
          start: 13,
        },
        range: {
          end: {
            character: 19,
            line: 0,
          },
          start: {
            character: 13,
            line: 0,
          },
        },
        severity: 2,
      },
      {
        message:
          "Label Archer is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 29,
          start: 23,
        },
        range: {
          end: {
            character: 29,
            line: 0,
          },
          start: {
            character: 23,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Warns on a single negated label on the end node when it is the only target. Rel->Node', () => {
    const query = 'MATCH ()-[:WEAK_TO]->(:!Type) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '(:!Type) has no incoming [:WEAK_TO]',
        offsets: {
          end: 29,
          start: 8,
        },
        range: {
          end: {
            character: 29,
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

  test('Warns on a single negated label on the end node when it is the only target. Rel<-Node', () => {
    const query = 'MATCH ()<-[:KNOWS]-(:!Pokemon) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '(:!Pokemon) has no outgoing [:KNOWS]',
        offsets: {
          end: 30,
          start: 8,
        },
        range: {
          end: {
            character: 30,
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

  test('Does not warn on a single negated label when another target is viable. Rel->Node', () => {
    const query = 'MATCH ()-[:CHALLENGES]->(:!Pokemon) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Warns on a single negated relationship type when it is the only target', () => {
    const query = 'MATCH (:Pokemon)-[:!KNOWS]->(:Move) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '(:Move) has no incoming [:!KNOWS]',
        offsets: {
          end: 35,
          start: 16,
        },
        range: {
          end: {
            character: 35,
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

  test('Does not warn on a negated relationship type when another type is viable', () => {
    const query = 'MATCH (:Pokemon)-[:!CATCHES]->(:Gym) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Does not warn on undirected rel when one direction is viable', () => {
    const query = 'MATCH (:Region)-[:IS_IN]-(:Trainer) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Warns on undirected rel when neither direction is viable', () => {
    const query = 'MATCH (:Region)-[:IS_IN]-(:Pokemon) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '(:Pokemon) has no incoming/outgoing [:IS_IN]',
        offsets: {
          end: 35,
          start: 15,
        },
        range: {
          end: {
            character: 35,
            line: 0,
          },
          start: {
            character: 15,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Warns only on the invalid segment of a multi-hop path', () => {
    const query =
      'MATCH (:Trainer)-[:CATCHES]->(:Pokemon)-[:WEAK_TO]->(:Gym) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '(:Gym) has no incoming [:WEAK_TO]',
        offsets: {
          end: 58,
          start: 39,
        },
        range: {
          end: {
            character: 58,
            line: 0,
          },
          start: {
            character: 39,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Does not warn on a fully valid multi-hop path', () => {
    const query =
      'MATCH (:Trainer)-[:CATCHES]->(:Pokemon)-[:WEAK_TO]->(:Type) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Resolves labels accumulated across clauses on a repeated variable', () => {
    const query = 'MATCH (n:Trainer) MATCH (n)-[:WEAK_TO]->(:Type) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '[:WEAK_TO] has no incoming (:Trainer)',
        offsets: {
          end: 40,
          start: 24,
        },
        range: {
          end: {
            character: 40,
            line: 0,
          },
          start: {
            character: 24,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Does not warn on a self-loop with a viable reltype', () => {
    const query = 'MATCH (n:Pokemon)-[:CHALLENGES]->(n) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Does not warn when the end node label expression is a tautology (any)', () => {
    const query = 'MATCH ()-[:WEAK_TO]->(:Pokemon|!Pokemon) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Does not warn on an OR of negations when a viable label remains', () => {
    const query = 'MATCH (:Type)<-[:WEAK_TO]-(:!Pokemon|!Trainer) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Warns on a label-OR-negation end node when negated label is the only viable one', () => {
    const query = 'MATCH ()-[:WEAK_TO]->(:Gym|!Type) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '(:(Gym | !Type)) has no incoming [:WEAK_TO]',
        offsets: {
          end: 33,
          start: 8,
        },
        range: {
          end: {
            character: 33,
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

  test('Does not warn on a label-OR-negation end node when there is viability via negation condition', () => {
    const query = 'MATCH ()-[:WEAK_TO]->(:Type|!Gym) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Limitation: Does not lint variable-length relationships', () => {
    const query = 'MATCH (:Trainer)-[:WEAK_TO*1..3]->(:Type) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Does not produce a false positive for an ANY (%) first variable', () => {
    const query = 'MATCH (:%)-[:WEAK_TO]->() RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Does not produce a false positive for an ANY (%) ANDed with a label on the first variable', () => {
    const query = 'MATCH (:Pokemon&%)-[:WEAK_TO]->(:Type) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Only warns on the genuinely invalid segment when the first variable is ANY (%)', () => {
    const query = 'MATCH (:%)-[:WEAK_TO]->(:Gym) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '(:Gym) has no incoming [:WEAK_TO]',
        offsets: {
          end: 29,
          start: 10,
        },
        range: {
          end: {
            character: 29,
            line: 0,
          },
          start: {
            character: 10,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  // A NOT-ANY (!%) node matches only label-less nodes. The label-keyed schema
  // does not enumerate connections of label-less nodes, so we cannot prove the
  // segment invalid and must not warn.
  test('Does not warn on a NOT-ANY (!%) first variable. Node->Rel', () => {
    const query = 'MATCH (:!%)-[:WEAK_TO]->() RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Does not warn on a NOT-ANY (!%) first variable. Node<-Rel', () => {
    const query = 'MATCH (:!%)<-[:WEAK_TO]-() RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Handles case where we have legitimate label and a contradiction, v1', () => {
    const query = 'MATCH (:Pokemon | (!% & Trainer))<-[:WEAK_TO]-() RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message: '[:WEAK_TO] has no outgoing (:(Pokemon | (!% & Trainer)))',
        offsets: {
          end: 46,
          start: 6,
        },
        range: {
          end: {
            character: 46,
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

  test('Handles case where we have legitimate label and a contradiction, v2', () => {
    const query =
      'MATCH (:Pokemon | (!Trainer & Trainer))<-[:WEAK_TO]-() RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          '[:WEAK_TO] has no outgoing (:(Pokemon | (!Trainer & Trainer)))',
        offsets: {
          end: 52,
          start: 6,
        },
        range: {
          end: {
            character: 52,
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

  test('Limitation: Does not warn on contradictions like (!% & X)', () => {
    const query = 'MATCH (:!% & Trainer)<-[:WEAK_TO]-() RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Limitation: Does not warn on (contradiction | contradiction)', () => {
    const query =
      'MATCH (:(!% & Pokemon) | (!% & Trainer))<-[:WEAK_TO]-() RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  // A NOT-ANY (!%) relationship is impossible (relationships always have exactly
  // one type), so Neo4j emits its own semantic error. The schema path linter
  // should not pile on a separate connection warning.
  test('Does not add a path warning for a NOT-ANY (!%) rel (only the semantic error)', () => {
    const query = 'MATCH (n:Trainer)<-[:!%]-() RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          'Relationship type expression cannot possibly be satisfied. (`!%` can never be satisfied by any relationship. Relationships must have exactly one relationship type.)',
        offsets: {
          end: 23,
          start: 21,
        },
        range: {
          end: {
            character: 23,
            line: 0,
          },
          start: {
            character: 21,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  // (:Trainer)-[:CATCHES] exists, and [:WEAK_TO]->(:Type) exists, but neither of
  // (:Trainer)-[:CATCHES]->(:Type) nor (:Trainer)-[:WEAK_TO]->(:Type) exist. We could see this from schema and warn
  test('Limitation: Does not check entire tripples for viability', () => {
    const query = 'MATCH (n:Trainer)-[:CATCHES | WEAK_TO]->(:Type) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Limitation: Bails when more than 10 unique viable labels are used in a tree', () => {
    //we should warn like in the test "Handles case where we have legitimate label and a contradiction"
    //But since we have so many labels we bail to avoid possibly slow computation
    const query =
      'MATCH (n:(A & B & C & D & E & F & G & H & I & J & K & !K))-[:R]->(:A) RETURN ""';
    const dbSchema = {
      labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
      relationshipTypes: ['R', 'R2'],
      graphSchema: [
        { from: 'A', relType: 'R', to: 'A' },
        { from: 'B', relType: 'R', to: 'A' },
        { from: 'C', relType: 'R', to: 'A' },
        { from: 'D', relType: 'R', to: 'A' },
        { from: 'E', relType: 'R', to: 'A' },
        { from: 'F', relType: 'R', to: 'A' },
        { from: 'G', relType: 'R', to: 'A' },
        { from: 'H', relType: 'R', to: 'A' },
        { from: 'I', relType: 'R', to: 'A' },
        { from: 'J', relType: 'R', to: 'A' },
        { from: 'K', relType: 'R', to: 'B' },
      ],
    };
    let diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Should not warn on CREATE', () => {
    const query = 'CREATE (n:Person)<-[:WEAK_TO]-()';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Should not warn on INSERT', () => {
    const query = 'INSERT (n:Person)<-[:WEAK_TO]-()';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Should not warn on MERGE', () => {
    const query = 'MERGE (n:Type)-[:IS_IN]->()';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });
});
