import { getDiagnosticsForQuery } from './helpers';

describe('Syntactic validation spec', () => {
  test('Misspelt keyword at the beginning of the statement', () => {
    const query = 'METCH (n:Person)';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        offsets: {
          end: 5,
          start: 0,
        },
        message:
          "Invalid input 'METCH': expected 'FOREACH', 'ALTER', 'ORDER BY', 'CALL', 'USING PERIODIC COMMIT', 'CREATE', 'LOAD CSV', 'START DATABASE', 'STOP DATABASE', 'DEALLOCATE', 'DELETE', 'DENY', 'DETACH', 'DROP', 'DRYRUN', 'FINISH', 'GRANT', 'INSERT', 'LIMIT', 'MATCH', 'MERGE', 'NODETACH', 'OFFSET', 'OPTIONAL', 'REALLOCATE', 'REMOVE', 'RENAME', 'RETURN', 'REVOKE', 'ENABLE SERVER', 'SET', 'SHOW', 'SKIP', 'TERMINATE', 'UNWIND', 'USE' or 'WITH'",
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

  test('Misspelt keyword too different from the ones we know about does not trigger an error rewording', () => {
    const query = 'CAT (n:Person)';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          "Invalid input 'CAT': expected 'FOREACH', 'ALTER', 'ORDER BY', 'CALL', 'USING PERIODIC COMMIT', 'CREATE', 'LOAD CSV', 'START DATABASE', 'STOP DATABASE', 'DEALLOCATE', 'DELETE', 'DENY', 'DETACH', 'DROP', 'DRYRUN', 'FINISH', 'GRANT', 'INSERT', 'LIMIT', 'MATCH', 'MERGE', 'NODETACH', 'OFFSET', 'OPTIONAL', 'REALLOCATE', 'REMOVE', 'RENAME', 'RETURN', 'REVOKE', 'ENABLE SERVER', 'SET', 'SHOW', 'SKIP', 'TERMINATE', 'UNWIND', 'USE' or 'WITH'",
        offsets: {
          end: 3,
          start: 0,
        },
        range: {
          end: {
            character: 3,
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

  test('Misspelt keyword at the end of the statement', () => {
    const query = 'MATCH (n:Person) WERE';

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          "Invalid input 'WERE': expected a graph pattern, 'FOREACH', ',', 'ORDER BY', 'CALL', 'CREATE', 'LOAD CSV', 'DELETE', 'DETACH', 'FINISH', 'INSERT', 'LIMIT', 'MATCH', 'MERGE', 'NODETACH', 'OFFSET', 'OPTIONAL', 'REMOVE', 'RETURN', 'SET', 'SKIP', 'UNION', 'UNWIND', 'USE', 'USING', 'WHERE', 'WITH' or <EOF>",
        offsets: {
          end: 21,
          start: 17,
        },
        range: {
          end: {
            character: 21,
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

  test('Misspelt keyword in the middle of the statement', () => {
    const query = "MATCH (n:Person) WERE n.name = 'foo'";

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          "Invalid input 'WERE': expected a graph pattern, 'FOREACH', ',', 'ORDER BY', 'CALL', 'CREATE', 'LOAD CSV', 'DELETE', 'DETACH', 'FINISH', 'INSERT', 'LIMIT', 'MATCH', 'MERGE', 'NODETACH', 'OFFSET', 'OPTIONAL', 'REMOVE', 'RETURN', 'SET', 'SKIP', 'UNION', 'UNWIND', 'USE', 'USING', 'WHERE', 'WITH' or <EOF>",
        offsets: {
          end: 21,
          start: 17,
        },
        range: {
          end: {
            character: 21,
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

  test('Syntax validation error in a multiline query', () => {
    const query = `MATCH (n) WHERE n:A|B AND n.name = 'foo'
                   CALL {
                      MATCH (n) WHERE n:A|AND n.name = 'foo'
                   }
    `;

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        message:
          "Invalid input 'n': expected an expression, 'FOREACH', 'ORDER BY', 'CALL', 'CREATE', 'LOAD CSV', 'DELETE', 'DETACH', 'FINISH', 'INSERT', 'LIMIT', 'MATCH', 'MERGE', 'NODETACH', 'OFFSET', 'OPTIONAL', 'REMOVE', 'RETURN', 'SET', 'SKIP', 'UNION', 'UNWIND', 'USE', 'WITH' or '}'",
        offsets: {
          end: 119,
          start: 113,
        },
        range: {
          end: {
            character: 52,
            line: 2,
          },
          start: {
            character: 46,
            line: 2,
          },
        },
        severity: 1,
      },
    ]);
  });

  // TODO FIX ME
  test.fails('Misspelt keyword in the middle of the statement', () => {
    const query = "MATCH (n:Person) WERE n.name = 'foo'";

    expect(getDiagnosticsForQuery({ query })).toEqual([
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
    ]);
  });

  test('Syntax validation warns on missing label when database can be contacted', () => {
    const query = `MATCH (n: Person) RETURN n`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Dog', 'Cat'], relationshipTypes: ['Person'] },
      }),
    ).toEqual([
      {
        offsets: {
          end: 16,
          start: 10,
        },
        message:
          "Label Person is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        range: {
          end: {
            character: 16,
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

  test('Syntax validation treats labels and relationship types with backticks correctly', () => {
    const query = `MATCH (n: \`Foo Bar\`)-[r:\`RR QQ\`]->() RETURN n`;

    // With spaces in the label / relationship
    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Foo Bar'], relationshipTypes: ['RR QQ'] },
      }),
    ).toEqual([]);

    // Without spaces in the label / relationship
    expect(
      getDiagnosticsForQuery({
        query: 'MATCH (n: `Foo`)-[r:`RR`]->() RETURN n',
        dbSchema: { labels: ['Foo'], relationshipTypes: ['RR'] },
      }),
    ).toEqual([]);

    // With incorrect backticked label / rel type
    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Foo'], relationshipTypes: ['RR'] },
      }),
    ).toEqual([
      {
        message:
          "Label `Foo Bar` is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
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
        severity: 2,
      },
      {
        message:
          "Relationship type `RR QQ` is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 31,
          start: 24,
        },
        range: {
          end: {
            character: 31,
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

  test('Syntax validation warns on missing rel type when database can be contacted', () => {
    const query = `MATCH (n)-[:Rel]->(m) RETURN n`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Dog', 'Cat'], relationshipTypes: ['Person'] },
      }),
    ).toEqual([
      {
        message:
          "Relationship type Rel is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 15,
          start: 12,
        },
        range: {
          end: {
            character: 15,
            line: 0,
          },
          start: {
            character: 12,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Syntax validation warns on missing label in a WHERE node predicate', () => {
    const query = `MATCH (n WHERE n IS Person) RETURN n`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Dog', 'Cat'], relationshipTypes: ['Person'] },
      }),
    ).toEqual([
      {
        message:
          "Label Person is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 26,
          start: 20,
        },
        range: {
          end: {
            character: 26,
            line: 0,
          },
          start: {
            character: 20,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Syntax validation warns on missing label in a WHERE clause if no labels or rel types match it', () => {
    const query = `MATCH (n) WHERE n IS Person RETURN n`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Dog', 'Cat'], relationshipTypes: ['Cow'] },
      }),
    ).toEqual([
      {
        message:
          "Label or relationship type Person is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 27,
          start: 21,
        },
        range: {
          end: {
            character: 27,
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

  test('Syntax validation warns on missing rel type in a WHERE clause if no labels or rel types match it', () => {
    const query = `MATCH (n)-[r]-(m) WHERE r IS Rel RETURN n`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Dog', 'Cat'], relationshipTypes: ['Cow'] },
      }),
    ).toEqual([
      {
        message:
          "Label or relationship type Rel is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        offsets: {
          end: 32,
          start: 29,
        },
        range: {
          end: {
            character: 32,
            line: 0,
          },
          start: {
            character: 29,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Syntax validation does not warn on missing label in a WHERE clause if it is a relationship type', () => {
    const query = `MATCH (n) WHERE n IS Person RETURN n`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Dog', 'Cat'], relationshipTypes: ['Person'] },
      }),
    ).toEqual([]);
  });

  test('Syntax validation does not warn on missing label in a WHERE clause if it is a label', () => {
    const query = `MATCH ()-[r]-() WHERE r IS Dog RETURN r`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Dog', 'Cat'], relationshipTypes: ['Person'] },
      }),
    ).toEqual([]);
  });

  test('Syntax validation does not warn on missing label in a CREATE', () => {
    const query = `CREATE (n: Person) RETURN n`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Dog', 'Cat'], relationshipTypes: ['Person'] },
      }),
    ).toEqual([]);
  });

  test('Syntax validation does not warn on missing rel type in a CREATE', () => {
    const query = `CREATE (n)-[r:Rel]->(m) RETURN n`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Dog', 'Cat'], relationshipTypes: ['Person'] },
      }),
    ).toEqual([]);
  });

  test('Syntax validation does not warn on missing label in a MERGE', () => {
    const query = `MERGE (n:Label {name: $value})
    ON CREATE SET n.created = timestamp()
    ON MATCH SET
      n.accessTime = timestamp()
    `;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Dog', 'Cat'], relationshipTypes: ['Person'] },
      }),
    ).toEqual([]);
  });

  test('Syntax validation does not warn on missing rel type in a MERGE', () => {
    const query = 'MERGE (n)-[r:Rel]-(m) RETURN r';

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Dog', 'Cat'], relationshipTypes: ['Person'] },
      }),
    ).toEqual([]);
  });

  test('Syntax validation errors on missing label expression', () => {
    const query = `MATCH (n:) RETURN n`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: [], relationshipTypes: [] },
      }),
    ).toEqual([
      {
        message:
          "Invalid input ')': expected a node label/relationship type name, '$', '%' or '('",
        offsets: {
          end: 10,
          start: 9,
        },
        range: {
          end: {
            character: 10,
            line: 0,
          },
          start: {
            character: 9,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation does not warn when it cannot distinguish between label and relationship type', () => {
    const query = `MATCH (n) WHERE n:Rel1 RETURN n`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Person'], relationshipTypes: ['Rel1', 'Rel2'] },
      }),
    ).toEqual([]);
  });

  test('Syntax validation warns when it cannot distinguish between label and relationship type and both missing', () => {
    const query = `MATCH (n) WHERE n:Rel3 RETURN n`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Person'], relationshipTypes: ['Rel1', 'Rel2'] },
      }),
    ).toEqual([
      {
        offsets: {
          end: 22,
          start: 18,
        },
        message:
          "Label or relationship type Rel3 is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        range: {
          end: {
            character: 22,
            line: 0,
          },
          start: {
            character: 18,
            line: 0,
          },
        },
        severity: 2,
      },
    ]);
  });

  test('Syntax validation does not warn on missing label when labels could not be fetched from database', () => {
    const query = `MATCH (n: Person) RETURN n`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { relationshipTypes: ['Rel1', 'Rel2'] },
      }),
    ).toEqual([]);
  });

  test('Syntax validation does not warn on missing label when relationship types could not be fetched from database', () => {
    const query = `MATCH (n: Person) RETURN n`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Dog', 'Cat'] },
      }),
    ).toEqual([]);
  });

  test('Syntax validation errors shows correctly for SHOW commands', () => {
    const query = 'SHOW';

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message:
          "Invalid input '': expected 'ALIAS', 'ALIASES', 'ALL', 'BTREE', 'CONSTRAINT', 'CONSTRAINTS', 'DATABASE', 'DEFAULT DATABASE', 'HOME DATABASE', 'DATABASES', 'EXIST', 'EXISTENCE', 'EXISTS', 'FULLTEXT', 'FUNCTION', 'FUNCTIONS', 'BUILT IN', 'INDEX', 'INDEXES', 'KEY', 'LOOKUP', 'NODE', 'POINT', 'POPULATED', 'PRIVILEGE', 'PRIVILEGES', 'PROCEDURE', 'PROCEDURES', 'PROPERTY', 'RANGE', 'REL', 'RELATIONSHIP', 'ROLE', 'ROLES', 'SERVER', 'SERVERS', 'SETTING', 'SETTINGS', 'SUPPORTED', 'TEXT', 'TRANSACTION', 'TRANSACTIONS', 'UNIQUE', 'UNIQUENESS', 'USER', 'CURRENT USER', 'USERS' or 'VECTOR'",
        offsets: {
          end: 4,
          start: 4,
        },
        range: {
          end: {
            character: 4,
            line: 0,
          },
          start: {
            character: 4,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation does not error on an empty query', () => {
    const query = '';

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([]);
  });

  test('Syntax validation errors on unfinished string', () => {
    const query = 'RETURN "something';

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message:
          'Failed to parse string literal. The query must contain an even number of non-escaped quotes.',
        offsets: {
          end: 17,
          start: 7,
        },
        range: {
          end: {
            character: 17,
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

  // TODO FIX ME
  test('Syntax validation errors on multiline unfinished string', () => {
    const query = `RETURN 'something
      foo
      bar`;

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message:
          'Failed to parse string literal. The query must contain an even number of non-escaped quotes.',
        offsets: {
          end: 37,
          start: 7,
        },
        range: {
          end: {
            character: 9,
            line: 2,
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

  // TODO FIX ME
  // Problem here is the ending position
  test('Syntax validation errors on multiline unfinished property keys', () => {
    const query = `RETURN {\`something
    foo
    
    bar: "hello"}`;

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message: "Invalid input '`': expected an identifier or '}'",
        offsets: {
          end: 49,
          start: 8,
        },
        range: {
          end: {
            character: 17,
            line: 3,
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

  // TODO FIX ME
  // Problem here is the ending position
  test('Syntax validation errors on unfinished multiline comment', () => {
    const query = `/* something
    foo
    MATCH (n)`;

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message: 'Unfinished comment',
        offsets: {
          end: 34,
          start: 0,
        },
        range: {
          end: {
            character: 13,
            line: 2,
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

  test('Syntax validation errors on multiple syntactic errors', () => {
    const query = `CALL { MATCH (n) RETURN } IN TRANSACTIONS RETURN`;

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message: "Invalid input '}': expected an expression, '*' or 'DISTINCT'",
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
  });

  // TODO FIX ME
  // Problem here is we were getting a better error before
  test('Syntax validation errors on an expected procedure name', () => {
    const query = `CALL ,foo`;

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message: "Expected any of '{', '(' or a procedure name",
        offsets: {
          end: 6,
          start: 5,
        },
        range: {
          end: {
            character: 6,
            line: 0,
          },
          start: {
            character: 5,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation errors on an expected map literal', () => {
    const query = `RETURN {[242]}`;

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message: "Invalid input '[': expected an identifier or '}'",
        offsets: {
          end: 13,
          start: 8,
        },
        range: {
          end: {
            character: 13,
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

  test('Syntax validation errors on an expected map literal for node properties', () => {
    const query = `MATCH (n "foo")`;

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message: `Invalid input '"foo"': expected a graph pattern, a parameter, ')', ':', 'IS', 'WHERE' or '{'`,
        offsets: {
          end: 15,
          start: 9,
        },
        range: {
          end: {
            character: 15,
            line: 0,
          },
          start: {
            character: 9,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation errors on an expected identifier', () => {
    const query = `RETURN {foo: 345, 'bar': 345}`;

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message: "Invalid input ''bar'': expected an identifier",
        offsets: {
          end: 24,
          start: 18,
        },
        range: {
          end: {
            character: 24,
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

  test('Syntax validation errors on an expected string or parameter', () => {
    const query = `CREATE USER foo 
      SET PASSWORD foo`;

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message:
          "Invalid input 'foo': expected a parameter, a string or 'CHANGE'",
        offsets: {
          end: 39,
          start: 36,
        },
        range: {
          end: {
            character: 22,
            line: 1,
          },
          start: {
            character: 19,
            line: 1,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation errors on an expected database name', () => {
    const query = `CREATE DATABASE "something"`;

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message: `Invalid input '"something"': expected a database name, a graph pattern or a parameter`,
        offsets: {
          end: 27,
          start: 16,
        },
        range: {
          end: {
            character: 27,
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

  test('Syntax validation errors on an expected integer', () => {
    const query = `MATCH ((:Stop)-[:NEXT]->(:Stop)){1,"foo"}`;

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message: `Invalid input '"foo"': expected '}' or an integer value`,
        offsets: {
          end: 41,
          start: 35,
        },
        range: {
          end: {
            character: 41,
            line: 0,
          },
          start: {
            character: 35,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Syntax validation errors on an expected label expression', () => {
    const query = `MATCH (n: 'Person')`;

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message:
          "Invalid input ''Person'': expected a node label/relationship type name, '$', '%' or '('",
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
    ]);
  });

  test('Syntax validation errors on an expected IS label expression', () => {
    const query = `MATCH (n IS 'Person')`;

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message: `Invalid input ''Person'': expected an identifier, '$', '%' or '('`,
        offsets: {
          end: 21,
          start: 12,
        },
        range: {
          end: {
            character: 21,
            line: 0,
          },
          start: {
            character: 12,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  // TODO FIX ME
  test('Syntax validation errors on incomplete console commands if console commands are not enabled', () => {
    const query = `:`;

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        message: 'Console commands are unsupported in this environment.',
        offsets: {
          end: 1,
          start: 1,
        },
        range: {
          end: {
            character: 1,
            line: 0,
          },
          start: {
            character: 1,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });

  test.each([
    `MATCH (n:Test1) RETURN n.profile`,
    `MATCH (n:MyLabel) RETURN n.CYPHER`,
    `CREATE (n:Test1 {explain: 'Explain'});`,
    `RETURN { clear: 'Clear', params: 'params', history: 'history'}`,
  ])(
    'Syntax validation should not fail if cmd keywords are used in map properties %s',
    (query) => {
      expect(
        getDiagnosticsForQuery({
          query,
        }),
      ).toEqual([]);
    },
  );
});
