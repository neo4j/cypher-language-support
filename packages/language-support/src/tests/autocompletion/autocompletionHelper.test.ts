import { shouldAutoCompleteYield } from '../../autocompletion/autoCompletionHelpers';

test('shouldAutoCompleteYield does not produce false negatives', () => {
  const query = 'MATCH dbms.components() YIELD ';
  expect(shouldAutoCompleteYield(query, 30)).toBe(true);
});

test('shouldAutoCompleteYield is not case sensitive', () => {
  const query = 'MATCH dbms.components() yIeLd ';
  expect(shouldAutoCompleteYield(query, 30)).toBe(true);
});

test('shouldAutoCompleteYield does not produce false positives', () => {
  const query1 = 'CALL dbms.components() YIELD';
  const query2 = 'CALL dbms.components() yield';
  const query3 = 'CALL dbms.components() ';
  expect(shouldAutoCompleteYield(query1, 29)).toBe(false);
  expect(shouldAutoCompleteYield(query2, 29)).toBe(false);
  expect(shouldAutoCompleteYield(query3, 24)).toBe(false);
});
