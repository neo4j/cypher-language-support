import { validateSemantics } from '../../syntaxValidation/syntaxValidation';

describe('Deprecations Cypher 5 and Cypher 25', () => {
  test('Should error on BRIEF OUTPUT', () => {
    const query = 'CYPHER 5 SHOW INDEXES BRIEF OUTPUT';

    expect(validateSemantics(query, {})).toEqual([
      {
        message: `\`SHOW INDEXES\` no longer allows the \`BRIEF\` and \`VERBOSE\` keywords,
please omit \`BRIEF\` and use \`YIELD *\` instead of \`VERBOSE\`. (line 1, column 14 (offset: 13))`,
        offsets: {
          end: 34,
          start: 22,
        },
        range: {
          end: {
            character: 34,
            line: 0,
          },
          start: {
            character: 22,
            line: 0,
          },
        },
        severity: 1,
      },
    ]);
  });
});
