import { DbSchema } from '../dbSchema';
import { lintCypherQuery } from '../langSupport';

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
          dbInfos: [{ name: 'neo4j', defaultLanguage: 'cypher 5' }],
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
          dbInfos: [{ name: 'neo4j', defaultLanguage: 'cypher 25' }],
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
          dbInfos: [{ name: 'neo4j', defaultLanguage: 'cypher 25' }],
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
          dbInfos: [{ name: 'neo4j', defaultLanguage: 'cypher 5' }],
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
});
