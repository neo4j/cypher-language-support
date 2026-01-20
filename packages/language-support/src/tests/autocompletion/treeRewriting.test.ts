import { CompletionItemKind } from 'vscode-languageserver-types';
import { testCompletions } from './completionAssertionHelpers';
import { LabelOrCondition } from '../../types';
import { rewriteLabelTree } from '../../autocompletion/schemaBasedCompletions';
import { lintCypherQuery } from '../../syntaxValidation/syntaxValidation';


const initialTrees: {
  validSimplification: LabelOrCondition, 
  repeatedValidSimplification: LabelOrCondition, 
  differentConditions: LabelOrCondition, 
  differentLeaves: LabelOrCondition
} = {
  validSimplification: {
    condition: "and", children: [
      {
        condition: "and", children: [{validFrom: 10, value: "A"}, {validFrom: 13, value: "B"}]
      },
      {
        condition: "and", children: [{validFrom: 19, value: "A"}, {validFrom: 15, value: "B"}]
      }
   ]
  },
  repeatedValidSimplification: {
    condition: "and", children: [
      {
        condition: "and", children: [{validFrom: 10, value: "A"}, {validFrom: 13, value: "B"}]
      },
      {
        condition: "and", children: [{validFrom: 19, value: "A"}, {validFrom: 15, value: "B"}]
      },
      {
        condition: "and", children: [{validFrom: 24, value: "A"}, {validFrom: 28, value: "B"}]
      },
      {
        condition: "and", children: [{validFrom: 31, value: "A"}, {validFrom: 36, value: "B"}]
      }
   ]
  },
  differentConditions: {
    condition: "and", children: [
      {
        condition: "and", children: [{validFrom: 10, value: "A"}, {validFrom: 13, value: "B"}]
      },
      {
        condition: "or", children: [{validFrom: 19, value: "A"}, {validFrom: 15, value: "B"}]
      }
   ]
  },
  differentLeaves: {
    condition: "and", children: [
      {
        condition: "and", children: [{validFrom: 10, value: "A"}, {validFrom: 13, value: "C"}]
      },
      {
        condition: "and", children: [{validFrom: 19, value: "A"}, {validFrom: 15, value: "B"}]
      }
   ]
  }
}

const exampleQueries = {
  twoDifferentLabels: "MATCH (n:Person)-[]->(n:Driver)",
  repeatedLabel: "MATCH (n:Person|Driver)-[]->(n:Person|Driver)",
  mixOfDifferentAndRepeated: "MATCH (n:Person|Driver)-[]->(n:Person|Friend)",
  simpleNot: "MATCH (n:!Person)-[]->(n:!Person)",
  deeperNot: "MATCH (n:!(Person|Driver))-[]-(n:!(Person|Driver))",
  deeperRelNot: "MATCH ()-[r:!(KNOWS&IS)]-()-[r:!(KNOWS&IS)]-()"
}



