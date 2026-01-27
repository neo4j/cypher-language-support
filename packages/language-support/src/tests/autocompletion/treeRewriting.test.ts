import { isLabelLeaf, LabelOrCondition } from '../../types';
import { lintCypherQuery } from '../../syntaxValidation/syntaxValidation';
import {
  childAlreadyExists,
  convertToCNF,
  pushInNots,
  removeDuplicates,
} from '../../labelTreeRewriting';

const exampleQueries = {
  singleLabel: 'MATCH (n:Move)-[:]',
  twoDifferentLabels: 'MATCH (n:Person)-[]->(n:Driver)',
  repeatedLabel: 'MATCH (n:Person|Driver)-[]->(n:Person|Driver)', //<-- AND(OR(Person,Driver), OR(Person,Driver))
  mixOfDifferentAndRepeated: 'MATCH (n:Person|Driver)-[]->(n:Person|Friend)',
  simpleNot: 'MATCH (n:!Person)-[]->(n:!Person)',
  deeperNot: 'MATCH (n:!(Person|Driver))-[]-(n:!(Person|Driver))',
  deeperRelNot: 'MATCH ()-[r:!(KNOWS&IS)]-()-[r:!(KNOWS&IS)]-()',
  innerAnd: 'MATCH (n:(Person|(Monkey&Litterate)))',
  doubleInnerAnds: 'MATCH (n:((Person&Friend)|(Monkey&Litterate)))',
  deepCNFCase: 'MATCH (n:(Person|(Monkey&(Litterate|College_Educated))))',
  messyNonCNF:
    'MATCH (n:(Monkey&((Monkey&Litterate)|(Monkey&College_Educated))))',
  duplicationRiskOfOr:
    'MATCH (n:(((Monkey&Litterate)|(Monkey&College_Educated))))',
  orWithNot: 'MATCH (n:(!A|B|C))',
  orWithMultipleNots: 'MATCH (n:(!A|B|!C))',
  mixOfAndsOrsNots: 'MATCH (n:(!A|B|C)&(B&D)|E)',
  oddMessy: 'MATCH (n:(Monkey|((Monkey&Litterate)|(Monkey&College_Educated))))',
  // = Monkey|(Monkey&Litterate)|Monkey&College_Educated =
  // (Monkey&Litterate)|(Monkey&College_Educated)
};

