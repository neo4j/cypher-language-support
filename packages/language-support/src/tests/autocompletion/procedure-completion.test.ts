import {
  CompletionItemKind,
  SignatureInformation,
} from 'vscode-languageserver-types';
import { testCompletions } from './completion-assertion-helpers';

describe('Procedures auto-completion', () => {
  test('Correctly completes CALL in standalone', () => {
    const query = 'C';

    testCompletions({
      query,
      expected: [{ label: 'CALL', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes CALL in subquery', () => {
    const query = 'MATCH (n) C';

    testCompletions({
      query,
      expected: [{ label: 'CALL', kind: CompletionItemKind.Keyword }],
    });
  });

  test('Correctly completes procedure name in CALL', () => {
    const query = 'CALL db';

    testCompletions({
      query,
      dbSchema: {
        procedureSignatures: {
          'foo.bar': SignatureInformation.create(''),
          'dbms.info': SignatureInformation.create(''),
          somethingElse: SignatureInformation.create(''),
          'xx.yy': SignatureInformation.create(''),
          'db.info': SignatureInformation.create(''),
        },
      },
      expected: [
        {
          label: 'dbms.info',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
        },
        {
          label: 'db.info',
          kind: CompletionItemKind.Method,
          detail: '(procedure)',
        },
      ],
    });
  });

  test('Correctly completes YIELD', () => {
    const query = 'CALL proc() Y';

    testCompletions({
      query,
      expected: [{ label: 'YIELD', kind: CompletionItemKind.Keyword }],
    });
  });
});
