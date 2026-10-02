import { testData } from '@neo4j-cypher/language-support';
import { expect } from 'vitest';
import { validateParamInput } from '../../helpers';

describe('Parameter validation spec', () => {
  const dbSchema = {
    functions: {
      'CYPHER 5': {
        datetime: {
          ...testData.emptyFunction,
          name: 'datetime',
        },
        deprecatedFunction: {
          ...testData.emptyFunction,
          isDeprecated: true,
          name: 'deprecatedFunction',
        },
      },
    },
  };

  test('Parameter validation succeeds for correct inputs', () => {
    expect(validateParamInput('datetime()', dbSchema)).toBe(undefined);
    expect(validateParamInput('500', dbSchema)).toBe(undefined);
  });

  test('Parameter validation fails for incorrect inputs', () => {
    expect(validateParamInput('datetime(', dbSchema)).toBe(
      "Value cannot be evaluated: Variable `datetime` not defined. Invalid input '(': expected an expression, ',', 'AS', 'ORDER BY', 'CALL', 'CREATE', 'LOAD CSV', 'DELETE', 'DETACH', 'FINISH', 'FOREACH', 'INSERT', 'LIMIT', 'MATCH', 'MERGE', 'NODETACH', 'OFFSET', 'OPTIONAL', 'REMOVE', 'RETURN', 'SET', 'SKIP', 'UNION', 'UNWIND', 'USE', 'WITH' or <EOF>",
    );
    expect(validateParamInput('500q', dbSchema)).toBe(
      'Value cannot be evaluated: invalid literal number',
    );
    expect(validateParamInput('1 + ', dbSchema)).toBe(
      `Value cannot be evaluated: Invalid input '': expected an expression`,
    );
  });

  test('Parameter validation succeeds on warnings', () => {
    expect(validateParamInput('deprecatedFunction()', dbSchema)).toBe(
      undefined,
    );
  });
});