describe('rewrite tree', () => {
  //singleLabel

  test('CNF calculation should work on single label', () => {
    const parsing = lintCypherQuery(exampleQueries.singleLabel, {}, false);
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    if (isLabelLeaf(firstSymbolLabels)) {
      expect(true).toEqual(false);
    } else {
      const cnfTree = convertToCNF(firstSymbolLabels);
      expect(cnfTree).toEqual({
        children: [
          {
            validFrom: 13,
            value: 'Move',
          },
        ],
        condition: 'and',
      });
    }
  });

  test('Pushing nots and removing duplicates should not affect tree without duplicates/nots', () => {
    const parsing = lintCypherQuery(
      exampleQueries.twoDifferentLabels,
      {},
      false,
    );
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    expect(deduplicatedTree).toEqual({
      children: [
        {
          validFrom: 15,
          value: 'Person',
        },
        {
          validFrom: 30,
          value: 'Driver',
        },
      ],
      condition: 'and',
    });
  });

  test('CNF calculation should not break label tree already on CNF', () => {
    const parsing = lintCypherQuery(
      exampleQueries.twoDifferentLabels,
      {},
      false,
    );
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    if (isLabelLeaf(firstSymbolLabels)) {
      expect(true).toEqual(false);
    } else {
      const cnfTree = convertToCNF(firstSymbolLabels);
      expect(cnfTree).toEqual({
        children: [
          {
            validFrom: 15,
            value: 'Person',
          },
          {
            validFrom: 30,
            value: 'Driver',
          },
        ],
        condition: 'and',
      });
    }
  });

  test('CNF calculation should deduplicate nodes', () => {
    const parsing = lintCypherQuery(exampleQueries.repeatedLabel, {}, false);
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    if (isLabelLeaf(firstSymbolLabels)) {
      expect(true).toEqual(false);
    } else {
      const cnfTree = convertToCNF(firstSymbolLabels);
      expect(cnfTree).toEqual(deduplicatedTree);
    }
  });

  test('CNF calculation should not break on NOTs', () => {
    const parsing = lintCypherQuery(exampleQueries.simpleNot, {}, false);
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    if (isLabelLeaf(firstSymbolLabels)) {
      expect(true).toEqual(false);
    } else {
      const cnfTree = convertToCNF(firstSymbolLabels);
      expect(cnfTree).toEqual(deduplicatedTree);
    }
  });

  test('CNF calculation should not break on NOT(OR(X,Y))', () => {
    const parsing = lintCypherQuery(exampleQueries.deeperNot, {}, false);
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    if (isLabelLeaf(firstSymbolLabels)) {
      expect(true).toEqual(false);
    } else {
      const cnfTree = convertToCNF(firstSymbolLabels);
      expect(cnfTree).toEqual(deduplicatedTree);
    }
  });

  test('CNF calculation should push ORs into inner AND', () => {
    //AND(OR(Person, AND(Monkey, Litterate))) =
    //AND(AND(OR(Person, Monkey), OR(Person, Litterate))) = AND(OR(Person,Monkey), OR(Person,Litterate))
    const parsing = lintCypherQuery(exampleQueries.innerAnd, {}, false);
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    if (isLabelLeaf(firstSymbolLabels)) {
      expect(true).toEqual(false);
    } else {
      const cnfTree = convertToCNF(firstSymbolLabels);
      expect(cnfTree).not.toEqual(deduplicatedTree);
      expect(cnfTree).toEqual({
        children: [
          {
            children: [
              {
                validFrom: 16,
                value: 'Person',
              },
              {
                validFrom: 24,
                value: 'Monkey',
              },
            ],
            condition: 'or',
          },
          {
            children: [
              {
                validFrom: 16,
                value: 'Person',
              },
              {
                validFrom: 34,
                value: 'Litterate',
              },
            ],
            condition: 'or',
          },
        ],
        condition: 'and',
      });
    }
  });

  test('CNF calculation should push ORs into inner AND also with double AND', () => {
    //AND(OR(AND(Person, Friend), AND(Monkey, Litterate))) =
    //AND(AND(OR(Person, AND(Monkey, Litterate)), OR(Friend, AND(Monkey, Litterate)))) =
    //AND(OR(Person,Monkey), OR(Person,Litterate))
    const parsing = lintCypherQuery(exampleQueries.doubleInnerAnds, {}, false);
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    if (isLabelLeaf(firstSymbolLabels)) {
      expect(true).toEqual(false);
    } else {
      const cnfTree = convertToCNF(firstSymbolLabels);
      expect(cnfTree).not.toEqual(deduplicatedTree);
      expect(cnfTree).toEqual({
        children: [
          {
            children: [
              {
                validFrom: 17,
                value: 'Person',
              },
              {
                validFrom: 33,
                value: 'Monkey',
              },
            ],
            condition: 'or',
          },
          {
            children: [
              {
                validFrom: 17,
                value: 'Person',
              },
              {
                validFrom: 43,
                value: 'Litterate',
              },
            ],
            condition: 'or',
          },
          {
            children: [
              {
                validFrom: 24,
                value: 'Friend',
              },
              {
                validFrom: 33,
                value: 'Monkey',
              },
            ],
            condition: 'or',
          },
          {
            children: [
              {
                validFrom: 24,
                value: 'Friend',
              },
              {
                validFrom: 43,
                value: 'Litterate',
              },
            ],
            condition: 'or',
          },
        ],
        condition: 'and',
      });
    }
  });

  test('CNF calculation should work with even greater depth', () => {
    //AND(OR(Person, AND(Monkey, OR(Litterate, College_Educated)))) =
    const parsing = lintCypherQuery(exampleQueries.deepCNFCase, {}, false);
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    if (isLabelLeaf(firstSymbolLabels)) {
      expect(true).toEqual(false);
    } else {
      const cnfTree = convertToCNF(firstSymbolLabels);
      expect(cnfTree).not.toEqual(deduplicatedTree);
      expect(cnfTree).toEqual({
        children: [
          {
            children: [
              {
                validFrom: 16,
                value: 'Person',
              },
              {
                validFrom: 24,
                value: 'Monkey',
              },
            ],
            condition: 'or',
          },
          {
            children: [
              {
                validFrom: 16,
                value: 'Person',
              },
              {
                validFrom: 35,
                value: 'Litterate',
              },
              {
                validFrom: 52,
                value: 'College_Educated',
              },
            ],
            condition: 'or',
          },
        ],
        condition: 'and',
      });
    }
  });

  test('CNF calculation simplifies needlessly messy label definition', () => {
    //AND(Monkey, OR(AND(Monkey, Litterate), AND(Monkey, College_Educated)))) =
    //AND(Monkey, AND(OR(Monkey, AND(Monkey,College_educated), OR(Litterate, AND(Monkey, College_Educated)))) =
    //AND(Monkey, AND(AND(OR(Monkey, Monkey), OR(Monkey, College_educated), OR(Litterate, Monkey), OR(Litterate, College_Educated)))) =
    //AND(Monkey, OR(Monkey, College_educated), OR(Monkey, Litterate), OR(Litterate, College_Educated))) =
    //AND(Monkey, OR(Litterate, College_Educated)) //Can remove OR(Monkey,_) because we already AND(Monkey,...) meaning any OR(Monkey,...) will bring nothing to the condition

    const parsing = lintCypherQuery(exampleQueries.messyNonCNF, {}, false);
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    if (isLabelLeaf(firstSymbolLabels)) {
      expect(true).toEqual(false);
    } else {
      const cnfTree = convertToCNF(firstSymbolLabels);
      expect(cnfTree).not.toEqual(deduplicatedTree);
      expect(cnfTree).toEqual({
        children: [
          {
            validFrom: 16,
            value: 'Monkey',
          },
          {
            children: [
              {
                validFrom: 35,
                value: 'Litterate',
              },
              {
                validFrom: 61,
                value: 'College_Educated',
              },
            ],
            condition: 'or',
          },
        ],
        condition: 'and',
      });
    }
  });

  test('CNF calculation simplifies away AND(OR(Monkey,Monkey), ...) to AND(Monkey, ...)', () => {
    const parsing = lintCypherQuery(
      exampleQueries.duplicationRiskOfOr,
      {},
      false,
    );
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    if (isLabelLeaf(firstSymbolLabels)) {
      expect(true).toEqual(false);
    } else {
      const cnfTree = convertToCNF(firstSymbolLabels);
      expect(cnfTree).not.toEqual(deduplicatedTree);
      expect(cnfTree).toEqual({
        children: [
          {
            validFrom: 18,
            value: 'Monkey',
          },
          {
            children: [
              {
                validFrom: 28,
                value: 'Litterate',
              },
              {
                validFrom: 54,
                value: 'College_Educated',
              },
            ],
            condition: 'or',
          },
        ],
        condition: 'and',
      });
    }
  });

  test('CNF calculation simplifies OR with a NOT inside', () => {
    const parsing = lintCypherQuery(exampleQueries.orWithNot, {}, false);
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    if (isLabelLeaf(firstSymbolLabels)) {
      expect(true).toEqual(false);
    } else {
      const cnfTree = convertToCNF(firstSymbolLabels);
      expect(cnfTree).not.toEqual(deduplicatedTree);
      expect(cnfTree).toEqual({
        children: [
          {
            children: [
              {
                validFrom: 12,
                value: 'A',
              },
            ],
            condition: 'not',
          },
        ],
        condition: 'and',
      });
    }
  });

  test('CNF removes Tautology: OR with multiple NOTs inside', () => {
    const parsing = lintCypherQuery(
      exampleQueries.orWithMultipleNots,
      {},
      false,
    );
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    if (isLabelLeaf(firstSymbolLabels)) {
      expect(true).toEqual(false);
    } else {
      const cnfTree = convertToCNF(firstSymbolLabels);
      expect(cnfTree).not.toEqual(deduplicatedTree);
      expect(cnfTree).toEqual({
        children: [],
        condition: 'and',
      });
    }
  });

  // MATCH (n:(!A|B|C)&(B&D)|E) <- AND(OR(E, AND(!A, B, D)) =
  // AND(AND(OR(E, !A), OR(E,B), OR(E,D))) = AND(!A, OR(E,B), OR(E,D))
  test('CNF handles Ands/Ors/Nots all at once', () => {
    const parsing = lintCypherQuery(exampleQueries.mixOfAndsOrsNots, {}, false);
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    if (isLabelLeaf(firstSymbolLabels)) {
      expect(true).toEqual(false);
    } else {
      const cnfTree = convertToCNF(firstSymbolLabels);
      expect(cnfTree).not.toEqual(deduplicatedTree);
      expect(cnfTree).toEqual({
        children: [
          {
            children: [
              {
                validFrom: 12,
                value: 'A',
              },
            ],
            condition: 'not',
          },
          {
            children: [
              {
                validFrom: 25,
                value: 'E',
              },
              {
                validFrom: 20,
                value: 'B',
              },
            ],
            condition: 'or',
          },
          {
            children: [
              {
                validFrom: 25,
                value: 'E',
              },
              {
                validFrom: 22,
                value: 'D',
              },
            ],
            condition: 'or',
          },
        ],
        condition: 'and',
      });
    }
  });

  test('Pushing not to labels should work', () => {
    const parsing = lintCypherQuery(exampleQueries.deeperNot, {}, false);
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    expect(labelsWithAdjustedNot).toEqual({
      children: [
        {
          children: [
            {
              validFrom: 17,
              value: 'Person',
            },
          ],
          condition: 'not',
        },
        {
          children: [
            {
              validFrom: 24,
              value: 'Driver',
            },
          ],
          condition: 'not',
        },
        {
          children: [
            {
              validFrom: 41,
              value: 'Person',
            },
          ],
          condition: 'not',
        },
        {
          children: [
            {
              validFrom: 48,
              value: 'Driver',
            },
          ],
          condition: 'not',
        },
      ],
      condition: 'and',
    });
  });

  test('Removing duplicates should work with nots', () => {
    const parsing = lintCypherQuery(exampleQueries.deeperNot, {}, false);
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    expect(deduplicatedTree).toEqual({
      children: [
        {
          children: [
            {
              validFrom: 17,
              value: 'Person',
            },
          ],
          condition: 'not',
        },
        {
          children: [
            {
              validFrom: 24,
              value: 'Driver',
            },
          ],
          condition: 'not',
        },
      ],
      condition: 'and',
    });
  });

  test('Removing duplicates should work for nested conditions', () => {
    const parsing = lintCypherQuery(exampleQueries.repeatedLabel, {}, false);
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(firstSymbolLabels).toEqual({
      children: [
        {
          children: [
            {
              validFrom: 15,
              value: 'Person',
            },
            {
              validFrom: 22,
              value: 'Driver',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              validFrom: 37,
              value: 'Person',
            },
            {
              validFrom: 44,
              value: 'Driver',
            },
          ],
          condition: 'or',
        },
      ],
      condition: 'and',
    });
    const deduplicatedTree = removeDuplicates(firstSymbolLabels);
    expect(deduplicatedTree).toEqual({
      children: [
        {
          children: [
            {
              validFrom: 15,
              value: 'Person',
            },
            {
              validFrom: 22,
              value: 'Driver',
            },
          ],
          condition: 'or',
        },
      ],
      condition: 'and',
    });
  });

  test('Should be able to detect if a duplicate condition already exists', () => {
    const existingConditions: LabelOrCondition[] = [
      { condition: 'or', children: [{ validFrom: 10, value: 'A' }] },
    ];
    expect(
      childAlreadyExists(existingConditions, {
        condition: 'or',
        children: [{ validFrom: 10, value: 'A' }],
      }),
    ).toEqual(true);
  });

  test('Should be able to detect if a duplicate condition already exists among all children', () => {
    const existingConditions: LabelOrCondition[] = [
      { condition: 'or', children: [{ validFrom: 200, value: 'A' }] },
      { condition: 'or', children: [{ validFrom: 14, value: 'B' }] },
      { condition: 'and', children: [{ validFrom: 10, value: 'A' }] },
    ];
    expect(
      childAlreadyExists(existingConditions, {
        condition: 'and',
        children: [{ validFrom: 10, value: 'A' }],
      }),
    ).toEqual(true);
  });

  test('Should require all children of a condition to be equal to an existing condition, no false positives', () => {
    const existingConditions: LabelOrCondition[] = [
      { condition: 'or', children: [{ validFrom: 200, value: 'A' }] },
      { condition: 'or', children: [{ validFrom: 14, value: 'B' }] },
      {
        condition: 'and',
        children: [
          { validFrom: 10, value: 'A' },
          { validFrom: 100, value: 'C' },
        ],
      },
    ];
    expect(
      childAlreadyExists(existingConditions, {
        condition: 'and',
        children: [
          { validFrom: 10, value: 'A' },
          { validFrom: 100, value: 'B' },
        ],
      }),
    ).toEqual(false);
  });

  test('Should require all children of a condition to be equal to an existing condition, no false negatives', () => {
    const existingConditions: LabelOrCondition[] = [
      { condition: 'or', children: [{ validFrom: 200, value: 'A' }] },
      { condition: 'or', children: [{ validFrom: 14, value: 'B' }] },
      {
        condition: 'and',
        children: [
          { validFrom: 10, value: 'A' },
          { validFrom: 100, value: 'C' },
        ],
      },
    ];
    expect(
      childAlreadyExists(existingConditions, {
        condition: 'and',
        children: [
          { validFrom: 10, value: 'A' },
          { validFrom: 100, value: 'C' },
        ],
      }),
    ).toEqual(true);
  });

  test('Should be able to detect if a duplicate label already exists', () => {
    const existingConditions: LabelOrCondition[] = [
      { validFrom: 10, value: 'A' },
    ];
    expect(
      childAlreadyExists(existingConditions, { validFrom: 10, value: 'A' }),
    ).toEqual(true);
  });

  test('Should be able to detect if a duplicate label already exists among all children', () => {
    const existingConditions: LabelOrCondition[] = [
      { validFrom: 10, value: 'B' },
      { validFrom: 15, value: 'C' },
      { validFrom: 23, value: 'A' },
      { validFrom: 10, value: 'D' },
    ];
    expect(
      childAlreadyExists(existingConditions, { validFrom: 10, value: 'A' }),
    ).toEqual(true);
  });

  test('Should ignore position', () => {
    const existingConditions: LabelOrCondition[] = [
      { validFrom: 10, value: 'B' },
      { validFrom: 15, value: 'C' },
      { validFrom: 23, value: 'A' },
      { validFrom: 10, value: 'D' },
    ];
    expect(
      childAlreadyExists(existingConditions, { validFrom: 999, value: 'A' }),
    ).toEqual(true);
  });

  test('Should respect label', () => {
    const existingConditions: LabelOrCondition[] = [
      { validFrom: 10, value: 'B' },
      { validFrom: 15, value: 'C' },
      { validFrom: 23, value: 'A' },
      { validFrom: 10, value: 'D' },
    ];
    expect(
      childAlreadyExists(existingConditions, { validFrom: 10, value: 'AB' }),
    ).toEqual(false);
  });
});
