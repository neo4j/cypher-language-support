import { CypherLanguageService } from '../../cypherLanguageService.js';
import { testData } from '../testData.js';

const dbSchema = testData.mockSchema;
const languageService = new CypherLanguageService();

const awaitIndexHoverInfo = {
  signature:
    'db.awaitIndex(indexName :: STRING, timeOutSeconds = 300 :: INTEGER)',
  description:
    'Wait for an index to come online (for example: CALL db.awaitIndex("MyIndex", 300)).',
  returnDescription: [],
  isDeprecated: false,
  params: [
    {
      name: 'indexName',
      description: 'The name of the awaited index.',
      isDeprecated: false,
      type: 'STRING',
    },
    {
      name: 'timeOutSeconds',
      description: 'The maximum time to wait in seconds.',
      isDeprecated: false,
      type: 'INTEGER',
    },
  ],
};

const labelsHoverInfo = {
  signature: 'db.labels() :: (label :: STRING)',
  description:
    "List all labels attached to nodes within a database according to the user's access rights. The procedure returns empty results if the user is not authorized to view those labels.",
  returnDescription: [
    {
      name: 'label',
      description: 'A label within the database.',
      isDeprecated: false,
      type: 'STRING',
    },
  ],
  isDeprecated: false,
  params: [],
};

describe('Procedures hover', () => {
  test('provides hover info for procedures', () => {
    const query = 'CALL db.labels()';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('db.labels') + 1,
      dbSchema,
    });

    expect(hoverInfo).toStrictEqual(labelsHoverInfo);
  });

  test('provides hover info for procedures with arguments', () => {
    const query = 'CALL db.awaitIndex("MyIndex", 300)';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('db.awaitIndex') + 1,
      dbSchema,
    });

    expect(hoverInfo).toStrictEqual(awaitIndexHoverInfo);
  });

  test('provides hover info for incomplete procedure parameters', () => {
    const query = 'CALL db.awaitIndex(';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('db.awaitIndex') + 1,
      dbSchema,
    });

    expect(hoverInfo).toStrictEqual(awaitIndexHoverInfo);
  });

  test('provides hover info for procedures with a YIELD clause', () => {
    const query = 'CALL db.labels() YIELD label RETURN label';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('db.labels') + 1,
      dbSchema,
    });

    expect(hoverInfo).toStrictEqual(labelsHoverInfo);
  });

  test('provides hover info for procedures wrapping functions', () => {
    const query = 'CALL db.awaitIndex(toString(1), 300)';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('db.awaitIndex') + 1,
      dbSchema,
    });

    const innerHoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('toString') + 1,
      dbSchema,
    });

    expect(hoverInfo).toStrictEqual(awaitIndexHoverInfo);

    expect(innerHoverInfo).toStrictEqual({
      signature: 'toString(input :: ANY) :: STRING',
      description:
        'Converts an `INTEGER`, `FLOAT`, `BOOLEAN`, `POINT` or temporal type (i.e. `DATE`, `ZONED TIME`, `LOCAL TIME`, `ZONED DATETIME`, `LOCAL DATETIME` or `DURATION`) value to a `STRING`.',
      returnDescription: 'STRING',
      isDeprecated: false,
      params: [
        {
          name: 'input',
          description: 'A value to be converted into a string.',
          isDeprecated: false,
          type: 'ANY',
        },
      ],
    });
  });

  test('marks deprecated procedures as deprecated', () => {
    const query = 'CYPHER 5 CALL db.create.setVectorProperty(n, "prop", [1.0])';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('db.create.setVectorProperty') + 1,
      dbSchema,
    });

    expect(hoverInfo).toStrictEqual({
      signature:
        'db.create.setVectorProperty(node :: NODE, key :: STRING, vector :: ANY) :: (node :: NODE)',
      description:
        "Set a vector property on a given node in a more space efficient representation than Cypher's SET.",
      returnDescription: [
        {
          name: 'node',
          description: 'The node on which the vector property was set.',
          isDeprecated: false,
          type: 'NODE',
        },
      ],
      isDeprecated: true,
      params: [
        {
          name: 'node',
          description: 'The node on which the new property will be stored.',
          isDeprecated: false,
          type: 'NODE',
        },
        {
          name: 'key',
          description: 'The name of the new property.',
          isDeprecated: false,
          type: 'STRING',
        },
        {
          name: 'vector',
          description: 'The object containing the embedding.',
          isDeprecated: false,
          type: 'ANY',
        },
      ],
    });
  });

  test('provides no hover info for a procedure missing in the Cypher version', () => {
    // db.create.setVectorProperty only exists in Cypher 5
    const query =
      'CYPHER 25 CALL db.create.setVectorProperty(n, "prop", [1.0])';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('db.create.setVectorProperty') + 1,
      dbSchema,
    });

    expect(hoverInfo).toBeUndefined();
  });

  test('provides no hover info for unknown procedures', () => {
    const query = 'CALL db.notARealProcedure()';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('db.notARealProcedure') + 1,
      dbSchema,
    });

    expect(hoverInfo).toBeUndefined();
  });
});
