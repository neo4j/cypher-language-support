import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import { getDiagnosticsForQuery } from './helpers';

describe('Semantic validation spec', () => {
  test('Does not trigger semantic errors when there are syntactic errors', () => {
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

  test('Shows errors for undefined variables', () => {
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

  test('Accumulates several semantic errors', () => {
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

  test('Shows errors for CALL IN TXs used in UNION', () => {
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
            end: Position.create(4, 22),
          },
          message: 'CALL { ... } IN TRANSACTIONS in a UNION is not supported',
        },
        {
          severity: 1,
          range: {
            start: Position.create(3, 4),
            end: Position.create(4, 22),
          },
          message: 'CALL { ... } IN TRANSACTIONS in a UNION is not supported',
        },
      ],
    });
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

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(3, 13),
            end: Position.create(3, 14),
          },
          message: 'Variable `i` already declared in outer scope',
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(6, 13),
            end: Position.create(6, 14),
          },
          message: 'Variable `i` already declared in outer scope',
        },
      ],
    });
  });

  test('Shows errors for subquery with only WITH', () => {
    const query = 'WITH 1 AS a CALL { WITH a } RETURN a';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 19),
            end: Position.create(0, 25),
          },
          message:
            'Query must conclude with a RETURN clause, an update clause, a unit subquery call, or a procedure call with no YIELD',
        },
      ],
    });
  });

  test('Does not show errors for multiple USE with the same database', () => {
    const query = `USE x
      WITH 1 AS a
      CALL {
        USE x
        RETURN 2 AS b
      }
      RETURN *`;

    getDiagnosticsForQuery({
      query,
      expected: [],
    });
  });

  test('Shows errors for using multiple USE with different databases', () => {
    const query = `USE neo4j
      WITH 1 AS a
      CALL {
        USE other
        RETURN 2 AS b
      }
      RETURN *`;

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(3, 8),
            end: Position.create(4, 21),
          },
          message:
            'Multiple graph references in the same query is not supported on standard databases. This capability is supported on composite databases only.',
        },
      ],
    });
  });

  test('Shows errors for simple shadowing of variables', () => {
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

  test('Shows errors for COLLECT without a single RETURN', () => {
    const query = `RETURN COLLECT { MATCH (a) }`;

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 17),
            end: Position.create(0, 26),
          },
          message:
            'Query cannot conclude with MATCH (must be a RETURN clause, an update clause, a unit subquery call, or a procedure call with no YIELD)',
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 7),
            end: Position.create(0, 28),
          },
          message: 'A Collect Expression must end with a single return column.',
        },
      ],
    });
  });

  test('Does not show errors for a correct COLLECT', () => {
    const query = `MATCH (a)
      WHERE COLLECT {
        MATCH (a)
        RETURN a.prop
      }[0] = a
      RETURN a
      `;

    getDiagnosticsForQuery({
      query,
      expected: [],
    });
  });

  test('Shows errors for COLLECT with updating subqueries', () => {
    const query = `MATCH (a)
    RETURN COLLECT { SET a.name = 1 }
    `;

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(1, 11),
            end: Position.create(1, 37),
          },
          message: 'A Collect Expression cannot contain any updates',
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(1, 11),
            end: Position.create(1, 37),
          },
          message: 'A Collect Expression must end with a single return column.',
        },
      ],
    });
  });

  test('Shows errors for shadowing inside COLLECT subqueries', () => {
    const query = `WITH 5 as aNum
    MATCH (a)
    RETURN COLLECT {
      WITH 6 as aNum
      MATCH (a)-->(b) WHERE b.prop = aNum
      RETURN a
    }`;

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(3, 16),
            end: Position.create(3, 20),
          },
          message:
            'The variable `aNum` is shadowing a variable with the same name from the outer scope and needs to be renamed',
        },
      ],
    });
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

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(5, 29),
            end: Position.create(5, 30),
          },
          message:
            'The variable `y` is shadowing a variable with the same name from the outer scope and needs to be renamed',
        },
      ],
    });
  });

  test('Shows errors for EXISTS with updating subqueries', () => {
    const query = `MATCH (a)
    RETURN EXISTS { MATCH (b) MERGE (b)-[:FOLLOWS]->(:Person) }`;

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(1, 11),
            end: Position.create(1, 63),
          },
          message: 'An Exists Expression cannot contain any updates',
        },
      ],
    });
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

    getDiagnosticsForQuery({
      query,
      expected: [],
    });
  });

  test('Shows errors about semantic features not enabled yet in the product', () => {
    const query = 'MATCH DIFFERENT RELATIONSHIP (n) RETURN n';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 6),
            end: Position.create(0, 28),
          },
          message:
            'Match modes such as `DIFFERENT RELATIONSHIPS` are not supported yet.',
        },
      ],
    });
  });

  test('Shows errors for pattern selectors', () => {
    const query = `MATCH
        p1 = ANY 2 PATHS (a)-->*(c)-->(c),
        p2 = (x)-->*(c)-->(z)
      RETURN count(*)`;

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(1, 13),
            end: Position.create(1, 24),
          },
          message: 'Path selectors such as `ANY 2 PATHS` are not supported yet',
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(1, 8),
            end: Position.create(2, 29),
          },
          message:
            'Multiple path patterns cannot be used in the same clause in combination with a selective path selector.',
        },
      ],
    });
  });

  test('Shows errors for variables not bound in Graph Pattern Matching', () => {
    const query = `MATCH (a) (()--(x {prop: a.prop}))+ (b) (()--())+ (c) RETURN *`;

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 7),
            end: Position.create(0, 8),
          },
          message: `From within a quantified path pattern, one may only reference variables, that are already bound in a previous \`MATCH\` clause.
In this case, a is defined in the same \`MATCH\` clause as (()--(\`x\` {\`prop\`: \`a\`.\`prop\`}))+.`,
        },
      ],
    });
  });

  test('Accumulates errors in Graph Pattern Matching', () => {
    const query = `MATCH (p = (a)--(b))+ (p = (c)--(d))+ RETURN p`;

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 6),
            end: Position.create(0, 37),
          },
          message:
            'The variable `p` occurs in multiple quantified path patterns and needs to be renamed.',
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 7),
            end: Position.create(0, 19),
          },
          message:
            'Assigning a path in a quantified path pattern is not yet supported.',
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 23),
            end: Position.create(0, 35),
          },
          message:
            'Assigning a path in a quantified path pattern is not yet supported.',
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 22),
            end: Position.create(0, 37),
          },
          message: 'Variable `p` already declared',
        },
      ],
    });
  });

  test('Shows errors for type mismatch and subpath assignment in Graph Pattern Matching', () => {
    const query = 'MATCH (p = (a)--(b))+ (p = (c)--(d)) RETURN p';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 7),
            end: Position.create(0, 19),
          },
          message:
            'Assigning a path in a quantified path pattern is not yet supported.',
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 23),
            end: Position.create(0, 35),
          },
          message:
            'Type mismatch: p defined with conflicting type List<T> (expected Path)',
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 23),
            end: Position.create(0, 35),
          },
          message:
            'Sub-path assignment is currently not supported outside quantified path patterns.',
        },
      ],
    });
  });

  test('Shows errors for nesting of quantified path patterns', () => {
    const query = 'MATCH ((a)-->(b)-[r]->*(c))+ RETURN count(*)';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 16),
            end: Position.create(0, 23),
          },
          message: 'Quantified path patterns are not allowed to be nested.',
        },
      ],
    });
  });

  test('Shows errors when using shortestPath in quantified path patterns', () => {
    const query = 'MATCH (p = shortestPath((a)-[]->(b)))+ RETURN p';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 7),
            end: Position.create(0, 36),
          },
          message:
            'Assigning a path in a quantified path pattern is not yet supported.',
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 11),
            end: Position.create(0, 36),
          },
          message:
            'shortestPath(...) is only allowed as a top-level element and not inside a quantified path pattern',
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 27),
            end: Position.create(0, 32),
          },
          message:
            "Mixing variable-length relationships ('-[*]-') with quantified relationships ('()-->*()') or quantified path patterns ('(()-->())*') is not allowed.",
        },
      ],
    });
  });

  test('Shows errors on quantified path patterns without relationship', () => {
    const query = 'MATCH ((n) (m)){1, 5} RETURN count(*)';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 6),
            end: Position.create(0, 21),
          },
          message:
            'A quantified path pattern needs to have at least one relationship.\nIn this case, the quantified path pattern ((`n`) (`m`)){1, 5} consists of only nodes.',
        },
        {
          severity: 1,
          range: {
            start: Position.create(0, 11),
            end: Position.create(0, 14),
          },
          message:
            'Juxtaposition is currently only supported for quantified path patterns.\nIn this case, both (`n`) and (`m`) are single nodes.\nThat is, neither of these is a quantified path pattern.',
        },
      ],
    });
  });

  test('Shows errors on quantified path patterns with variables not bound in a previous MATCH', () => {
    const query =
      'MATCH p=(x)-->(y), ((a)-[e]->(b {h: nodes(p)[0].prop}))* (s)-->(u) RETURN count(*)';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 6),
            end: Position.create(0, 66),
          },
          message:
            'From within a quantified path pattern, one may only reference variables, that are already bound in a previous `MATCH` clause.\nIn this case, p is defined in the same `MATCH` clause as ((`a`)-[`e`]->(`b` {`h`: (`nodes`(`p`)[0]).`prop`}))*.',
        },
      ],
    });
  });

  test('Shows errors on variable length relationships in quantified patterns', () => {
    const query = 'MATCH ()-[r:A*1..2]->{1,2}() RETURN r';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 8),
            end: Position.create(0, 26),
          },
          message:
            'Variable length relationships cannot be part of a quantified path pattern.',
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 8),
            end: Position.create(0, 26),
          },
          message:
            "Mixing variable-length relationships ('-[*]-') with quantified relationships ('()-->*()') or quantified path patterns ('(()-->())*') is not allowed.",
        },
      ],
    });
  });

  test('Does not show errors for correct Graph Pattern Matching queries', () => {
    const query =
      'MATCH ((a)-[r]-(b WHERE r.prop = COUNT { MATCH ALL ((c)-[q]-(d))+ RETURN q } ))+ RETURN 1';

    getDiagnosticsForQuery({
      query,
      expected: [],
    });
  });

  test('Shows errors on pattern expression when used wherever we do not expect a boolean value', () => {
    const query = 'MATCH (a) RETURN (a)--()';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 17),
            end: Position.create(0, 24),
          },
          message:
            'A pattern expression should only be used in order to test the existence of a pattern. It should therefore only be used in contexts that evaluate to a boolean, e.g. inside the function exists() or in a WHERE-clause. No other uses are allowed, instead they should be replaced by a pattern comprehension.',
        },
      ],
    });
  });

  test('Shows errors for pattern expressions used inside size()', () => {
    const query = 'MATCH (a) RETURN size((a)--())';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 22),
            end: Position.create(0, 29),
          },
          message:
            'A pattern expression should only be used in order to test the existence of a pattern. It can no longer be used inside the function size(), an alternative is to replace size() with COUNT {}.',
        },
      ],
    });
  });

  test('Does not show errors for pattern expression used as a boolean value', () => {
    const query = 'RETURN NOT ()--()';

    getDiagnosticsForQuery({
      query,
      expected: [],
    });
  });

  test('Shows errors for label expressions containing |:', () => {
    const query = 'MATCH (n:A|:B) RETURN n';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 10),
            end: Position.create(0, 10),
          },
          message: "Label expressions are not allowed to contain '|:'.",
        },
      ],
    });
  });

  test('Shows errors for label expressions when used in a CREATE', () => {
    const query = 'CREATE (n IS A&B) RETURN n';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 14),
            end: Position.create(0, 14),
          },
          message:
            'Label expressions in patterns are not allowed in a CREATE clause, but only in a MATCH clause and in expressions',
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 14),
            end: Position.create(0, 14),
          },
          message:
            'The IS keyword in patterns is not allowed in a CREATE clause, but only in a MATCH clause and in expressions',
        },
      ],
    });
  });

  test('Shows errors for label expressions mixing IS with semicolon', () => {
    const query = 'MATCH (n IS A:B) RETURN n';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 13),
            end: Position.create(0, 13),
          },
          message:
            "Mixing the IS keyword with colon (':') between labels is not allowed. This expression could be expressed as IS `A`&`B`.",
        },
      ],
    });
  });

  test('Shows errors for label expressions when used in MERGE', () => {
    const query = 'MERGE (n IS %) RETURN n';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 12),
            end: Position.create(0, 13),
          },
          message:
            'Label expressions in patterns are not allowed in a MERGE clause, but only in a MATCH clause and in expressions',
        },
        {
          severity: DiagnosticSeverity.Error,
          range: {
            start: Position.create(0, 12),
            end: Position.create(0, 13),
          },
          message:
            'The IS keyword in patterns is not allowed in a MERGE clause, but only in a MATCH clause and in expressions',
        },
      ],
    });
  });
});
