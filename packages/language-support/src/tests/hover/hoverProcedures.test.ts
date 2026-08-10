import { DbSchema } from '../../dbSchema.js';
import { CypherLanguageService } from '../../cypherLanguageService.js';

describe('Procedures hover', () => {
  test('provides hover info for procedures', () => {
    const query = "CYPHER 25 CALL custom.other() CALL custom.proc('x')";
    const dbSchema: DbSchema = {
      procedures: {
        'CYPHER 25': {
          'custom.proc': {
            name: 'custom.proc',
            description: 'Runs a custom procedure.',
            mode: 'READ',
            worksOnSystem: false,
            argumentDescription: [
              {
                name: 'input',
                description: 'The input value.',
                isDeprecated: false,
                type: 'STRING',
              },
            ],
            returnDescription: [
              {
                name: 'result',
                description: 'The result value.',
                isDeprecated: false,
                type: 'STRING',
              },
            ],
            signature: 'custom.proc(input :: STRING) :: (result :: STRING)',
            admin: false,
            option: { deprecated: false },
          },
          'custom.other': {
            name: 'custom.other',
            description: 'Runs another procedure.',
            mode: 'READ',
            worksOnSystem: false,
            argumentDescription: [],
            returnDescription: [],
            signature: 'custom.other() :: ()',
            admin: false,
            option: { deprecated: false },
          },
        },
      },
    };

    const hoverInfo = new CypherLanguageService().hoverInfo(query, {
      caretPosition: query.indexOf('custom.proc') + 1,
      dbSchema,
    });

    expect(hoverInfo).toStrictEqual({
      signature: 'custom.proc(input :: STRING) :: (result :: STRING)',
      description: 'Runs a custom procedure.',
      returnDescription: [
        {
          name: 'result',
          description: 'The result value.',
          isDeprecated: false,
          type: 'STRING',
        },
      ],
      isDeprecated: false,
      params: [
        {
          name: 'input',
          description: 'The input value.',
          isDeprecated: false,
          type: 'STRING',
        },
      ],
    });
  });
});
