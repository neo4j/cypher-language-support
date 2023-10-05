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
        message: 'Did you mean MATCH?',
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
        offsets: {
          end: 3,
          start: 0,
        },
        message:
          'Did you mean any of ALTER, CALL, CREATE, DEALLOCATE, DELETE, DENY, DETACH, DROP, DRYRUN, ENABLE, FOREACH, GRANT, LOAD, MATCH, MERGE, OPTIONAL, REALLOCATE, RENAME, REMOVE, RETURN, REVOKE, SET, SHOW, START, STOP, TERMINATE, UNWIND, USE, USING, WITH, EXPLAIN or PROFILE?',
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
        offsets: {
          end: 21,
          start: 17,
        },
        message: 'Did you mean to finish the statement or open a new one?',
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
        offsets: {
          end: 21,
          start: 17,
        },
        message: 'Did you mean to finish the statement or open a new one?',
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
        offsets: {
          end: 114,
          start: 113,
        },
        message: "Did you mean '}'?",
        range: {
          end: {
            character: 47,
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

  test('Misspelt keyword in the middle of the statement', () => {
    const query = "MATCH (n:Person) WERE n.name = 'foo'";

    expect(getDiagnosticsForQuery({ query })).toEqual([
      {
        offsets: {
          end: 21,
          start: 17,
        },
        message: 'Did you mean to finish the statement or open a new one?',
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

  test('Syntax validation warns on missing relationship type when database can be contacted', () => {
    const query = `MATCH (n)-[r:Rel3]->(m) RETURN n`;

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: { labels: ['Rel3'], relationshipTypes: ['Rel1', 'Rel2'] },
      }),
    ).toEqual([
      {
        offsets: {
          end: 17,
          start: 13,
        },
        message:
          "Relationship type Rel3 is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
        range: {
          end: {
            character: 17,
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

  test('Syntax validation errors on unexpected EOF', () => {
    const query = 'SHOW';

    expect(
      getDiagnosticsForQuery({
        query,
      }),
    ).toEqual([
      {
        offsets: {
          end: 4,
          start: 4,
        },
        message: `Did you mean any of ALIAS, ALIASES, ALL, BTREE, BUILT, CONSTRAINT, CONSTRAINTS, CURRENT, DATABASE, DATABASES, DEFAULT, EXIST, EXISTENCE, EXISTS, FULLTEXT, FUNCTION, FUNCTIONS, HOME, INDEX, INDEXES, KEY, LOOKUP, NODE, POINT, POPULATED, PRIVILEGE, PRIVILEGES, PROCEDURE, PROCEDURES, PROPERTY, RANGE, REL, RELATIONSHIP, ROLE, ROLES, SERVER, SERVERS, SETTING, SETTINGS, SUPPORTED, TEXT, TRANSACTION, TRANSACTIONS, UNIQUE, UNIQUENESS, USER or USERS?`,
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
});
