import { getDiagnosticsForQuery } from './helpers';

describe('Semantic validation spec', () => {
  test('Does not trigger semantic errors when there are syntactic errors', () => {
    const query = 'METCH (n) RETURN m';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'Unrecognized keyword. Did you mean MATCH?',
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

  test('Accumulates several semantic errors', () => {
    const query = `CALL { MATCH (n) RETURN m} IN TRANSACTIONS OF -1 ROWS`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'Variable `m` not defined',
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
      {
        message:
          "Invalid input. '-1' is not a valid value. Must be a positive integer.",
        offsets: {
          end: 48,
          start: 46,
        },
        range: {
          end: {
            character: 48,
            line: 0,
          },
          start: {
            character: 46,
            line: 0,
          },
        },
        severity: 1,
      },
      {
        message:
          'Query cannot conclude with CALL (must be a RETURN clause, an update clause, a unit subquery call, or a procedure call with no YIELD)',
        offsets: {
          end: 53,
          start: 0,
        },
        range: {
          end: {
            character: 53,
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

  test('Shows errors for CALL IN TXs used in UNION', () => {
    const query = `CALL { CREATE (x) } IN TRANSACTIONS
    RETURN 1 AS result
    UNION
    CALL { CREATE (x) } IN TRANSACTIONS
    RETURN 2 AS result`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'CALL { ... } IN TRANSACTIONS in a UNION is not supported',
        offsets: {
          end: 131,
          start: 0,
        },
        range: {
          end: {
            character: 22,
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
          end: 131,
          start: 73,
        },
        range: {
          end: {
            character: 22,
            line: 4,
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

  test('Shows errors for CALL when return variable already bound', () => {
    const query = `WITH 1 AS i
    CALL {
      WITH 2 AS i
      RETURN *
        UNION
      WITH 3 AS i
      RETURN *
    }
    RETURN i`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'Variable `i` already declared in outer scope',
        offsets: {
          end: 55,
          start: 54,
        },
        range: {
          end: {
            character: 14,
            line: 3,
          },
          start: {
            character: 13,
            line: 3,
          },
        },
        severity: 1,
      },
      {
        message: 'Variable `i` already declared in outer scope',
        offsets: {
          end: 102,
          start: 101,
        },
        range: {
          end: {
            character: 14,
            line: 6,
          },
          start: {
            character: 13,
            line: 6,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors for subquery with only WITH', () => {
    const query = 'WITH 1 AS a CALL { WITH a } RETURN a';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Query must conclude with a RETURN clause, an update clause, a unit subquery call, or a procedure call with no YIELD',
        offsets: {
          end: 25,
          start: 19,
        },
        range: {
          end: {
            character: 25,
            line: 0,
          },
          start: {
            character: 19,
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
      CALL {
        USE x
        RETURN 2 AS b
      }
      RETURN *`;

    expect(getDiagnosticsForQuery({ query })).toEqual([]);
  });

  test('Shows errors for using multiple USE with different databases', () => {
    const query = `USE neo4j
      WITH 1 AS a
      CALL {
        USE other
        RETURN 2 AS b
      }
      RETURN *`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Multiple graph references in the same query is not supported on standard databases. This capability is supported on composite databases only.',
        offsets: {
          end: 80,
          start: 49,
        },
        range: {
          end: {
            character: 21,
            line: 4,
          },
          start: {
            character: 8,
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
          end: 68,
          start: 67,
        },
        range: {
          end: {
            character: 17,
            line: 3,
          },
          start: {
            character: 16,
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
          end: 115,
          start: 88,
        },
        range: {
          end: {
            character: 17,
            line: 5,
          },
          start: {
            character: 8,
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
        message:
          'Query cannot conclude with MATCH (must be a RETURN clause, an update clause, a unit subquery call, or a procedure call with no YIELD)',
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

  test('Shows errors for COLLECT with updating subqueries', () => {
    const query = `MATCH (a)
    RETURN COLLECT { SET a.name = 1 }
    `;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'A Collect Expression cannot contain any updates',
        offsets: {
          end: 47,
          start: 21,
        },
        range: {
          end: {
            character: 37,
            line: 1,
          },
          start: {
            character: 11,
            line: 1,
          },
        },
        severity: 1,
      },
      {
        message: 'A Collect Expression must end with a single return column.',
        offsets: {
          end: 47,
          start: 21,
        },
        range: {
          end: {
            character: 37,
            line: 1,
          },
          start: {
            character: 11,
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
          end: 70,
          start: 66,
        },
        range: {
          end: {
            character: 20,
            line: 3,
          },
          start: {
            character: 16,
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
        CALL {
            WITH x
            RETURN x * 10 AS y
        }
        RETURN y
    }`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'The variable `y` is shadowing a variable with the same name from the outer scope and needs to be renamed',
        offsets: {
          end: 127,
          start: 126,
        },
        range: {
          end: {
            character: 30,
            line: 5,
          },
          start: {
            character: 29,
            line: 5,
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
          end: 73,
          start: 21,
        },
        range: {
          end: {
            character: 63,
            line: 1,
          },
          start: {
            character: 11,
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

  test('Shows errors about semantic features not enabled yet in the product', () => {
    const query = 'MATCH DIFFERENT RELATIONSHIP (n) RETURN n';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'Match modes such as `DIFFERENT RELATIONSHIPS` are not supported yet.',
        offsets: {
          end: 28,
          start: 6,
        },
        range: {
          end: {
            character: 28,
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

  test('Shows errors for pattern selectors', () => {
    const query = `MATCH
        p1 = ANY 2 PATHS (a)-->*(c)-->(c),
        p2 = (x)-->*(c)-->(z)
      RETURN count(*)`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'Path selectors such as `ANY 2 PATHS` are not supported yet',
        offsets: {
          end: 30,
          start: 19,
        },
        range: {
          end: {
            character: 24,
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
        message:
          'Multiple path patterns cannot be used in the same clause in combination with a selective path selector.',
        offsets: {
          end: 78,
          start: 14,
        },
        range: {
          end: {
            character: 29,
            line: 2,
          },
          start: {
            character: 8,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Shows errors for variables not bound in Graph Pattern Matching', () => {
    const query = `MATCH (a) (()--(x {prop: a.prop}))+ (b) (()--())+ (c) RETURN *`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: `From within a quantified path pattern, one may only reference variables, that are already bound in a previous \`MATCH\` clause.
In this case, a is defined in the same \`MATCH\` clause as (()--(x {prop: a.prop}))+.`,
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
    ]);
  });

  test('Accumulates errors in Graph Pattern Matching', () => {
    const query = `MATCH (p = (a)--(b))+ (p = (c)--(d))+ RETURN p`;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          'The variable `p` occurs in multiple quantified path patterns and needs to be renamed.',
        offsets: {
          end: 37,
          start: 6,
        },
        range: {
          end: {
            character: 37,
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
        message:
          'Type mismatch: p defined with conflicting type List<T> (expected Path)',
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
    ]);
  });

  test('Shows errors for nesting of quantified path patterns', () => {
    const query = 'MATCH ((a)-->(b)-[r]->*(c))+ RETURN count(*)';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message: 'Quantified path patterns are not allowed to be nested.',
        offsets: {
          end: 23,
          start: 16,
        },
        range: {
          end: {
            character: 23,
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
In this case, p is defined in the same \`MATCH\` clause as ((a)-[e]->(b {h: (nodes(p)[0]).prop}))*.`,
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
        message:
          'Variable length relationships cannot be part of a quantified path pattern.',
        offsets: {
          end: 26,
          start: 8,
        },
        range: {
          end: {
            character: 26,
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
          "Mixing variable-length relationships ('-[*]-') with quantified relationships ('()-->*()') or quantified path patterns ('(()-->())*') is not allowed.",
        offsets: {
          end: 26,
          start: 8,
        },
        range: {
          end: {
            character: 26,
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
          end: 10,
          start: 10,
        },
        range: {
          end: {
            character: 10,
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
          end: 13,
          start: 13,
        },
        range: {
          end: {
            character: 13,
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
});
