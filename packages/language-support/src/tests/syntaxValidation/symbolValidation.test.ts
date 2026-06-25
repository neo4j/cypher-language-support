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
        message:
          'Relationship with label(s) WEAK_TO has no incoming connection to a node with label(s) Trainer.',
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
        message:
          'Relationship with label(s) WEAK_TO has no outgoing connection to a node with label(s) Pokemon.',
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
        message:
          'Node with label(s) Gym has no incoming connection to a relationship with label(s) WEAK_TO.',
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
        message:
          'Node with label(s) Gym has no outgoing connection to a relationship with label(s) WEAK_TO.',
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
        message:
          'Relationship with label(s) WEAK_TO has no connection to a node with label(s) Trainer.',
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
        message:
          'Node with label(s) Gym has no connection to a relationship with label(s) WEAK_TO.',
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
        message:
          'Relationship with label(s) WEAK_TO has no outgoing connection to a node with label(s) (Trainer | Gym).',
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
        message:
          'Relationship with label(s) (WEAK_TO | IS_IN) has no outgoing connection to a node with label(s) Trainer.',
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
        message:
          'Node with label(s) Move has no outgoing connection to a relationship with label(s) (WEAK_TO | IS_IN).',
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
          'Relationship with label(s) WEAK_TO has no outgoing connection to a node with label(s) ((Trainer | Gym) & (Gym | (Trainer & Pokemon))).',
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
        message:
          'Node with label(s) (Trainer | Gym) has no outgoing connection to a relationship with label(s) WEAK_TO.',
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
        message:
          'Relationship with label(s) (WEAK_TO | IS_IN) has no outgoing connection to a node with label(s) Gym.',
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
          'Node with label(s) (Type & Trainer) has no outgoing connection to a relationship with label(s) (CHALLENGES | STRONG_AGAINST).',
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
          'Relationship with label(s) (BATTLES | (STRONG_AGAINST & KNOWS & BATTLES)) has no outgoing connection to a node with label(s) (Type & (Pokemon | Trainer)).',
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

  test('Handles more complex labels on both variables in path segment, no false negatives v1', () => {
    const query =
      'MATCH (:Type)<-[:CHALLENGES|STRONG_AGAINST]-(:(Pokemon & Trainer)|Type) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Handles more complex labels on both variables in path segment, no false negatives v2', () => {
    const query =
      'MATCH (:Type & (Pokemon|Trainer))<-[:BATTLES|(!STRONG_AGAINST & !KNOWS)]-(:Trainer) RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([]);
  });

  test('Handles unfinished rel when reltype is defined', () => {
    const query = 'MATCH (:Gym)-[:WEAK_TO RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 32,
          start: 0,
        },
        range: {
          end: {
            character: 32,
            line: 0,
          },
          start: {
            character: 0,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'Relationship with label(s) WEAK_TO has no connection to a node with label(s) Gym.',
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
    ]);
  });

  test('Assumes bidirectional direction if rel direction is unfinished (expect no path issues when one way of bidirectional could be true) v1', () => {
    const query = 'MATCH (:Region)-[:IS_IN RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 33,
          start: 0,
        },
        range: {
          end: {
            character: 33,
            line: 0,
          },
          start: {
            character: 0,
            line: 0,
          },
        },
        severity: 1,
      },
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
    ]);
  });

  test('Assumes bidirectional direction if rel direction is unfinished (expect no path issues when one way of bidirectional could be true) v2', () => {
    const query = 'MATCH (:Pokemon)<-[:WEAK_TO RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 37,
          start: 0,
        },
        range: {
          end: {
            character: 37,
            line: 0,
          },
          start: {
            character: 0,
            line: 0,
          },
        },
        severity: 1,
      },
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
    ]);
  });

  test('Handles unfinished node when label is defined', () => {
    const query = 'MATCH (:Gym)-[:IS_IN]->(:Pokemon RETURN ""';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 42,
          start: 0,
        },
        range: {
          end: {
            character: 42,
            line: 0,
          },
          start: {
            character: 0,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'Node with label(s) Pokemon has no incoming connection to a relationship with label(s) IS_IN.',
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
    ]);
  });

  test('Should not fail on broken rel', () => {
    const query = 'MATCH (n:Gym)<-[ :';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 18,
          start: 0,
        },
        range: {
          end: {
            character: 18,
            line: 0,
          },
          start: {
            character: 0,
            line: 0,
          },
        },
        severity: 1,
      },
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
    ]);
  });

  test('Should not fail on broken rel v2', () => {
    const query = 'MATCH (n:Gym)<-[';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 16,
          start: 0,
        },
        range: {
          end: {
            character: 16,
            line: 0,
          },
          start: {
            character: 0,
            line: 0,
          },
        },
        severity: 1,
      },
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
    ]);
  });

  test('Should not fail on broken node', () => {
    const query = 'MATCH (n)<-[:WEAK_TO]-( ';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 23,
          start: 0,
        },
        range: {
          end: {
            character: 23,
            line: 0,
          },
          start: {
            character: 0,
            line: 0,
          },
        },
        severity: 1,
      },
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
    ]);
  });

  test('Should not fail on broken node v2', () => {
    const query = 'MATCH (n)<-[:WEAK_TO]-(m ';
    const diagnostics = getDiagnosticsForQuery({ query, dbSchema });
    expect(diagnostics).toEqual([
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 24,
          start: 0,
        },
        range: {
          end: {
            character: 24,
            line: 0,
          },
          start: {
            character: 0,
            line: 0,
          },
        },
        severity: 1,
      },
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
        message:
          'Node with label(s) Archer has no outgoing connection to a relationship with label(s) MISSED.',
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
