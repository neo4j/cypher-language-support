import { DiagnosticSeverity, Position } from 'vscode-languageserver-types';
import { testSyntaxValidation } from './helpers';

describe('Syntax validation errors spec', () => {
  test('Misspelt keyword at the beginning of the statement', () => {
    const query = 'METCH (n:Person)';

    {
      testSyntaxValidation({
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

  test('Misspelt keyword at the end of the statement', () => {
    const query = 'MATCH (n:Person) WERE';

    testSyntaxValidation({
      query,
      expected: [
        {
          range: {
            start: Position.create(0, 17),
            end: Position.create(0, 21),
          },
          message:
            'Did you intend to finish the query? Did you intend to open a new statement?',
          severity: DiagnosticSeverity.Error,
        },
      ],
    });
  });

  test('Misspelt keyword in the middle of the statement', () => {
    const query = "MATCH (n:Person) WERE n.name = 'foo'";

    testSyntaxValidation({
      query,
      expected: [
        {
          range: {
            start: Position.create(0, 17),
            end: Position.create(0, 21),
          },
          message:
            'Did you intend to finish the query? Did you intend to open a new statement?',
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

    testSyntaxValidation({
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
});
