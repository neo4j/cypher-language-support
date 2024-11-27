import { DbSchema } from '../dbSchema';
import {
  lintCypherQuery,
  validateSemantics,
} from '../syntaxValidation/syntaxValidation';

type SyntaxValidationTestArgs = {
  query: string;
  dbSchema?: DbSchema;
};

export function getDiagnosticsForQuery({
  query,
  dbSchema = {},
}: SyntaxValidationTestArgs) {
  return lintCypherQuery(query, dbSchema);
}

describe('Cypher versions spec', () => {
  test('Uses cypher 5 when current database has it configured', () => {
    const query = 'MATCH (n)-[r]->(m) SET r += m';

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          currentDatabase: 'neo4j',
          databasesInfo: [{ name: 'neo4j', defaultLanguage: 'cypher 5' }],
        },
      }),
    ).toEqual([
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

  test('Uses cypher 25 when current database has it configured', () => {
    const query = 'MATCH (n)-[r]->(m) SET r += m';

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          currentDatabase: 'neo4j',
          databasesInfo: [{ name: 'neo4j', defaultLanguage: 'cypher 25' }],
        },
      }),
    ).toEqual([
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
  });

  test('Uses cypher 5 when current database has cypher 25 configured and annotation is used', () => {
    const query = 'CYPHER 5 MATCH (n)-[r]->(m) SET r += m';

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          currentDatabase: 'neo4j',
          databasesInfo: [{ name: 'neo4j', defaultLanguage: 'cypher 25' }],
        },
      }),
    ).toEqual([
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
  });

  test('Uses cypher 25 when current database has cypher 5 configured and annotation is used', () => {
    const query = 'CYPHER 25 MATCH (n)-[r]->(m) SET r += m';

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          currentDatabase: 'neo4j',
          databasesInfo: [{ name: 'neo4j', defaultLanguage: 'cypher 5' }],
        },
      }),
    ).toEqual([
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

  test('CYPHER directive is case insensitive', () => {
    const query = 'cypher 5 MATCH (n)-[r]->(m) SET r += m';

    expect(
      getDiagnosticsForQuery({
        query,
        dbSchema: {
          currentDatabase: 'neo4j',
          databasesInfo: [{ name: 'neo4j', defaultLanguage: 'cypher 25' }],
        },
      }),
    ).toEqual([
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
  });

  test('SHOW INDEXES should error on BRIEF OUTPUT', () => {
    const query = `
    CYPHER 5 SHOW INDEXES BRIEF OUTPUT;
    CYPHER 25 SHOW INDEXES BRIEF OUTPUT;`;

    expect(validateSemantics(query, {})).toEqual([
      {
        message: `\`SHOW INDEXES\` no longer allows the \`BRIEF\` and \`VERBOSE\` keywords,
      please omit \`BRIEF\` and use \`YIELD *\` instead of \`VERBOSE\`. (line 1, column 14 (offset: 13))`,
        offsets: {
          end: 40,
          start: 27,
        },
        range: {
          end: {
            character: 39,
            line: 1,
          },
          start: {
            character: 26,
            line: 1,
          },
        },
        severity: 1,
      },
      // This should not contain SHOW, this error is wrong ;___
      {
        message:
          "Invalid input 'BRIEF': expected 'SHOW', 'TERMINATE', 'WHERE', 'YIELD' or <EOF> (line 1, column 14 (offset: 13))",
        offsets: {
          end: 81,
          start: 68,
        },
        range: {
          end: {
            character: 40,
            line: 2,
          },
          start: {
            character: 27,
            line: 2,
          },
        },
        severity: 1,
      },
    ]);
  });

  test('Deprecated self-references in patterns in Cypher 5 are errors in Cypher 25', () => {
    const query = `
    CYPHER 5 CREATE (a {p:1}), ({p:a.p});
    CYPHER 25 CREATE (a {p:1}), ({p:a.p})`;

    expect(validateSemantics(query, {})).toEqual([
      {
        message:
          'Creating an entity (a) and referencing that entity in a property definition in the same CREATE is deprecated.',
        offsets: {
          end: 39,
          start: 36,
        },
        range: {
          end: {
            character: 38,
            line: 1,
          },
          start: {
            character: 35,
            line: 1,
          },
        },
        severity: 2,
      },
      {
        message:
          'Creating an entity (a) and referencing that entity in a property definition in the same CREATE is not allowed. Only reference variables created in earlier clauses.',
        offsets: {
          end: 82,
          start: 79,
        },
        range: {
          end: {
            character: 39,
            line: 2,
          },
          start: {
            character: 36,
            line: 2,
          },
        },
        severity: 1,
      },
    ]);
  });
});
