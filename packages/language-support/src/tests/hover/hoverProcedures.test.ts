import { CypherLanguageService } from '../../cypherLanguageService.js';
import { testData } from '../testData.js';

const dbSchema = testData.mockSchema;

describe('Procedures hover', () => {
  test('provides hover info for procedures', () => {
    const query = 'CALL db.labels()';

    const hoverInfo = new CypherLanguageService().hoverInfo(query, {
      caretPosition: query.indexOf('db.labels') + 1,
      dbSchema,
    });

    expect(hoverInfo).toStrictEqual({
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
    });
  });
});
