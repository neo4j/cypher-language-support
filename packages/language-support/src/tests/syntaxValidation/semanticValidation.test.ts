import { _internalFeatureFlags } from '../../featureFlags';
import { testData } from '../testData';
import { getDiagnosticsForQuery } from './helpers';

describe('Semantic validation spec', () => {
  test('SyntaxChecker-exceptions work', () => {
    const query = 'ALTER DATABASE neo4j SET DEFAULT LANGUAGE CYPHER 25000';
    const diagnostics = getDiagnosticsForQuery({ query });
    expect(diagnostics).toEqual([
      {
        message:
          "Invalid Cypher version '25000'. Valid Cypher versions are: 5, 25",
        offsets: {
          end: 54,
          start: 49,
        },
        range: {
          end: {
            character: 54,
            line: 0,
          },
          start: {
            character: 49,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Semantic analysis is dependant on cypher version', () => {
    const query1 = 'CYPHER  5 MATCH (n)-[r]->(m) SET r += m';
    const diagnostics1 = getDiagnosticsForQuery({ query: query1 });
    const query2 = 'CYPHER 25 MATCH (n)-[r]->(m) SET r += m';
    const diagnostics2 = getDiagnosticsForQuery({ query: query2 });
    expect(diagnostics1[0].message).not.toEqual(diagnostics2[0].message);
    expect(diagnostics1).toEqual([
      {
        message:
          'The use of nodes or relationships for setting properties is deprecated and will be removed in a future version. Please use properties() instead.',
        offsets: {
          end: 39,
          start: 38,
        },
        range: {
          end: {
            character: 39,
            line: 0,
          },
          start: {
            character: 38,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
    expect(diagnostics2).toEqual([
      {
        message: 'Type mismatch: expected Map but was Node',
        offsets: {
          end: 39,
          start: 38,
        },
        range: {
          end: {
            character: 39,
            line: 0,
          },
          start: {
            character: 38,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Semantic analysis defaults to cypher 5 when no default version is given, and no version is given in query', () => {
    const query1 = 'CYPHER  5 MATCH (n)-[r]->(m) SET r += m';
    const diagnostics1 = getDiagnosticsForQuery({ query: query1 });
    const query2 = 'MATCH (n)-[r]->(m) SET r += m';
    const diagnostics2 = getDiagnosticsForQuery({ query: query2 });
    expect(diagnostics1[0].message).toEqual(diagnostics2[0].message);
    expect(diagnostics1).toEqual([
      {
        message:
          'The use of nodes or relationships for setting properties is deprecated and will be removed in a future version. Please use properties() instead.',
        offsets: {
          end: 39,
          start: 38,
        },
        range: {
          end: {
            character: 39,
            line: 0,
          },
          start: {
            character: 38,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
    expect(diagnostics2).toEqual([
      {
        message:
          'The use of nodes or relationships for setting properties is deprecated and will be removed in a future version. Please use properties() instead.',
        offsets: {
          end: 29,
          start: 28,
        },
        range: {
          end: {
            character: 29,
            line: 0,
          },
          start: {
            character: 28,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Faulty cypher version in the preparser yields an error', () => {
    const query1 = 'CYPHER  50 MATCH (n)-[r]->(m) SET r += m';
    const diagnostics1 = getDiagnosticsForQuery({ query: query1 });
    const query2 = 'CYPHER 007 MATCH (n)-[r]->(m) SET r += m';
    const diagnostics2 = getDiagnosticsForQuery({ query: query2 });
    expect(diagnostics1).toEqual([
      {
        message:
          '50 is not a valid option for cypher version. Valid options are: 5, 25',
        offsets: {
          end: 10,
          start: 8,
        },
        range: {
          end: {
            character: 10,
            line: 0,
          },
          start: {
            character: 8,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
    expect(diagnostics2).toEqual([
      {
        message:
          '007 is not a valid option for cypher version. Valid options are: 5, 25',
        offsets: {
          end: 10,
          start: 7,
        },
        range: {
          end: {
            character: 10,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Faulty cypher versions with periods yields expected errors', () => {
    const query1 = 'CYPHER  1.0.2.0 MATCH (n)-[r]->(m) RETURN n';
    const diagnostics1 = getDiagnosticsForQuery({ query: query1 });
    const query2 = 'CYPHER 00.1 MATCH (n)-[r]->(m) RETURN n';
    const diagnostics2 = getDiagnosticsForQuery({ query: query2 });
    const query3 = 'CYPHER 030.1..1 MATCH (n)-[r]->(m) RETURN n';
    const diagnostics3 = getDiagnosticsForQuery({ query: query3 });
    expect(diagnostics1).toEqual([
      {
        message:
          '1.0.2.0 is not a valid option for cypher version. Valid options are: 5, 25',
        offsets: {
          end: 15,
          start: 8,
        },
        range: {
          end: {
            character: 15,
            line: 0,
          },
          start: {
            character: 8,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
    expect(diagnostics2).toEqual([
      {
        message:
          '00.1 is not a valid option for cypher version. Valid options are: 5, 25',
        offsets: {
          end: 11,
          start: 7,
        },
        range: {
          end: {
            character: 11,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
    expect(diagnostics3).toEqual([
      {
        message:
          '030.1 is not a valid option for cypher version. Valid options are: 5, 25',
        offsets: {
          end: 12,
          start: 7,
        },
        range: {
          end: {
            character: 12,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Semantic analysis uses default language if no language is defined in query', () => {
    const query1 = 'MATCH (n)-[r]->(m) SET r += m';
    const diagnostics1 = getDiagnosticsForQuery({
      query: query1,
      dbSchema: { defaultLanguage: 'CYPHER 25' },
    });
    const query2 = 'CYPHER 25 MATCH (n)-[r]->(m) SET r += m';
    const diagnostics2 = getDiagnosticsForQuery({ query: query2 });
    expect(diagnostics1[0].message).toEqual(diagnostics2[0].message);
    expect(diagnostics1).toEqual([
      {
        message: 'Type mismatch: expected Map but was Node',
        offsets: {
          end: 29,
          start: 28,
        },
        range: {
          end: {
            character: 29,
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
    expect(diagnostics2).toEqual([
      {
        message: 'Type mismatch: expected Map but was Node',
        offsets: {
          end: 39,
          start: 38,
        },
        range: {
          end: {
            character: 39,
            line: 0,
          },
          start: {
            character: 38,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('In-query version takes priority for semantic analysis even if defaultLanguage is defined', () => {
    const query1 = 'CYPHER 5 MATCH (n)-[r]->(m) SET r += m';
    const diagnostics1 = getDiagnosticsForQuery({
      query: query1,
      dbSchema: { defaultLanguage: 'CYPHER 25' },
    });
    const query2 = 'CYPHER 25 MATCH (n)-[r]->(m) SET r += m';
    const diagnostics2 = getDiagnosticsForQuery({ query: query2 });
    expect(diagnostics1[0].message).not.toEqual(diagnostics2[0].message);
    expect(diagnostics1).toEqual([
      {
        message:
          'The use of nodes or relationships for setting properties is deprecated and will be removed in a future version. Please use properties() instead.',
        offsets: {
          end: 38,
          start: 37,
        },
        range: {
          end: {
            character: 38,
            line: 0,
          },
          start: {
            character: 37,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
    expect(diagnostics2).toEqual([
      {
        message: 'Type mismatch: expected Map but was Node',
        offsets: {
          end: 39,
          start: 38,
        },
        range: {
          end: {
            character: 39,
            line: 0,
          },
          start: {
            character: 38,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Does not trigger semantic errors when there are irrecoverable syntactic errors', () => {
    const query = 'METCH (n) RETURN m';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'Expected any of CYPHER, EXPLAIN, PROFILE or a statement',
        offsets: {
          end: 5,
          start: 0,
        },
        range: {
          end: {
            character: 5,
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
          "Invalid input 'METCH': expected 'ALTER', 'ORDER BY', 'CALL', 'USING PERIODIC COMMIT', 'CREATE', 'LOAD CSV', 'START DATABASE', 'STOP DATABASE', 'DEALLOCATE', 'DELETE', 'DENY', 'DETACH', 'DROP', 'DRYRUN', 'FINISH', 'FOREACH', 'GRANT', 'INSERT', 'LIMIT', 'MATCH', 'MERGE', 'NODETACH', 'OFFSET', 'OPTIONAL', 'REALLOCATE', 'REMOVE', 'RENAME', 'RETURN', 'REVOKE', 'ENABLE SERVER', 'SET', 'SHOW', 'SKIP', 'TERMINATE', 'UNWIND', 'USE' or 'WITH'",
        offsets: {
          end: 5,
          start: 0,
        },
        range: {
          end: {
            character: 5,
            line: 0,
          },
          start: {
            character: 0,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors for undefined variables', () => {
    const query = 'MATCH (n) RETURN m';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'Variable `m` not defined',
        offsets: {
          end: 18,
          start: 17,
        },
        range: {
          end: {
            character: 18,
            line: 0,
          },
          start: {
            character: 17,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors for undefined variables on queries that are not completed', () => {
    const query = 'MATCH (n) RETURN a,b,n,c,';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'Variable `a` not defined',
        offsets: {
          end: 25,
          start: 17,
        },
        range: {
          end: {
            character: 25,
            line: 0,
          },
          start: {
            character: 17,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: 'Variable `b` not defined',
        offsets: {
          end: 20,
          start: 19,
        },
        range: {
          end: {
            character: 20,
            line: 0,
          },
          start: {
            character: 19,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: 'Variable `c` not defined',
        offsets: {
          end: 24,
          start: 23,
        },
        range: {
          end: {
            character: 24,
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
        message: "Invalid input '': expected an expression",
        offsets: {
          end: 25,
          start: 25,
        },
        range: {
          end: {
            character: 25,
            line: 0,
          },
          start: {
            character: 25,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Handles multiple statements in semantic analysis', () => {
    const query = `MATCH (n) RETURN m;
    
    match (m) return 
    n
    `;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'Variable `m` not defined',
        offsets: {
          end: 18,
          start: 17,
        },
        range: {
          end: {
            character: 18,
            line: 0,
          },
          start: {
            character: 17,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: 'Variable `n` not defined',
        offsets: {
          end: 52,
          start: 51,
        },
        range: {
          end: {
            character: 5,
            line: 3,
          },
          start: {
            character: 4,
            line: 3,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Semantic errors work using empty preparser options. Like CYPHER <rest of query', () => {
    const query = `CYPHER MATCH (n);
                   CYPHER MATCH (m) RETURN n`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 16,
          start: 7,
        },
        range: {
          end: {
            character: 16,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: 'Variable `n` not defined',
        offsets: {
          end: 62,
          start: 61,
        },
        range: {
          end: {
            character: 44,
            line: 1,
          },
          start: {
            character: 43,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Semantic errors work using both version syntax and key-value syntax for preparser options. Like CYPHER <version> <option> = <value>', () => {
    const query = `CYPHER 25 runtime = pipelined timeout = 1000 MATCH (n);
                   CYPHER 5 timeout= 555 MATCH (m) RETURN n`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 54,
          start: 45,
        },
        range: {
          end: {
            character: 54,
            line: 0,
          },
          start: {
            character: 45,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: 'Variable `n` not defined',
        offsets: {
          end: 115,
          start: 114,
        },
        range: {
          end: {
            character: 59,
            line: 1,
          },
          start: {
            character: 58,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Semantic errors work with preparser option CYPHER <option> = <value>', () => {
    const query = `CYPHER runtime = pipelined timeout   = 1000 MATCH (n);
                   CYPHER planner=cost MATCH (m) RETURN n`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 53,
          start: 44,
        },
        range: {
          end: {
            character: 53,
            line: 0,
          },
          start: {
            character: 44,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: 'Variable `n` not defined',
        offsets: {
          end: 112,
          start: 111,
        },
        range: {
          end: {
            character: 57,
            line: 1,
          },
          start: {
            character: 56,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Semantic errors work with preparser option CYPHER <version>', () => {
    const query = `CYPHER 25 MATCH (n);
                   CYPHER 5 MATCH (m) RETURN n`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 19,
          start: 10,
        },
        range: {
          end: {
            character: 19,
            line: 0,
          },
          start: {
            character: 10,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: 'Variable `n` not defined',
        offsets: {
          end: 67,
          start: 66,
        },
        range: {
          end: {
            character: 46,
            line: 1,
          },
          start: {
            character: 45,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Semantic errors work when we also have preparser options', () => {
    const query = `EXPLAIN MATCH (n);
                   PROFILE MATCH (m) RETURN n`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 17,
          start: 8,
        },
        range: {
          end: {
            character: 17,
            line: 0,
          },
          start: {
            character: 8,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: 'Variable `n` not defined',
        offsets: {
          end: 64,
          start: 63,
        },
        range: {
          end: {
            character: 45,
            line: 1,
          },
          start: {
            character: 44,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Surfaces notifications correctly', () => {
    const query = `
    MATCH (shadowed)
    CALL {
      MATCH (shadowed)-[]->(m) // warning here
      RETURN m
    }
    RETURN *
    `;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'CALL subquery without a variable scope clause is now deprecated. Use CALL () { ... }',
        offsets: {
          end: 100,
          start: 26,
        },
        range: {
          end: {
            character: 5,
            line: 5,
          },
          start: {
            character: 4,
            line: 2,
          },
        },
        severity: 2,
      },
      {
        message:
          'Variable in subquery is shadowing a variable with the same name from the outer scope. If you want to use that variable instead, it must be imported into the subquery using importing WITH clause. (the shadowing variable is: shadowed)',
        offsets: {
          end: 54,
          start: 46,
        },
        range: {
          end: {
            character: 21,
            line: 3,
          },
          start: {
            character: 13,
            line: 3,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Accumulates several semantic errors', () => {
    const query = `CALL () { MATCH (n) RETURN m} IN TRANSACTIONS OF -1 ROWS`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Query cannot conclude with CALL (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 56,
          start: 0,
        },
        range: {
          end: {
            character: 56,
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
        message: 'Variable `m` not defined',
        offsets: {
          end: 28,
          start: 27,
        },
        range: {
          end: {
            character: 28,
            line: 0,
          },
          start: {
            character: 27,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          "Invalid input. '-1' is not a valid value. Must be a positive integer.",
        offsets: {
          end: 51,
          start: 49,
        },
        range: {
          end: {
            character: 51,
            line: 0,
          },
          start: {
            character: 49,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors for CALL IN TXs used in UNION', () => {
    const query = `CALL () { CREATE (x) } IN TRANSACTIONS
      RETURN 1 AS result
      UNION
      CALL () { CREATE (x) } IN TRANSACTIONS
      RETURN 2 AS result`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'CALL { ... } IN TRANSACTIONS in a UNION is not supported',
        offsets: {
          end: 145,
          start: 0,
        },
        range: {
          end: {
            character: 24,
            line: 4,
          },
          start: {
            character: 0,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: 'CALL { ... } IN TRANSACTIONS in a UNION is not supported',
        offsets: {
          end: 145,
          start: 82,
        },
        range: {
          end: {
            character: 24,
            line: 4,
          },
          start: {
            character: 6,
            line: 3,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors for CALL when return variable already bound', () => {
    const query = `WITH 1 AS i
      CALL () {
        WITH 2 AS i
        RETURN *
          UNION
        WITH 3 AS i
        RETURN *
      }
      RETURN i`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Variable in subquery is shadowing a variable with the same name from the outer scope. If you want to use that variable instead, it must be imported into the subquery using importing WITH clause. (the shadowing variable is: i)',
        offsets: {
          end: 47,
          start: 46,
        },
        range: {
          end: {
            character: 19,
            line: 2,
          },
          start: {
            character: 18,
            line: 2,
          },
        },
        severity: 2,
      },
      {
        message: 'Variable `i` already declared in outer scope',
        offsets: {
          end: 64,
          start: 56,
        },
        range: {
          end: {
            character: 16,
            line: 3,
          },
          start: {
            character: 8,
            line: 3,
          },
        },
        severity: 1,
      },
      {
        message:
          'Variable in subquery is shadowing a variable with the same name from the outer scope. If you want to use that variable instead, it must be imported into the subquery using importing WITH clause. (the shadowing variable is: i)',
        offsets: {
          end: 100,
          start: 99,
        },
        range: {
          end: {
            character: 19,
            line: 5,
          },
          start: {
            character: 18,
            line: 5,
          },
        },
        severity: 2,
      },
      {
        message: 'Variable `i` already declared in outer scope',
        offsets: {
          end: 117,
          start: 109,
        },
        range: {
          end: {
            character: 16,
            line: 6,
          },
          start: {
            character: 8,
            line: 6,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors for subquery with only WITH', () => {
    const query = 'WITH 1 AS a CALL (a) { WITH a } RETURN a';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Query cannot conclude with WITH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
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

  test('Does not show errors for multiple USE with the same database', () => {
    const query = `USE x
        WITH 1 AS a
        CALL () {
          USE x
          RETURN 2 AS b
        }
        RETURN *`;

    expect(getDiagnosticsForQuery({ query })).toEqual([]);
  });

  test('Shows errors for using multiple USE with different databases', () => {
    const query = `USE neo4j
        WITH 1 AS a
        CALL () {
          USE other
          RETURN 2 AS b
        }
        RETURN *`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: `Multiple graphs in the same query not allowed here. This feature is only available on composite databases.
Attempted to access graph other`,
        offsets: {
          end: 91,
          start: 58,
        },
        range: {
          end: {
            character: 23,
            line: 4,
          },
          start: {
            character: 10,
            line: 3,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors for simple shadowing of variables', () => {
    const query = `MATCH (a)
      RETURN COUNT {
        MATCH (a)-->(b)
        WITH b as a
        MATCH (b)-->(c)
        RETURN a
      }`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'The variable `a` is shadowing a variable with the same name from the outer scope and needs to be renamed',
        offsets: {
          end: 74,
          start: 73,
        },
        range: {
          end: {
            character: 19,
            line: 3,
          },
          start: {
            character: 18,
            line: 3,
          },
        },
        severity: 1,
      },
    ]);
  });

  // This test avoids a regression in the transpilation Java -> Javascript that we found at some point
  test('Shows errors for queries with WHERE', () => {
    const query = `MATCH (person:Person)
      WHERE COUNT {
          MATCH (n)
          RETURN n.prop
          UNION ALL
          MATCH (m)
      } > 1
      RETURN person.name`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'All sub queries in an UNION must have the same return column names',
        offsets: {
          end: 125,
          start: 96,
        },
        range: {
          end: {
            character: 19,
            line: 5,
          },
          start: {
            character: 10,
            line: 4,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors for COLLECT without a single RETURN', () => {
    const query = `RETURN COLLECT { MATCH (a) }`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'A Collect Expression must end with a single return column.',
        offsets: {
          end: 28,
          start: 7,
        },
        range: {
          end: {
            character: 28,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, a FINISH clause, an update clause, a unit subquery call, or a procedure call with no YIELD).',
        offsets: {
          end: 26,
          start: 17,
        },
        range: {
          end: {
            character: 26,
            line: 0,
          },
          start: {
            character: 17,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Does not show errors for a correct COLLECT', () => {
    const query = `MATCH (a)
        WHERE COLLECT {
          MATCH (a)
          RETURN a.prop
        }[0] = a
        RETURN a
        `;

    expect(getDiagnosticsForQuery({ query })).toEqual([]);
  });

  // This is returning errors in a different order
  test('Shows errors for COLLECT with updating subqueries', () => {
    const query = `MATCH (a)
      RETURN COLLECT { SET a.name = 1 }
      `;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'A Collect Expression cannot contain any updates',
        offsets: {
          end: 49,
          start: 23,
        },
        range: {
          end: {
            character: 39,
            line: 1,
          },
          start: {
            character: 13,
            line: 1,
          },
        },
        severity: 1,
      },
      {
        message: 'A Collect Expression must end with a single return column.',
        offsets: {
          end: 49,
          start: 23,
        },
        range: {
          end: {
            character: 39,
            line: 1,
          },
          start: {
            character: 13,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors for shadowing inside COLLECT subqueries', () => {
    const query = `WITH 5 as aNum
      MATCH (a)
      RETURN COLLECT {
        WITH 6 as aNum
        MATCH (a)-->(b) WHERE b.prop = aNum
        RETURN a
      }`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'The variable `aNum` is shadowing a variable with the same name from the outer scope and needs to be renamed',
        offsets: {
          end: 76,
          start: 72,
        },
        range: {
          end: {
            character: 22,
            line: 3,
          },
          start: {
            character: 18,
            line: 3,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors for nested CALL inside COLLECT subqueries', () => {
    const query = `WITH 5 AS y
      RETURN COLLECT {
          UNWIND [0, 1, 2] AS x
          CALL (x) {
              RETURN x * 10 AS y
          }
          RETURN y
      }`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'The variable `y` is shadowing a variable with the same name from the outer scope and needs to be renamed',
        offsets: {
          end: 120,
          start: 119,
        },
        range: {
          end: {
            character: 32,
            line: 4,
          },
          start: {
            character: 31,
            line: 4,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors for EXISTS with updating subqueries', () => {
    const query = `MATCH (a)
      RETURN EXISTS { MATCH (b) MERGE (b)-[:FOLLOWS]->(:Person) }`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'An Exists Expression cannot contain any updates',
        offsets: {
          end: 75,
          start: 23,
        },
        range: {
          end: {
            character: 65,
            line: 1,
          },
          start: {
            character: 13,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Does not show errors for a correct EXISTS', () => {
    const query = `MATCH (a)
        RETURN EXISTS {
          MATCH (a)-[:KNOWS]->(b)
          RETURN b.name as name
          UNION ALL
          MATCH (a)-[:LOVES]->(b)
          RETURN b.name as name
        }`;

    expect(getDiagnosticsForQuery({ query })).toEqual([]);
  });

  test('Shows errors about semantic features not enabled in Cypher 5', () => {
    const query = 'CYPHER 5 MATCH DIFFERENT RELATIONSHIP (n) RETURN n';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Match modes such as `DIFFERENT RELATIONSHIPS` are not supported in Cypher 5.',
        offsets: {
          end: 37,
          start: 15,
        },
        range: {
          end: {
            character: 37,
            line: 0,
          },
          start: {
            character: 15,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors for pattern selectors', () => {
    const query = `MATCH
          p1 = ANY 2 PATHS (a)-->*(c)-->(c),
          p2 = (x)-->*(c)-->(z)
        RETURN count(*)`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Multiple path patterns cannot be used in the same clause in combination with a selective path selector.',
        offsets: {
          end: 82,
          start: 16,
        },
        range: {
          end: {
            character: 31,
            line: 2,
          },
          start: {
            character: 10,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Accumulates errors in Graph Pattern Matching', () => {
    const query = `MATCH (p = (a)--(b))+ (p = (c)--(d))+ RETURN p`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Assigning a path in a quantified path pattern is not yet supported.',
        offsets: {
          end: 19,
          start: 7,
        },
        range: {
          end: {
            character: 19,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'The variable `p` occurs in multiple quantified path patterns and needs to be renamed.',
        offsets: {
          end: 19,
          start: 7,
        },
        range: {
          end: {
            character: 19,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: 'Variable `p` already declared',
        offsets: {
          end: 37,
          start: 22,
        },
        range: {
          end: {
            character: 37,
            line: 0,
          },
          start: {
            character: 22,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'Assigning a path in a quantified path pattern is not yet supported.',
        offsets: {
          end: 35,
          start: 23,
        },
        range: {
          end: {
            character: 35,
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

  test('Shows errors for type mismatch and subpath assignment in Graph Pattern Matching', () => {
    const query = 'MATCH (p = (a)--(b))+ (p = (c)--(d)) RETURN p';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Assigning a path in a quantified path pattern is not yet supported.',
        offsets: {
          end: 19,
          start: 7,
        },
        range: {
          end: {
            character: 19,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: 'Sub-path assignment is currently not supported.',
        offsets: {
          end: 35,
          start: 23,
        },
        range: {
          end: {
            character: 35,
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
        message: 'Variable `p` already declared',
        offsets: {
          end: 35,
          start: 23,
        },
        range: {
          end: {
            character: 35,
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

  test('Shows errors for nesting of quantified path patterns', () => {
    const query = 'MATCH ((a)-->(b)-[r]->*(c))+ RETURN count(*)';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'Quantified path patterns are not allowed to be nested.',
        offsets: {
          end: 22,
          start: 16,
        },
        range: {
          end: {
            character: 22,
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

  test('Shows errors when using shortestPath in quantified path patterns', () => {
    const query = 'MATCH (p = shortestPath((a)-[]->(b)))+ RETURN p';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Assigning a path in a quantified path pattern is not yet supported.',
        offsets: {
          end: 36,
          start: 7,
        },
        range: {
          end: {
            character: 36,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'shortestPath(...) is only allowed as a top-level element and not inside a quantified path pattern',
        offsets: {
          end: 36,
          start: 11,
        },
        range: {
          end: {
            character: 36,
            line: 0,
          },
          start: {
            character: 11,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          "Mixing variable-length relationships ('-[*]-') with quantified relationships ('()-->*()') or quantified path patterns ('(()-->())*') is not allowed.",
        offsets: {
          end: 32,
          start: 27,
        },
        range: {
          end: {
            character: 32,
            line: 0,
          },
          start: {
            character: 27,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'The use of shortestPath and allShortestPaths with fixed length relationships is deprecated and will be removed in a future version. Please use a path with a length of 1 [r*1..1] instead or a Match with a limit.',
        offsets: {
          end: 32,
          start: 27,
        },
        range: {
          end: {
            character: 32,
            line: 0,
          },
          start: {
            character: 27,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Shows errors on quantified path patterns without relationship', () => {
    const query = 'MATCH ((n) (m)){1, 5} RETURN count(*)';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: `A quantified path pattern needs to have at least one relationship.
In this case, the quantified path pattern ((n) (m)){1, 5} consists of only nodes.`,
        offsets: {
          end: 21,
          start: 6,
        },
        range: {
          end: {
            character: 21,
            line: 0,
          },
          start: {
            character: 6,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: `Juxtaposition is currently only supported for quantified path patterns.
In this case, both (n) and (m) are single nodes.
That is, neither of these is a quantified path pattern.`,
        offsets: {
          end: 14,
          start: 11,
        },
        range: {
          end: {
            character: 14,
            line: 0,
          },
          start: {
            character: 11,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors on quantified path patterns with variables not bound in a previous MATCH', () => {
    const query =
      'MATCH p=(x)-->(y), ((a)-[e]->(b {h: nodes(p)[0].prop}))* (s)-->(u) RETURN count(*)';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: `From within a quantified path pattern, one may only reference variables, that are already bound in a previous \`MATCH\` clause.
In this case, \`p\` is defined in the same \`MATCH\` clause as ((a)-[e]->(b {h: (nodes(p)[0]).prop}))*.`,
        offsets: {
          end: 66,
          start: 6,
        },
        range: {
          end: {
            character: 66,
            line: 0,
          },
          start: {
            character: 6,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors on variable length relationships in quantified patterns', () => {
    const query = 'MATCH ()-[r:A*1..2]->{1,2}() RETURN r';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: `Mixing variable-length relationships ('-[*]-') with quantified relationships ('()-->*()') or quantified path patterns ('(()-->())*') is not allowed.`,
        offsets: {
          end: 21,
          start: 8,
        },
        range: {
          end: {
            character: 21,
            line: 0,
          },
          start: {
            character: 8,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'Variable length relationships cannot be part of a quantified path pattern.',
        offsets: {
          end: 21,
          start: 8,
        },
        range: {
          end: {
            character: 21,
            line: 0,
          },
          start: {
            character: 8,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Does not show errors for correct Graph Pattern Matching queries', () => {
    const query =
      'MATCH ((a)-[r]-(b WHERE r.prop = COUNT { MATCH ALL ((c)-[q]-(d))+ RETURN q } ))+ RETURN 1';

    expect(getDiagnosticsForQuery({ query })).toEqual([]);
  });

  test('Shows errors on pattern expression when used wherever we do not expect a boolean value', () => {
    const query = 'MATCH (a) RETURN (a)--()';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'A pattern expression should only be used in order to test the existence of a pattern. It should therefore only be used in contexts that evaluate to a boolean, e.g. inside the function exists() or in a WHERE-clause. No other uses are allowed, instead they should be replaced by a pattern comprehension.',
        offsets: {
          end: 24,
          start: 17,
        },
        range: {
          end: {
            character: 24,
            line: 0,
          },
          start: {
            character: 17,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors for pattern expressions used inside size()', () => {
    const query = 'MATCH (a) RETURN size((a)--())';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'A pattern expression should only be used in order to test the existence of a pattern. It can no longer be used inside the function size(), an alternative is to replace size() with COUNT {}.',
        offsets: {
          end: 29,
          start: 22,
        },
        range: {
          end: {
            character: 29,
            line: 0,
          },
          start: {
            character: 22,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Does not show errors for pattern expression used as a boolean value', () => {
    const query = 'RETURN NOT ()--()';

    expect(getDiagnosticsForQuery({ query })).toEqual([]);
  });

  test('Shows errors for label expressions containing |:', () => {
    const query = 'MATCH (n:A|:B) RETURN n';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: "Label expressions are not allowed to contain '|:'.",
        offsets: {
          end: 13,
          start: 10,
        },
        range: {
          end: {
            character: 13,
            line: 0,
          },
          start: {
            character: 10,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors for label expressions mixing IS with semicolon', () => {
    const query = 'MATCH (n IS A:B) RETURN n';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          "Mixing the IS keyword with colon (':') between labels is not allowed. This expression could be expressed as IS A&B.",
        offsets: {
          end: 15,
          start: 13,
        },
        range: {
          end: {
            character: 15,
            line: 0,
          },
          start: {
            character: 13,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('gives error on console commands when they are disabled', () => {
    _internalFeatureFlags.consoleCommands = true;

    expect(
      getDiagnosticsForQuery({ query: 'RETURN a;:clear; RETURN b;:history;' }),
    ).toEqual([
      {
        message: 'Variable `a` not defined',
        offsets: {
          end: 8,
          start: 7,
        },
        range: {
          end: {
            character: 8,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: 'Variable `b` not defined',
        offsets: {
          end: 25,
          start: 24,
        },
        range: {
          end: {
            character: 25,
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
    _internalFeatureFlags.consoleCommands = false;
  });

  test('Handles multiple cypher statements in a single query', () => {
    _internalFeatureFlags.consoleCommands = true;
    expect(getDiagnosticsForQuery({ query: 'RETURN a; RETURN b;' })).toEqual([
      {
        message: 'Variable `a` not defined',
        offsets: {
          end: 8,
          start: 7,
        },
        range: {
          end: {
            character: 8,
            line: 0,
          },
          start: {
            character: 7,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: 'Variable `b` not defined',
        offsets: {
          end: 18,
          start: 17,
        },
        range: {
          end: {
            character: 18,
            line: 0,
          },
          start: {
            character: 17,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
    _internalFeatureFlags.consoleCommands = false;
  });

  test('Handles cypher mixed with client commands', () => {
    _internalFeatureFlags.consoleCommands = true;
    expect(
      getDiagnosticsForQuery({
        query: ':clear;RETURN a;:clear; RETURN b;:history;',
      }),
    ).toEqual([
      {
        message: 'Variable `a` not defined',
        offsets: {
          end: 15,
          start: 14,
        },
        range: {
          end: {
            character: 15,
            line: 0,
          },
          start: {
            character: 14,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message: 'Variable `b` not defined',
        offsets: {
          end: 32,
          start: 31,
        },
        range: {
          end: {
            character: 32,
            line: 0,
          },
          start: {
            character: 31,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
    _internalFeatureFlags.consoleCommands = false;
  });

  test('Handles cypher mixed with complex client command', () => {
    _internalFeatureFlags.consoleCommands = true;
    expect(
      getDiagnosticsForQuery({
        query: `
      :param {

        d : 343

      }
      ;RETURN a;`,
      }),
    ).toEqual([
      {
        message: 'Variable `a` not defined',
        offsets: {
          end: 57,
          start: 56,
        },
        range: {
          end: {
            character: 15,
            line: 6,
          },
          start: {
            character: 14,
            line: 6,
          },
        },
        severity: 1,
      },
    ]);
    _internalFeatureFlags.consoleCommands = false;
  });

  test('Does not error on SHORTEST k', () => {
    expect(
      getDiagnosticsForQuery({
        query: `MATCH p = SHORTEST 2 (a)-[]-+(b)
             WHERE a.name = "foo" AND b.name = "bar"
             RETURN [n in nodes(p) | n.name] AS stops;`,
        dbSchema: testData.mockSchema,
      }),
    ).toEqual([]);
  });

  test('Does not error on dynamic labels', () => {
    expect(
      getDiagnosticsForQuery({
        query: `MATCH (n)
                SET n:$("label")`,
        dbSchema: testData.mockSchema,
      }),
    ).toEqual([]);
  });

  test('Does not error on dynamic properties', () => {
    expect(
      getDiagnosticsForQuery({
        query: `MATCH (n)
                SET n["prop"] = "some value"`,
        dbSchema: testData.mockSchema,
      }),
    ).toEqual([]);
  });

  test('Shows deprecation for CALL IN TXs without parentheses', () => {
    expect(
      getDiagnosticsForQuery({
        query: `CALL { MATCH (n) RETURN n} IN TRANSACTIONS OF 50 ROWS RETURN 1`,
        dbSchema: testData.mockSchema,
      }),
    ).toEqual([
      {
        message:
          'CALL subquery without a variable scope clause is now deprecated. Use CALL () { ... }',
        offsets: {
          end: 62,
          start: 0,
        },
        range: {
          end: {
            character: 62,
            line: 0,
          },
          start: {
            character: 0,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Shows deprecation for CALL without parentheses', () => {
    expect(
      getDiagnosticsForQuery({
        query: `WITH 1 AS i
          CALL {
             RETURN 3 AS j
          }
          RETURN i
        `,
        dbSchema: testData.mockSchema,
      }),
    ).toEqual([
      {
        message:
          'CALL subquery without a variable scope clause is now deprecated. Use CALL () { ... }',
        offsets: {
          end: 67,
          start: 22,
        },
        range: {
          end: {
            character: 11,
            line: 3,
          },
          start: {
            character: 10,
            line: 1,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Shows errors for missing parameters', () => {
    const query =
      'MATCH (n: Person) WHERE n.name = $missingParam and n.age = $myParam RETURN n';

    expect(
      getDiagnosticsForQuery({ query, dbSchema: testData.mockSchema }),
    ).toEqual([
      {
        message: 'Parameter $missingParam is not defined.',
        offsets: {
          end: 46,
          start: 33,
        },
        range: {
          end: {
            character: 46,
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

  test('Shows errors for missing parameters correctly with backticked parameters', () => {
    const query =
      'MATCH (n: Person) WHERE n.name = $`missingParam` and n.age = $`myParam` RETURN n';

    expect(
      getDiagnosticsForQuery({ query, dbSchema: testData.mockSchema }),
    ).toEqual([
      {
        message: 'Parameter $`missingParam` is not defined.',
        offsets: {
          end: 48,
          start: 33,
        },
        range: {
          end: {
            character: 48,
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

  test('Shows errors for missing parameters correctly with parameter names containing space', () => {
    const query =
      'MATCH (n: Person) WHERE n.name = $`missing param` and n.age = $`some param` RETURN n';

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          ...testData.mockSchema,
          parameters: {
            'some param': 21,
          },
        },
      }),
    ).toEqual([
      {
        message: 'Parameter $`missing param` is not defined.',
        offsets: {
          end: 49,
          start: 33,
        },
        range: {
          end: {
            character: 49,
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

  test('Semantic analysis should not error on using cypher 25', () => {
    const query = 'ALTER DATABASE neo4j SET DEFAULT LANGUAGE CYPHER 25';

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          ...testData.mockSchema,
        },
      }),
    ).toEqual([]);
  });
});
