import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import { getDiagnosticsForQuery } from './helpers';

describe('Syntax validation errors spec', () => {
  test('Misspelt keyword at the beginning of the statement', () => {
    const query = 'METCH (n:Person)';

    {
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
    }
  });

  test('Misspelt keyword too different from the ones we know about does not trigger an error rewording', () => {
    const query = 'CAT (n:Person)';

    {
      getDiagnosticsForQuery({
        query,
        expected: [
          {
            range: {
              start: Position.create(0, 0),
              end: Position.create(0, 3),
            },
            message:
              'Did you mean any of ALTER, CALL, CREATE, DEALLOCATE, DELETE, DENY, DETACH, DROP, DRYRUN, ENABLE, FOREACH, GRANT, LOAD, MATCH, MERGE, OPTIONAL, REALLOCATE, RENAME, REMOVE, RETURN, REVOKE, SET, SHOW, START, STOP, TERMINATE, UNWIND, USE, USING or WITH?',
            severity: DiagnosticSeverity.Error,
          },
        ],
      });
    }
  });

  test('Misspelt keyword at the end of the statement', () => {
    const query = 'MATCH (n:Person) WERE';

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          range: {
            start: Position.create(0, 17),
            end: Position.create(0, 21),
          },
          message: 'Did you mean to finish the statement or open a new one?',
          severity: DiagnosticSeverity.Error,
        },
      ],
    });
  });

  test('Misspelt keyword in the middle of the statement', () => {
    const query = "MATCH (n:Person) WERE n.name = 'foo'";

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          range: {
            start: Position.create(0, 17),
            end: Position.create(0, 21),
          },
          message: 'Did you mean to finish the statement or open a new one?',
          severity: DiagnosticSeverity.Error,
        },
      ],
    });
  });

  test('Syntax validation error in a multiline query', () => {
    const query = `MATCH (n) WHERE n:A|B AND n.name = 'foo' 
                   CALL {
                      MATCH (n) WHERE n:A|AND n.name = 'foo' 
                   }
    `;

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          range: {
            start: Position.create(2, 46),
            end: Position.create(2, 47),
          },
          message: "Did you mean '}'?",
          severity: DiagnosticSeverity.Error,
        },
      ],
    });
  });

  test('Misspelt keyword in the middle of the statement', () => {
    const query = "MATCH (n:Person) WERE n.name = 'foo'";

    getDiagnosticsForQuery({
      query,
      expected: [
        {
          range: {
            start: Position.create(0, 17),
            end: Position.create(0, 21),
          },
          message: 'Did you mean to finish the statement or open a new one?',
          severity: DiagnosticSeverity.Error,
        },
      ],
    });
  });

  test('Syntax validation warns on missing label when database can be contacted', () => {
    const query = `MATCH (n: Person)`;

    getDiagnosticsForQuery({
      query,
      dbSchema: { labels: ['Dog', 'Cat'], relationshipTypes: ['Person'] },
      expected: [
        {
          range: {
            start: Position.create(0, 10),
            end: Position.create(0, 16),
          },
          message:
            "Label Person is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
          severity: DiagnosticSeverity.Warning,
        },
      ],
    });
  });

  test('Syntax validation warns on missing relationship type when database can be contacted', () => {
    const query = `MATCH (n)-[r:Rel3]->(m)`;

    getDiagnosticsForQuery({
      query,
      dbSchema: { labels: ['Rel3'], relationshipTypes: ['Rel1', 'Rel2'] },
      expected: [
        {
          range: {
            start: Position.create(0, 13),
            end: Position.create(0, 17),
          },
          message:
            "Relationship type Rel3 is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
          severity: DiagnosticSeverity.Warning,
        },
      ],
    });
  });

  test('Syntax validation does not warn when it cannot distinguish between label and relationship type', () => {
    const query = `MATCH (n) WHERE n:Rel1`;

    getDiagnosticsForQuery({
      query,
      dbSchema: { labels: ['Person'], relationshipTypes: ['Rel1', 'Rel2'] },
      expected: [],
    });
  });

  test('Syntax validation warns when it cannot distinguish between label and relationship type and both missing', () => {
    const query = `MATCH (n) WHERE n:Rel3`;

    getDiagnosticsForQuery({
      query,
      dbSchema: { labels: ['Person'], relationshipTypes: ['Rel1', 'Rel2'] },
      expected: [
        {
          range: {
            start: Position.create(0, 18),
            end: Position.create(0, 22),
          },
          message:
            "Label or relationship type Rel3 is not present in the database. Make sure you didn't misspell it or that it is available when you run this statement in your application",
          severity: DiagnosticSeverity.Warning,
        },
      ],
    });
  });

  test('Syntax validation does not warn on missing label when labels could not be fetched from database', () => {
    const query = `MATCH (n: Person)`;

    getDiagnosticsForQuery({
      query,
      dbSchema: { relationshipTypes: ['Rel1', 'Rel2'] },
      expected: [],
    });
  });

  test('Syntax validation does not warn on missing label when relationship types could not be fetched from database', () => {
    const query = `MATCH (n: Person)`;

    getDiagnosticsForQuery({
      query,
      dbSchema: { labels: ['Dog', 'Cat'] },
      expected: [],
    });
  });
});
