import { CompletionItemKind } from 'vscode-languageserver-types';
import { testCompletions } from './completionAssertionHelpers';

describe("Speed test of clause-cases where candidateCollection can be slow", () => {
    //Before adjustments to candidate collection, this query was incredibly slow to produce completions
  test('Should not slow down label completions on query with many WITH-clauses', () => {
    const query = `
      MATCH (n1) WITH * LIMIT 1
  MATCH (n2) WITH * LIMIT 1
  MATCH (n3) WITH * LIMIT 1
  MATCH (n4) WITH * LIMIT 1
  MATCH (n5) WITH * LIMIT 1
  MATCH (n6) WITH * LIMIT 1
  MATCH (n7) WITH * LIMIT 1
  MATCH (n8) WITH * LIMIT 1
  MATCH (n9) WITH * LIMIT 1
  MATCH (n10) WITH * LIMIT 1
  MATCH (n11) WITH * LIMIT 1
  MATCH (n12) WITH * LIMIT 1
  MATCH (n13) WITH * LIMIT 1
  MATCH (n14) WITH * LIMIT 1
  MATCH (n15) WITH * LIMIT 1
  MATCH (n16) WITH * LIMIT 1
  MATCH (n17) WITH * LIMIT 1
  MATCH (n18) WITH * LIMIT 1
  MATCH (n19) WITH * LIMIT 1
  MATCH (n20) WITH * LIMIT 1
  MATCH (n21) WITH * LIMIT 1
  MATCH (n22) WITH * LIMIT 1
  MATCH (n23) WITH * LIMIT 1
  MATCH (n24)-[:`;

  const startTime = performance.now();
  testCompletions({
      query,
      expected: [
      ],
    });
  const endTime = performance.now();
  expect(endTime-startTime).toBeLessThan(5000);
  });

  //This variant had the same issue, but ends up with a differnt parser._ctx in completionCoreErrors
  test('Should not slow down completions on query with many WITH-clauses. Limitation: Breaks some completions', () => {
    const query = `
      MATCH (n1) WITH * LIMIT 1
  MATCH (n2) WITH * LIMIT 1
  MATCH (n3) WITH * LIMIT 1
  MATCH (n4) WITH * LIMIT 1
  MATCH (n5) WITH * LIMIT 1
  MATCH (n6) WITH * LIMIT 1
  MATCH (n7) WITH * LIMIT 1
  MATCH (n8) WITH * LIMIT 1
  MATCH (n9) WITH * LIMIT 1
  MATCH (n10) WITH * LIMIT 1
  MATCH (n11) WITH * LIMIT 1
  MATCH (n12) WITH * LIMIT 1
  MATCH (n13) WITH * LIMIT 1
  MATCH (n14) WITH * LIMIT 1
  MATCH (n15) WITH * LIMIT 1
  MATCH (n16) WITH * LIMIT 1
  MATCH (n17) WITH * LIMIT 1
  MATCH (n18) WITH * LIMIT 1
  MATCH (n19) WITH * LIMIT 1
  MATCH (n20) WITH * LIMIT 1
  MATCH (n21) WITH * LIMIT 1
  MATCH (n22) WITH * LIMIT 1
  MATCH (n23) WITH * LIMIT 1
  MATCH (n24) RET`;

  const startTime = performance.now();
  testCompletions({
      query,
      expected: [
        //{ label: 'RETURN', kind: CompletionItemKind.Keyword }
      ],
    });
  const endTime = performance.now();
  expect(endTime-startTime).toBeLessThan(5000);
  });

  test('Should not slow down completions on query with many WITH-clauses, also when caret is not at the end. Limitation: Breaks some completions', () => {
    const queryBeforeCaret = `
      MATCH (n1) WITH * LIMIT 1
  MATCH (n2) WITH * LIMIT 1
  MATCH (n3) WITH * LIMIT 1
  MATCH (n4) WITH * LIMIT 1
  MATCH (n5) WITH * LIMIT 1
  MATCH (n6) WITH * LIMIT 1
  MATCH (n7) WITH * LIMIT 1
  MATCH (n8) WITH * LIMIT 1
  MATCH (n9) WITH * LIMIT 1
  MATCH (n10) WITH * LIMIT 1
  MATCH (n11) WITH * LIMIT 1
  MATCH (n12) WITH * LIMIT 1
  MATCH (n13) WITH * LIMIT 1
  MATCH (n14) WITH * LIMIT 1
  MATCH (n15) WITH * LIMIT 1
  MATCH (n16) WITH * LIMIT 1
  MATCH (n17) WITH * LIMIT 1
  MATCH (n18) WITH * LIMIT 1
  MATCH (n19) WITH * LIMIT 1
  MATCH (n20) WITH * LIMIT 1
  MATCH (n21) WITH * LIMIT 1
  MATCH (n22) WITH * LIMIT 1
  MATCH (n23) WITH * LIMIT 1
  MATCH (m) RET`;
  const queryAfterCaret = `
  MATCH (n24) WITH * LIMIT 1
 `
  const query = queryBeforeCaret + queryAfterCaret;

  const startTime = performance.now();
  testCompletions({
      query,
      offset: queryBeforeCaret.length,
      expected: [
        //{ label: 'RETURN', kind: CompletionItemKind.Keyword }
      ],
    });
  const endTime = performance.now();
  expect(endTime-startTime).toBeLessThan(5000);
  });

  test('Should not need to speed up completion if number of clauses before current clause is small', () => {
    const queryBeforeCaret = `
      MATCH (n1) WITH * LIMIT 1
  MATCH (n2) WITH * LIMIT 1
  MATCH (m) RET`;
  const queryAfterCaret = `
  MATCH (n3) WITH * LIMIT 1
  MATCH (n4) WITH * LIMIT 1
  MATCH (n5) WITH * LIMIT 1
  MATCH (n6) WITH * LIMIT 1
  MATCH (n7) WITH * LIMIT 1
  MATCH (n8) WITH * LIMIT 1
  MATCH (n9) WITH * LIMIT 1
  MATCH (n10) WITH * LIMIT 1
  MATCH (n11) WITH * LIMIT 1
  MATCH (n12) WITH * LIMIT 1
  MATCH (n13) WITH * LIMIT 1
  MATCH (n14) WITH * LIMIT 1
  MATCH (n15) WITH * LIMIT 1
  MATCH (n16) WITH * LIMIT 1
  MATCH (n17) WITH * LIMIT 1
  MATCH (n18) WITH * LIMIT 1
  MATCH (n19) WITH * LIMIT 1
  MATCH (n20) WITH * LIMIT 1
  MATCH (n21) WITH * LIMIT 1
  MATCH (n22) WITH * LIMIT 1
  MATCH (n23) WITH * LIMIT 1
  MATCH (n24) WITH * LIMIT 1
 `
  const query = queryBeforeCaret + queryAfterCaret;

  const startTime = performance.now();
  testCompletions({
      query,
      offset: queryBeforeCaret.length,
      expected: [
        { label: 'RETURN', kind: CompletionItemKind.Keyword }
      ],
    });
  const endTime = performance.now();
  expect(endTime-startTime).toBeLessThan(5000);
  });

  test('Handling when last clause is not subquery-clause still works', () => {
    const query = `MATCH (n1) WITH * LIMIT 1
    CALL (*) {
  WHEN n1 IS NULL THEN
  `

  const startTime = performance.now();
  testCompletions({
      query,
      expected: [
        { label: 'RETURN', kind: CompletionItemKind.Keyword }
      ],
    });
  const endTime = performance.now();
  expect(endTime-startTime).toBeLessThan(5000);
  });

  test('Dont run into issues when last rule in query is subquery-clause', () => {
    const query = `
      MATCH (n1) WITH * LIMIT 1
  MATCH (n2) WITH * LIMIT 1
  MATCH (n3) WITH * LIMIT 1
  MATCH (n4) WITH * LIMIT 1
  MATCH (n5) WITH * LIMIT 1
  MATCH (n6) WITH * LIMIT 1
  MATCH (n7) WITH * LIMIT 1
  MATCH (n8) WITH * LIMIT 1
  MATCH (n9) WITH * LIMIT 1
  MATCH (n10) WITH * LIMIT 1
  MATCH (n11) WITH * LIMIT 1
  MATCH (n12) WITH * LIMIT 1
  MATCH (n13) WITH * LIMIT 1
  MATCH (n14) WITH * LIMIT 1
  MATCH (n15) WITH * LIMIT 1
  MATCH (n16) WITH * LIMIT 1
  MATCH (n17) WITH * LIMIT 1
  MATCH (n18) WITH * LIMIT 1
  MATCH (n19) WITH * LIMIT 1
  MATCH (n20) WITH * LIMIT 1
  MATCH (n21) WITH * LIMIT 1
  MATCH (n22) WITH * LIMIT 1
  MATCH (n23) WITH * LIMIT 1
  CALL (*) {
    WHEN n1 IS NULL THEN `

  const startTime = performance.now();
  testCompletions({
      query,
      expected: [
        { label: 'RETURN', kind: CompletionItemKind.Keyword }
      ],
    });
  const endTime = performance.now();
  expect(endTime-startTime).toBeLessThan(5000);
  });

  test('Handling is quick when last rule is big queryWithLocalDefinitions. Limitation: Breaks some queries', () => {
    const query = `
      MATCH (n1) WITH * LIMIT 1
  UNION {
  MATCH (n2) WITH * LIMIT 1
  MATCH (n3) WITH * LIMIT 1
  MATCH (n4) WITH * LIMIT 1
  MATCH (n5) WITH * LIMIT 1
  MATCH (n6) WITH * LIMIT 1
  MATCH (n7) WITH * LIMIT 1
  MATCH (n8) WITH * LIMIT 1
  MATCH (n9) WITH * LIMIT 1
  MATCH (n10) WITH * LIMIT 1
  MATCH (n11) WITH * LIMIT 1
  MATCH (n12) WITH * LIMIT 1
  MATCH (n13) WITH * LIMIT 1
  MATCH (n14) WITH * LIMIT 1
  MATCH (n15) WITH * LIMIT 1
  MATCH (n16) WITH * LIMIT 1
  MATCH (n17) WITH * LIMIT 1
  MATCH (n18) WITH * LIMIT 1
  MATCH (n19) WITH * LIMIT 1
  MATCH (n20) WITH * LIMIT 1
  MATCH (n21) WITH * LIMIT 1
  MATCH (n22) WITH * LIMIT 1
  MATCH (n23) WITH * LIMIT 1
  MATCH (n) RET`

  const startTime = performance.now();
  testCompletions({
      query,
      expected: [
        //{ label: 'RETURN', kind: CompletionItemKind.Keyword }
      ],
    });
  const endTime = performance.now();
  expect(endTime-startTime).toBeLessThan(5000);
  });

  test('Can handle multiple unions', () => {
    const query = `
      MATCH (n1) WITH * LIMIT 1
UNION
  MATCH (n2) WITH * LIMIT 1
UNION
  MATCH (n3) WITH * LIMIT 1
UNION
  MATCH (n4) WITH * LIMIT 1
UNION
  MATCH (n5) WITH * LIMIT 1
UNION
  MATCH (n6) WITH * LIMIT 1
UNION
  MATCH (n7) WITH * LIMIT 1
UNION
  MATCH (n8) WITH * LIMIT 1
UNION
  MATCH (n9) WITH * LIMIT 1
UNION
  MATCH (n10) WITH * LIMIT 1
UNION
  MATCH (n11) WITH * LIMIT 1
UNION
  MATCH (n12) WITH * LIMIT 1
UNION
  MATCH (n13) WITH * LIMIT 1
UNION
  MATCH (n14) WITH * LIMIT 1
UNION
  MATCH (n15) WITH * LIMIT 1
UNION
  MATCH (n16) WITH * LIMIT 1
UNION
  MATCH (n17) WITH * LIMIT 1
UNION
  MATCH (n18) WITH * LIMIT 1
UNION
  MATCH (n19) WITH * LIMIT 1
UNION
  MATCH (n20) WITH * LIMIT 1
UNION
  MATCH (n21) WITH * LIMIT 1
UNION
  MATCH (n22) WITH * LIMIT 1
UNION
  MATCH (n23) WITH * LIMIT 1
  MATCH (n) RET`

  const startTime = performance.now();
  testCompletions({
      query,
      expected: [
        { label: 'RETURN', kind: CompletionItemKind.Keyword }
      ],
    });
  const endTime = performance.now();
  expect(endTime-startTime).toBeLessThan(5000);
  });

  //This one is interesting. It seems we only get correct completion if we use ctx...
  test('Can handle singleQuery with inner queryWithLocalDefinitions', () => {
    const query = `
MATCH (m) RETURN m
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION {MATCH (n) RETURN n UNION MATCH (n) RETURN n}
UNION MATCH (n) RET`

  const startTime = performance.now();
  testCompletions({
      query,
      expected: [
        { label: 'RETURN', kind: CompletionItemKind.Keyword }
      ],
    });
  const endTime = performance.now();
  expect(endTime-startTime).toBeLessThan(5000);
  });

  // This query was never slow, but useful to show how the above query can slow completions compared to another query of the same size
  test('Should quickly complete query with many MATCH clauses. Limitation: Breaks some queries that were fast before', () => {
    const query = `
      MATCH (n1) LIMIT 1
  MATCH (n2) LIMIT 1
  MATCH (n3) LIMIT 1
  MATCH (n4) LIMIT 1
  MATCH (n5) LIMIT 1
  MATCH (n6) LIMIT 1
  MATCH (n7) LIMIT 1
  MATCH (n8) LIMIT 1
  MATCH (n9) LIMIT 1
  MATCH (n10) LIMIT 1
  MATCH (n11) LIMIT 1
  MATCH (n12) LIMIT 1
  MATCH (n13) LIMIT 1
  MATCH (n14) LIMIT 1
  MATCH (n15) LIMIT 1
  MATCH (n16) LIMIT 1
  MATCH (n17) LIMIT 1
  MATCH (n18) LIMIT 1
  MATCH (n19) LIMIT 1
  MATCH (n20) LIMIT 1
  MATCH (n21) LIMIT 1
  MATCH (n22) LIMIT 1
  MATCH (n23) LIMIT 1
  MATCH (n24) LIMIT 1
  MATCH (n25) LIMIT 1
  MATCH (n26) LIMIT 1
  MATCH (n27) LIMIT 1
  MATCH (n28) LIMIT 1
  MATCH (n29) LIMIT 1
  MATCH (n30) LIMIT 1
  MATCH (n31) LIMIT 1
  MATCH (n32) LIMIT 1
  MATCH (n33) LIMIT 1
  MATCH (n34) LIMIT 1
  MATCH (n35) LIMIT 1
  MATCH (n36) RET`;

    const startTime = performance.now();
    testCompletions({
      query,
      expected: [
        //{ label: 'RETURN', kind: CompletionItemKind.Keyword }
      ],
    });
    const endTime = performance.now();
    expect(endTime-startTime).toBeLessThan(5000);
  });
})