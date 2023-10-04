import { CompletionItemKind } from 'vscode-languageserver-types';
import {
  testCompletionContains,
  testCompletionDoesNotContain,
} from './completion-assertion-helpers';

describe('unscoped variable completions', () => {
  test('correctly completes variables in WHERE clause that have been defined in a simple match', () => {
    const basequery = (varName: string) => `MATCH (${varName}) WHERE `;
    const varNames = ['n', 'person', 'MATCH'];

    varNames.forEach((varName) => {
      testCompletionContains({
        query: basequery(varName),
        expected: [{ label: varName, kind: CompletionItemKind.Variable }],
      });
    });
  });

  test('correctly completes variables from pattern in match', () => {
    const query =
      'MATCH p=(n:Person {n: 23})-[r:KNOWS {since: 213, g: rand()}]->(m:Person) WHERE ';

    testCompletionContains({
      query,
      expected: [
        { label: 'p', kind: CompletionItemKind.Variable },
        { label: 'n', kind: CompletionItemKind.Variable },
        { label: 'r', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('suggests variable in WITH', () => {
    const query = 'MATCH (n:Person) WITH ';

    testCompletionContains({
      query,
      expected: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('suggests both variables after renaming variable', () => {
    const query = 'MATCH (n:Person) WITH n as m RETURN';
    testCompletionContains({
      query,
      expected: [
        { label: 'n', kind: CompletionItemKind.Variable },
        { label: 'm', kind: CompletionItemKind.Variable },
      ],
    });
  });

  test('does not suggest variable when renaming variable', () => {
    const query = 'MATCH (n:Person) WITH n as';

    testCompletionDoesNotContain({
      query,
      excluded: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('does not suggest variables when unwinding ', () => {
    const query = 'MATCH (n:Person) UNWIND [] as';

    testCompletionDoesNotContain({
      query,
      excluded: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('suggests variable in expression', () => {
    const query = 'WITH 1 as n RETURN db.function(';

    testCompletionContains({
      query,
      expected: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('completes unstarted variables that used but not defined when semantic analysis is not available', () => {
    const query = 'MATCH (:Person) WHERE n.name = "foo" RETURN n.name, n.age, ';

    testCompletionContains({
      query,
      expected: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('completes variables that used but not defined when semantic analysis is not available', () => {
    const query =
      'MATCH (:Person) WHERE movie.name = "foo" RETURN movie.name, movie.age, m';

    testCompletionContains({
      query,
      expected: [{ label: 'movie', kind: CompletionItemKind.Variable }],
    });
  });

  test('suggests variable for set', () => {
    const query = 'MATCH (n:Person) SET ';

    testCompletionContains({
      query,
      expected: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('suggests variable for remove', () => {
    const query = 'MATCH (n:Person) REMOVE ';

    testCompletionContains({
      query,
      expected: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('suggests variables for index hint rule', () => {
    const query = 'match (n) USING BTREE INDEX ';

    testCompletionContains({
      query,
      expected: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('does not suggest existing variables in clauses that create variables', () => {
    const cases = ['FOREACH (', 'LOAD CSV WITH HEADERS FROM 2 AS '];
    const base = 'WITH 1 as a ';

    cases.forEach((c) => {
      testCompletionDoesNotContain({
        query: base + c,
        excluded: [{ label: 'a', kind: CompletionItemKind.Variable }],
      });
    });
  });

  test('does not suggest existing variables in expressions that create variables', () => {
    const cases = ['reduce(', 'all(', 'any(', 'none(', 'single('];
    const base = 'WITH 1 as a RETURN ';

    cases.forEach((c) => {
      testCompletionDoesNotContain({
        query: base + c,
        excluded: [{ label: 'a', kind: CompletionItemKind.Variable }],
      });
    });
  });

  test('should not suggest variable when creating on in procedureResultItem', () => {
    const query = 'WITH 1 as n CALL apoc.super.thing() YIELD header as ';

    testCompletionDoesNotContain({
      query,
      excluded: [{ label: 'n', kind: CompletionItemKind.Variable }],
    });
  });

  test('should not take self into account for suggestions', () => {
    const query = 'RETURN variable';

    testCompletionDoesNotContain({
      query,
      excluded: [{ label: 'variable', kind: CompletionItemKind.Variable }],
    });
  });

  test("variables don't get suggested when working on constraints", () => {
    // dropping/ creating constraints is a top level command/statement so
    // we can't declare any variables to test against
    // this test is just for sanity checking that we don't suggest any variables
    const nodeConstraint = 'DROP CONSTRAINT ON (';
    const relConstraint = 'DROP CONSTRAINT ON ()-[';
    const propertyList = 'DROP CONSTRAINT ON (:Person) ASSERT EXISTS ';

    [nodeConstraint, relConstraint, propertyList].forEach((query) => {
      testCompletionDoesNotContain({
        query,
        excluded: [{ kind: CompletionItemKind.Variable }],
      });
    });
  });

  test('variables in map projections', () => {
    const query = `MATCH (movie:Movie)
    RETURN movie { .
    `;

    testCompletionDoesNotContain({
      query,
      excluded: [{ label: 'movie', kind: CompletionItemKind.Variable }],
    });
  });

  test('handle binding variables in subqueryInTransactionsReportParameters properly', () => {
    const query = `CALL { WITH 1 as a } IN TRANSACTIONS REPORT STATUS AS `;

    testCompletionDoesNotContain({
      query,
      excluded: [{ label: 'a', kind: CompletionItemKind.Variable }],
    });
  });
});
