import { isLabelLeaf, LabelOrCondition } from '../../types.js';
import {
  childAlreadyExists,
  normalizeLabelTreeForSchemaCheck,
  pushInNots,
  removeInnerAnys,
  removeDuplicates,
} from '../../labelTreeRewriting.js';
import { lintCypherQuery } from '../../syntaxValidation/syntaxValidation.js';

function toNormalForm(
  labels: LabelOrCondition,
  form: 'dnf' | 'cnf',
): LabelOrCondition {
  const result = normalizeLabelTreeForSchemaCheck(labels, form);
  if (result.kind !== 'converted') {
    throw new Error(`Expected a converted label tree, got '${result.kind}'`);
  }
  return result.tree;
}

const exampleQueries = {
  singleLabel: 'MATCH (n:Move)-[:]',
  twoDifferentLabels: 'MATCH (n:Person)-[]->(n:Driver)',
  repeatedLabel: 'MATCH (n:Person|Driver)-[]->(n:Person|Driver)',
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
  orWithinOr:
    'MATCH (n:(Person|((Monkey&Litterate)|(Monkey&College_Educated))))',
  threeInnerAnds: 'MATCH (n:((A&B)|(C&D)|(E&F)))',
};

describe('rewrite tree', () => {
  test('CNF calculation should work on single label', () => {
    const parsing = lintCypherQuery(exampleQueries.singleLabel, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(isLabelLeaf(firstSymbolLabels)).toEqual(false);
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(cnfTree).toEqual({
      children: [
        {
          value: 'Move',
        },
      ],
      condition: 'and',
    });
  });

  test('Pushing nots and removing duplicates should not affect tree without duplicates/nots', () => {
    const parsing = lintCypherQuery(exampleQueries.twoDifferentLabels, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    expect(deduplicatedTree).toEqual({
      children: [
        {
          value: 'Person',
        },
        {
          value: 'Driver',
        },
      ],
      condition: 'and',
    });
  });

  test('CNF calculation should not break label tree already on CNF', () => {
    const parsing = lintCypherQuery(exampleQueries.twoDifferentLabels, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(cnfTree).toEqual({
      children: [
        {
          value: 'Person',
        },
        {
          value: 'Driver',
        },
      ],
      condition: 'and',
    });
  });

  test('CNF calculation should deduplicate nodes', () => {
    const parsing = lintCypherQuery(exampleQueries.repeatedLabel, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(cnfTree).toEqual(deduplicatedTree);
  });

  test('CNF calculation should not break on NOTs', () => {
    const parsing = lintCypherQuery(exampleQueries.simpleNot, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(cnfTree).toEqual(deduplicatedTree);
  });

  test('CNF calculation should not break on NOT(OR(X,Y))', () => {
    const parsing = lintCypherQuery(exampleQueries.deeperNot, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(cnfTree).toEqual(deduplicatedTree);
  });

  test('CNF calculation should push ORs into inner AND', () => {
    //AND(OR(Person, AND(Monkey, Litterate))) =
    //AND(AND(OR(Person, Monkey), OR(Person, Litterate))) =
    //AND(OR(Person,Monkey), OR(Person,Litterate))
    const parsing = lintCypherQuery(exampleQueries.innerAnd, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(cnfTree).not.toEqual(deduplicatedTree);
    expect(cnfTree).toEqual({
      children: [
        {
          children: [
            {
              value: 'Person',
            },
            {
              value: 'Monkey',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              value: 'Person',
            },
            {
              value: 'Litterate',
            },
          ],
          condition: 'or',
        },
      ],
      condition: 'and',
    });
  });

  test('CNF calculation should push ORs into inner AND also with double AND', () => {
    //AND(OR(AND(Person, Friend), AND(Monkey, Litterate))) =
    //AND(AND(OR(Person, AND(Monkey, Litterate)), OR(Friend, AND(Monkey, Litterate)))) =
    //AND(OR(Person,Monkey), OR(Person,Litterate))
    const parsing = lintCypherQuery(exampleQueries.doubleInnerAnds, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(cnfTree).not.toEqual(deduplicatedTree);
    expect(cnfTree).toEqual({
      children: [
        {
          children: [
            {
              value: 'Person',
            },
            {
              value: 'Monkey',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              value: 'Person',
            },
            {
              value: 'Litterate',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              value: 'Friend',
            },
            {
              value: 'Monkey',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              value: 'Friend',
            },
            {
              value: 'Litterate',
            },
          ],
          condition: 'or',
        },
      ],
      condition: 'and',
    });
  });

  test('CNF calculation should work with even greater depth', () => {
    const parsing = lintCypherQuery(exampleQueries.deepCNFCase, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(cnfTree).not.toEqual(deduplicatedTree);
    expect(cnfTree).toEqual({
      children: [
        {
          children: [
            {
              value: 'Person',
            },
            {
              value: 'Monkey',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              value: 'Person',
            },
            {
              value: 'Litterate',
            },
            {
              value: 'College_Educated',
            },
          ],
          condition: 'or',
        },
      ],
      condition: 'and',
    });
  });

  test('CNF calculation simplifies needlessly messy label definition', () => {
    //AND(Monkey, OR(AND(Monkey, Litterate), AND(Monkey, College_Educated)))) =
    //AND(Monkey, AND(OR(Monkey, AND(Monkey,College_educated), OR(Litterate, AND(Monkey, College_Educated)))) =
    //AND(Monkey, AND(AND(OR(Monkey, Monkey), OR(Monkey, College_educated), OR(Litterate, Monkey), OR(Litterate, College_Educated)))) =
    //AND(Monkey, OR(Monkey, College_educated), OR(Monkey, Litterate), OR(Litterate, College_Educated))) =
    //AND(Monkey, OR(Litterate, College_Educated))

    const parsing = lintCypherQuery(exampleQueries.messyNonCNF, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(cnfTree).not.toEqual(deduplicatedTree);
    expect(cnfTree).toEqual({
      children: [
        {
          value: 'Monkey',
        },
        {
          children: [
            {
              value: 'Litterate',
            },
            {
              value: 'College_Educated',
            },
          ],
          condition: 'or',
        },
      ],
      condition: 'and',
    });
  });

  test('CNF calculation simplifies away AND(OR(Monkey,Monkey), ...) to AND(Monkey, ...)', () => {
    const parsing = lintCypherQuery(exampleQueries.duplicationRiskOfOr, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(cnfTree).not.toEqual(deduplicatedTree);
    expect(cnfTree).toEqual({
      children: [
        {
          value: 'Monkey',
        },
        {
          children: [
            {
              value: 'Litterate',
            },
            {
              value: 'College_Educated',
            },
          ],
          condition: 'or',
        },
      ],
      condition: 'and',
    });
  });

  test('CNF calculation simplifies OR with a NOT inside', () => {
    const parsing = lintCypherQuery(exampleQueries.orWithNot, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(cnfTree).not.toEqual(deduplicatedTree);
    expect(cnfTree).toEqual({
      children: [
        {
          children: [
            {
              value: 'A',
            },
          ],
          condition: 'not',
        },
      ],
      condition: 'and',
    });
  });

  test('CNF removes Tautology: OR with multiple NOTs inside', () => {
    const parsing = lintCypherQuery(exampleQueries.orWithMultipleNots, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(cnfTree).not.toEqual(deduplicatedTree);
    expect(cnfTree).toEqual({
      children: [],
      condition: 'and',
    });
  });

  test('CNF handles ! with |', () => {
    const parsing = lintCypherQuery('MATCH (n:!A&(B|C)&!D)', {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(deduplicatedTree).not.toEqual(cnfTree);
    expect(cnfTree).toEqual({
      children: [
        {
          children: [
            {
              value: 'B',
            },
            {
              value: 'C',
            },
          ],
          condition: 'or',
        },
      ],
      condition: 'and',
    });
  });

  test('CNF handles Ands/Ors/Nots all at once', () => {
    // MATCH (n:(!A|B|C)&(B&D)|E) <- AND(OR(E, AND(!A, B, D)) =
    // AND(AND(OR(E, !A), OR(E,B), OR(E,D))) =
    // AND(!A, OR(E,B), OR(E,D))
    const parsing = lintCypherQuery(exampleQueries.mixOfAndsOrsNots, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(cnfTree).not.toEqual(deduplicatedTree);
    expect(cnfTree).toEqual({
      children: [
        {
          children: [
            {
              value: 'E',
            },
            {
              value: 'B',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              value: 'E',
            },
            {
              value: 'D',
            },
          ],
          condition: 'or',
        },
      ],
      condition: 'and',
    });
  });

  test('CNF handles nested ors', () => {
    const parsing = lintCypherQuery(exampleQueries.orWithinOr, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(cnfTree).not.toEqual(deduplicatedTree);
    expect(cnfTree).toEqual({
      children: [
        {
          children: [
            {
              value: 'Person',
            },
            {
              value: 'Monkey',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              value: 'Person',
            },
            {
              value: 'Litterate',
            },
            {
              value: 'College_Educated',
            },
          ],
          condition: 'or',
        },
      ],
      condition: 'and',
    });
  });

  test('CNF calculation should work with three inner ANDs (regression test for slice bug)', () => {
    // OR(AND(A,B), AND(C,D), AND(E,F)) should distribute to:
    // AND(OR(A,C,E), OR(A,C,F), OR(A,D,E), OR(A,D,F), OR(B,C,E), OR(B,C,F), OR(B,D,E), OR(B,D,F))
    const parsing = lintCypherQuery(exampleQueries.threeInnerAnds, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const cnfTree = toNormalForm(firstSymbolLabels, 'cnf');
    expect(cnfTree).toEqual({
      children: [
        {
          children: [
            {
              value: 'A',
            },
            {
              value: 'C',
            },
            {
              value: 'E',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              value: 'A',
            },
            {
              value: 'C',
            },
            {
              value: 'F',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              value: 'A',
            },
            {
              value: 'D',
            },
            {
              value: 'E',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              value: 'A',
            },
            {
              value: 'D',
            },
            {
              value: 'F',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              value: 'B',
            },
            {
              value: 'C',
            },
            {
              value: 'E',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              value: 'B',
            },
            {
              value: 'C',
            },
            {
              value: 'F',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              value: 'B',
            },
            {
              value: 'D',
            },
            {
              value: 'E',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              value: 'B',
            },
            {
              value: 'D',
            },
            {
              value: 'F',
            },
          ],
          condition: 'or',
        },
      ],
      condition: 'and',
    });
  });

  test('Pushing not to labels should work', () => {
    const parsing = lintCypherQuery(exampleQueries.deeperNot, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    expect(labelsWithAdjustedNot).toEqual({
      children: [
        {
          children: [
            {
              value: 'Person',
            },
          ],
          condition: 'not',
        },
        {
          children: [
            {
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
    const parsing = lintCypherQuery(exampleQueries.deeperNot, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const labelsWithAdjustedNot = pushInNots(firstSymbolLabels);
    const deduplicatedTree = removeDuplicates(labelsWithAdjustedNot);
    expect(deduplicatedTree).toEqual({
      children: [
        {
          children: [
            {
              value: 'Person',
            },
          ],
          condition: 'not',
        },
        {
          children: [
            {
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
    const parsing = lintCypherQuery(exampleQueries.repeatedLabel, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(firstSymbolLabels).toEqual({
      children: [
        {
          children: [
            {
              value: 'Person',
            },
            {
              value: 'Driver',
            },
          ],
          condition: 'or',
        },
        {
          children: [
            {
              value: 'Person',
            },
            {
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
              value: 'Person',
            },
            {
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
      { condition: 'or', children: [{ value: 'A' }] },
    ];
    expect(
      childAlreadyExists(existingConditions, {
        condition: 'or',
        children: [{ value: 'A' }],
      }),
    ).toEqual(true);
  });

  test('Should be able to detect if a duplicate condition already exists among all children', () => {
    const existingConditions: LabelOrCondition[] = [
      { condition: 'or', children: [{ value: 'A' }] },
      { condition: 'or', children: [{ value: 'B' }] },
      { condition: 'and', children: [{ value: 'A' }] },
    ];
    expect(
      childAlreadyExists(existingConditions, {
        condition: 'and',
        children: [{ value: 'A' }],
      }),
    ).toEqual(true);
  });

  test('Should require all children of a condition to be equal to an existing condition, no false positives', () => {
    const existingConditions: LabelOrCondition[] = [
      { condition: 'or', children: [{ value: 'A' }] },
      { condition: 'or', children: [{ value: 'B' }] },
      {
        condition: 'and',
        children: [{ value: 'A' }, { value: 'C' }],
      },
    ];
    expect(
      childAlreadyExists(existingConditions, {
        condition: 'and',
        children: [{ value: 'A' }, { value: 'B' }],
      }),
    ).toEqual(false);
  });

  test('Should require all children of a condition to be equal to an existing condition, no false negatives', () => {
    const existingConditions: LabelOrCondition[] = [
      { condition: 'or', children: [{ value: 'A' }] },
      { condition: 'or', children: [{ value: 'B' }] },
      {
        condition: 'and',
        children: [{ value: 'A' }, { value: 'C' }],
      },
    ];
    expect(
      childAlreadyExists(existingConditions, {
        condition: 'and',
        children: [{ value: 'A' }, { value: 'C' }],
      }),
    ).toEqual(true);
  });

  test('Should be able to detect if a duplicate label already exists', () => {
    const existingConditions: LabelOrCondition[] = [{ value: 'A' }];
    expect(childAlreadyExists(existingConditions, { value: 'A' })).toEqual(
      true,
    );
  });

  test('Should be able to detect if a duplicate label already exists among all children', () => {
    const existingConditions: LabelOrCondition[] = [
      { value: 'B' },
      { value: 'C' },
      { value: 'A' },
      { value: 'D' },
    ];
    expect(childAlreadyExists(existingConditions, { value: 'A' })).toEqual(
      true,
    );
  });

  test('Should ignore position', () => {
    const existingConditions: LabelOrCondition[] = [
      { value: 'B' },
      { value: 'C' },
      { value: 'A' },
      { value: 'D' },
    ];
    expect(childAlreadyExists(existingConditions, { value: 'A' })).toEqual(
      true,
    );
  });

  test('Should respect label', () => {
    const existingConditions: LabelOrCondition[] = [
      { value: 'B' },
      { value: 'C' },
      { value: 'A' },
      { value: 'D' },
    ];
    expect(childAlreadyExists(existingConditions, { value: 'AB' })).toEqual(
      false,
    );
  });

  test('AND with only ANY label should become ANY', () => {
    const query = 'MATCH (n:%)';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(removeInnerAnys(firstSymbolLabels)).toEqual({
      condition: 'any',
      children: [],
    });
  });

  test('Longer AND with only ANY labels should become ANY', () => {
    const query = 'MATCH (n:% & % & %)';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(removeInnerAnys(firstSymbolLabels)).toEqual({
      condition: 'any',
      children: [],
    });
  });

  test('Should remove ANYs from AND with other labels', () => {
    const query = 'MATCH (n:A & % & % & %)';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(removeInnerAnys(firstSymbolLabels)).toEqual({
      condition: 'and',
      children: [{ value: 'A' }],
    });
  });

  test('OR with ANY should become ANY', () => {
    const query = 'MATCH (n:A | %)';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(removeInnerAnys(firstSymbolLabels)).toEqual({
      condition: 'any',
      children: [],
    });
  });

  test('OR with ANYs should become single ANY', () => {
    const query = 'MATCH (n:% | A | % | %)';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(removeInnerAnys(firstSymbolLabels)).toEqual({
      condition: 'any',
      children: [],
    });
  });

  test('Should handle ANY inside nested ORs', () => {
    const query = 'MATCH (n:A | (% | y))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(removeInnerAnys(firstSymbolLabels)).toEqual({
      condition: 'any',
      children: [],
    });
  });

  test('Should handle ANY inside nested ANDs', () => {
    const query = 'MATCH (n:A & (% & B))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(removeInnerAnys(firstSymbolLabels)).toEqual({
      condition: 'and',
      children: [{ value: 'A' }, { value: 'B' }],
    });
  });

  test('Should remove inner ANYs inside deeper AND', () => {
    const query = 'MATCH (n:A | % & B))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(removeInnerAnys(firstSymbolLabels)).toEqual({
      condition: 'and',
      children: [
        {
          condition: 'or',
          children: [
            { value: 'A' },
            { condition: 'and', children: [{ value: 'B' }] },
          ],
        },
      ],
    });
  });

  test('CNF on ANYs inside deeper AND should remove single-label AND', () => {
    const query = 'MATCH (n:A | % & B))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(toNormalForm(firstSymbolLabels, 'cnf')).toEqual({
      condition: 'and',
      children: [
        { condition: 'or', children: [{ value: 'A' }, { value: 'B' }] },
      ],
    });
  });

  test('Should handle single NOT(ANY)', () => {
    const query = 'MATCH (n:!%)';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(removeInnerAnys(firstSymbolLabels)).toEqual({
      condition: 'not',
      children: [{ condition: 'any', children: [] }],
    });
  });

  test('Should handle AND(NOT(ANY), ...)', () => {
    const query = 'MATCH (n:!% & A & B)';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(removeInnerAnys(firstSymbolLabels)).toEqual({
      condition: 'not',
      children: [{ condition: 'any', children: [] }],
    });
  });

  test('Should handle OR(NOT(ANY), ...)', () => {
    const query = 'MATCH (n:!% | A | B)';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(removeInnerAnys(firstSymbolLabels)).toEqual({
      condition: 'and',
      children: [
        { condition: 'or', children: [{ value: 'A' }, { value: 'B' }] },
      ],
    });
  });

  test('Should handle NOT(ANY) in joint AND/OR)', () => {
    const query = 'MATCH (n: A & (!% | B | C))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(removeInnerAnys(firstSymbolLabels)).toEqual({
      condition: 'and',
      children: [
        { value: 'A' },
        { condition: 'or', children: [{ value: 'B' }, { value: 'C' }] },
      ],
    });
  });

  test('Converting DNF to DNF should remain DNF', () => {
    const query = 'MATCH (n:A | B)';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(toNormalForm(firstSymbolLabels, 'dnf')).toEqual({
      condition: 'or',
      children: [{ value: 'A' }, { value: 'B' }],
    });
  });

  test('Converting CNF to DNF should work', () => {
    const query = 'MATCH (n:A & B)';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(toNormalForm(firstSymbolLabels, 'dnf')).toEqual({
      condition: 'or',
      children: [
        { condition: 'and', children: [{ value: 'A' }, { value: 'B' }] },
      ],
    });
  });

  test('Converting more complex CNF to DNF should work', () => {
    const query = 'MATCH (n:A & (B | C))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(toNormalForm(firstSymbolLabels, 'dnf')).toEqual({
      condition: 'or',
      children: [
        { condition: 'and', children: [{ value: 'A' }, { value: 'B' }] },
        { condition: 'and', children: [{ value: 'A' }, { value: 'C' }] },
      ],
    });
  });

  test('Simplifying complex DNF should work in DNF conversion', () => {
    const query = 'MATCH (n:(A & B)|(B & C)|(B & C & D))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(toNormalForm(firstSymbolLabels, 'dnf')).toEqual({
      condition: 'or',
      children: [
        { condition: 'and', children: [{ value: 'A' }, { value: 'B' }] },
        { condition: 'and', children: [{ value: 'B' }, { value: 'C' }] },
      ],
    });
  });

  test('Can convert big CNF to DNF', () => {
    const query = 'MATCH (n:(A | B) & (B | C) & (B | C | D))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(toNormalForm(firstSymbolLabels, 'dnf')).toEqual({
      condition: 'or',
      children: [
        { condition: 'and', children: [{ value: 'A' }, { value: 'C' }] },
        { value: 'B' },
      ],
    });
  });

  test('Can convert deep tree to DNF, v1', () => {
    const query = 'MATCH (n:(A & (B | (C & D))))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(toNormalForm(firstSymbolLabels, 'dnf')).toEqual({
      condition: 'or',
      children: [
        { condition: 'and', children: [{ value: 'A' }, { value: 'B' }] },
        {
          condition: 'and',
          children: [{ value: 'A' }, { value: 'C' }, { value: 'D' }],
        },
      ],
    });
  });

  test('Can convert deep tree to DNF, v2', () => {
    const query = 'MATCH (n:(A | B | C) & (D | (E & (F | G | H)))))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(toNormalForm(firstSymbolLabels, 'dnf')).toEqual({
      children: [
        {
          children: [
            {
              value: 'A',
            },
            {
              value: 'D',
            },
          ],
          condition: 'and',
        },
        {
          children: [
            {
              value: 'A',
            },
            {
              value: 'E',
            },
            {
              value: 'F',
            },
          ],
          condition: 'and',
        },
        {
          children: [
            {
              value: 'A',
            },
            {
              value: 'E',
            },
            {
              value: 'G',
            },
          ],
          condition: 'and',
        },
        {
          children: [
            {
              value: 'A',
            },
            {
              value: 'E',
            },
            {
              value: 'H',
            },
          ],
          condition: 'and',
        },
        {
          children: [
            {
              value: 'B',
            },
            {
              value: 'D',
            },
          ],
          condition: 'and',
        },
        {
          children: [
            {
              value: 'B',
            },
            {
              value: 'E',
            },
            {
              value: 'F',
            },
          ],
          condition: 'and',
        },
        {
          children: [
            {
              value: 'B',
            },
            {
              value: 'E',
            },
            {
              value: 'G',
            },
          ],
          condition: 'and',
        },
        {
          children: [
            {
              value: 'B',
            },
            {
              value: 'E',
            },
            {
              value: 'H',
            },
          ],
          condition: 'and',
        },
        {
          children: [
            {
              value: 'C',
            },
            {
              value: 'D',
            },
          ],
          condition: 'and',
        },
        {
          children: [
            {
              value: 'C',
            },
            {
              value: 'E',
            },
            {
              value: 'F',
            },
          ],
          condition: 'and',
        },
        {
          children: [
            {
              value: 'C',
            },
            {
              value: 'E',
            },
            {
              value: 'G',
            },
          ],
          condition: 'and',
        },
        {
          children: [
            {
              value: 'C',
            },
            {
              value: 'E',
            },
            {
              value: 'H',
            },
          ],
          condition: 'and',
        },
      ],
      condition: 'or',
    });
  });

  //AND(A, OR(!B, C)) =
  //OR(AND(A, !B), AND(A, C)) =
  // OR(AND(A), AND(A,C)) = OR(A) //Extra simplification we can do since !B = A | C | D | ... so AND(!B, A) = A
  test('Can handle NOTs in DNF conversion, v1', () => {
    const query = 'MATCH (n:(A & (!B | C)))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(toNormalForm(firstSymbolLabels, 'dnf')).toEqual({
      condition: 'or',
      children: [
        { value: 'A' }, //, { condition: 'not', children: [ { value: 'B' }] }] },
        //{ condition: 'and', children: [{ value: 'A' }, { value: 'C' }] }
      ],
    });
  });

  test('Can handle NOTs in DNF conversion, v2', () => {
    const query = 'MATCH (n:(A & !B))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(toNormalForm(firstSymbolLabels, 'dnf')).toEqual({
      condition: 'or',
      children: [
        { value: 'A' },
        //{ condition: 'and', children: [{ value: 'A' }, { condition: 'not', children: [ { value: 'B' }] }] }
      ],
    });
  });

  //A | !B = !B
  test('Can simplify away using NOTs in DNF conversion, v1', () => {
    const query = 'MATCH (n:(A | !B))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(toNormalForm(firstSymbolLabels, 'dnf')).toEqual({
      condition: 'or',
      children: [
        { value: 'A' },
        { condition: 'not', children: [{ value: 'B' }] },
      ],
    });
  });

  test('Can simplify away using NOTs in DNF conversion, v2', () => {
    const query = 'MATCH (n:(A | !B | (C | !D)))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(toNormalForm(firstSymbolLabels, 'dnf')).toEqual({
      condition: 'or',
      children: [
        { value: 'A' },
        { condition: 'not', children: [{ value: 'B' }] },
        { value: 'C' },
        { condition: 'not', children: [{ value: 'D' }] },
      ],
    });
  }); //!B | (!A & !C)

  test('DNF conversion can handle contradictions', () => {
    const query = 'MATCH (n:(A & !A))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(toNormalForm(firstSymbolLabels, 'dnf')).toEqual({
      condition: 'or',
      children: [],
    });
  });

  test('DNF conversion can handle tautologies', () => {
    const query = 'MATCH (n:(A | !A))';
    const parsing = lintCypherQuery(query, {});
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    expect(toNormalForm(firstSymbolLabels, 'dnf')).toEqual({
      condition: 'or',
      children: [
        { value: 'A' },
        { condition: 'not', children: [{ value: 'A' }] },
      ],
    });
  });
});
