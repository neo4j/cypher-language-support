import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import { getDiagnosticsForQuery } from './helpers';

describe('Semantic validation spec', () => {
  test('Semantic errors are not triggered when there are syntactic errors', () => {
    const query = 'METCH (n) RETURN m';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          range: {
            start: Position.create(0, 0),
            end: Position.create(0, 5),
          },
          message: 'Did you mean MATCH?',
          severity: DiagnosticSeverity.Error,
        },
      ],
    });
  });

  test('Undefined variables', () => {
    const query = 'MATCH (n) RETURN m';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 17),
            end: Position.create(0, 18),
          },
          message: 'Variable `m` not defined',
        },
      ],
    });
  });

  test('Semantic errors are accumulated correctly', () => {
    const query = `CALL { MATCH (n) RETURN m} IN TRANSACTIONS OF -1 ROWS`;

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 24),
            end: Position.create(0, 25),
          },
          message: 'Variable `m` not defined',
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 46),
            end: Position.create(0, 48),
          },
          message:
            "Invalid input. '-1' is not a valid value. Must be a positive integer.",
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 0),
            end: Position.create(0, 53),
          },
          message:
            'Query cannot conclude with CALL (must be a RETURN clause, an update clause, a unit subquery call, or a procedure call with no YIELD)',
        },
      ],
    });
  });

  test('Semantic errors are calculated with the most specific rule they can be calculated', () => {
    const query = `CALL { CREATE (x) } IN TRANSACTIONS
    RETURN 1 AS result
    UNION
    CALL { CREATE (x) } IN TRANSACTIONS
    RETURN 2 AS result`;

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: 1,
          range: {
            start: Position.create(0, 0),
            end: Position.create(0, 35),
          },
          message: 'CALL { ... } IN TRANSACTIONS in a UNION is not supported',
        },
        {
          severity: 1,
          range: {
            start: Position.create(3, 4),
            end: Position.create(3, 39),
          },
          message: 'CALL { ... } IN TRANSACTIONS in a UNION is not supported',
        },
      ],
    });
  });

  test('Shadowing of variables', () => {
    const query = `MATCH (a)
    RETURN COUNT {
      MATCH (a)-->(b)
      WITH b as a
      MATCH (b)-->(c)
      RETURN a
    }`;

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: 1,
          range: {
            start: Position.create(3, 16),
            end: Position.create(3, 17),
          },
          message:
            'The variable `a` is shadowing a variable with the same name from the outer scope and needs to be renamed',
        },
      ],
    });
  });

  test('Correctly gives semantic errors for queries with WHERE', () => {
    const query = `MATCH (person:Person)
    WHERE COUNT {
        MATCH (n)
        RETURN n.prop
        UNION ALL
        MATCH (m)
    } > 1
    RETURN person.name`;

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(4, 8),
            end: Position.create(5, 17),
          },
          message:
            'All sub queries in an UNION must have the same return column names',
        },
      ],
    });
  });
});