describe('rewrite tree', () => {
  test('Rewriting tree with identical condition repeated later should remove said condition', () => {
    const result = rewriteLabelTree(initialTrees.validSimplification);

    expect(result).toEqual(
      {
        "children": [
          {
            "children": [
              {
                "validFrom": 10,
                "value": "A",
              },
              {
                "validFrom": 13,
                "value": "B",
              },
            ],
            "condition": "and",
          },
        ],
        "condition": "and",
      }
    );
  });

  test('Rewriting tree with multiple identical conditions should remove all but the first definition', () => {
    const result = rewriteLabelTree(initialTrees.repeatedValidSimplification);

    expect(result).toEqual(
      {
        "children": [
          {
            "children": [
              {
                "validFrom": 10,
                "value": "A",
              },
              {
                "validFrom": 13,
                "value": "B",
              },
            ],
            "condition": "and",
          },
        ],
        "condition": "and",
      }
    );
  });

  test('Rewriting tree with identical condition repeated later should remove said condition', () => {
    const result = rewriteLabelTree(initialTrees.differentConditions);

    expect(result).toEqual(initialTrees.differentConditions);
  });

  test('Rewriting tree with identical condition repeated later should remove said condition', () => {
    const result = rewriteLabelTree(initialTrees.differentLeaves);

    expect(result).toEqual(initialTrees.differentLeaves);
  });

  test('Rewriting tree from query without duplicates does not hange it', () => {
    const parsing = lintCypherQuery(exampleQueries.twoDifferentLabels, {}, false)
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const result = rewriteLabelTree(firstSymbolLabels);
    expect(result).toEqual(firstSymbolLabels);
  })

  test('Rewriting tree from query with duplicate label definitions only keeps the initial definition', () => {
    const parsing = lintCypherQuery(exampleQueries.repeatedLabel, {}, false)
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const result = rewriteLabelTree(firstSymbolLabels);
    expect(result).not.toEqual(firstSymbolLabels);
    expect(result).toEqual(
      {
        "children": [
          {
            "children": [
              {
                "validFrom": 15,
                "value": "Person",
              },
              {
                "validFrom": 22,
                "value": "Driver",
              },
            ],
            "condition": "or",
          },
        ],
        "condition": "and",
      }
    );
  });

  test('Rewriting tree with multiple OR-conditions on the same level should merge these', () => {
    const parsing = lintCypherQuery(exampleQueries.mixOfDifferentAndRepeated, {}, false)
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const result = rewriteLabelTree(firstSymbolLabels);
    expect(result).toEqual(
      {
        "children": [
          {
            "children": [
              {
                "validFrom": 15,
                "value": "Person",
              },
              {
                "validFrom": 22,
                "value": "Driver",
              },
            ],
            "condition": "or",
          },
          {
            "children": [
              {
                "validFrom": 37,
                "value": "Person",
              },
              {
                "validFrom": 44,
                "value": "Friend",
              },
            ],
            "condition": "or",
          },
        ],
        "condition": "and",
      }
    )
  });

  test('Rewriting tree with simple "NOT" should de-duplicate it', () => {
    const parsing = lintCypherQuery(exampleQueries.simpleNot, {}, false)
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const result = rewriteLabelTree(firstSymbolLabels);
    expect(result).toEqual(
      {
        "children": [
          {
            "children": [
              {
                "validFrom": 16,
                "value": "Person",
              },
            ],
            "condition": "not",
          },
        ],
        "condition": "and",
      }
    )
  });

  test('Rewriting tree with "NOT(OR(...))" should de-duplicate it, and transform it with de Morgans laws', () => {
    const parsing = lintCypherQuery(exampleQueries.deeperNot, {}, false)
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const result = rewriteLabelTree(firstSymbolLabels);
    expect(result).toEqual(
      {
        "children": [
          {
            "children": [
              {
                "validFrom": 17,
                "value": "Person",
              },
            ],
            "condition": "not",
          },
          {
            "children": [
              {
                "validFrom": 24,
                "value": "Driver",
              },
            ],
            "condition": "not",
          },
        ],
        "condition": "and",
      }
    )
  });

  test('Rewriting tree with "NOT(AND(...))" in a rel should de-duplicate it, and transform it with de Morgans laws', () => {
    const parsing = lintCypherQuery(exampleQueries.deeperRelNot, {}, false);
    const firstSymbolLabels = parsing.symbolTables[0][0].labels;
    const result = rewriteLabelTree(firstSymbolLabels);
    expect(result).toEqual(
      {
        "children": [
          {
            "children": [
              {
                "children": [
                  {
                    "validFrom": 19,
                    "value": "KNOWS",
                  },
                ],
                "condition": "not",
              },
              {
                "children": [
                  {
                    "validFrom": 22,
                    "value": "IS",
                  },
                ],
                "condition": "not",
              },
            ],
            "condition": "or",
          },
        ],
        "condition": "and",
      }
    )
  });
});
