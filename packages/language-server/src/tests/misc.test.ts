import { shouldBail } from '../helpers';

const bailingCases = [
  {
    name: 'Typing letters in end',
    lastQuery: 'MATCH (m',
    nextQuery: 'MATCH (mn',
    shouldBail: true,
  },
  {
    name: 'Typing symbol in end',
    lastQuery: 'MATCH (mnm',
    nextQuery: 'MATCH (mnm:',
    shouldBail: false,
  },
  //Here we would prefer to update the symbol table, but this heuristic would skip it (staying at "mn:Node" even after we rename to "mnm")
  {
    name: 'Typing letters in middle',
    lastQuery: 'MATCH (mn)-[:',
    nextQuery: 'MATCH (mnm)-[:',
    shouldBail: true,
  },
  {
    name: 'Typing symbol in middle',
    lastQuery: 'MATCH (mnm)-[:',
    nextQuery: 'MATCH (mnm )-[:',
    shouldBail: false,
  },
  {
    name: 'Pasting in multiple symbols at once',
    lastQuery: 'RETURN 50',
    nextQuery: 'MATCH (n) RETURN n',
    shouldBail: false,
  },
];

describe('Misc tests for the language server', () => {
  test('Bailing logic for symbol table calculation', () => {
    bailingCases.forEach((c) => {
      expect(
        shouldBail(c.nextQuery, c.lastQuery),
        "Failed on test '" + c.name + "'",
      ).toBe(c.shouldBail);
    });
    //expect(false).toBe(true);
  });
});
