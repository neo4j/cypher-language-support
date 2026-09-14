import { Hover } from 'vscode-languageserver-types';
import { CypherLanguageService } from '../../cypherLanguageService.js';
import { testData } from '../testData.js';

const dbSchema = testData.mockSchema;
const languageService = new CypherLanguageService();

const awaitIndexHoverInfo: Hover = {
  contents: {
    kind: 'markdown',
    value: `\`\`\`cypher
db.awaitIndex(indexName :: STRING, timeOutSeconds = 300 :: INTEGER)
\`\`\`
Wait for an index to come online (for example: CALL db.awaitIndex("MyIndex", 300)).

**Parameters**
- \`indexName\` - The name of the awaited index.
- \`timeOutSeconds\` - The maximum time to wait in seconds.
`,
  },
};

const labelsHoverInfo: Hover = {
  contents: {
    kind: 'markdown',
    value: `\`\`\`cypher
db.labels() :: (label :: STRING)
\`\`\`
List all labels attached to nodes within a database according to the user's access rights. The procedure returns empty results if the user is not authorized to view those labels.


**Returns**
- \`label\` - A label within the database.`,
  },
};

describe('Procedures hover', () => {
  test('provides hover info for procedures', () => {
    const query = 'CALL db.labels()';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('db.labels') + 1,
      dbSchema,
    });
    expect(hoverInfo).toEqual(labelsHoverInfo);
  });

  test('provides hover info for procedures with arguments', () => {
    const query = 'CALL db.awaitIndex("MyIndex", 300)';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('db.awaitIndex') + 1,
      dbSchema,
    });
    expect(hoverInfo).toEqual(awaitIndexHoverInfo);
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

    expect(innerHoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`\`\`cypher
toString(input :: ANY) :: STRING
\`\`\`
Converts an \`INTEGER\`, \`FLOAT\`, \`BOOLEAN\`, \`POINT\` or temporal type (i.e. \`DATE\`, \`ZONED TIME\`, \`LOCAL TIME\`, \`ZONED DATETIME\`, \`LOCAL DATETIME\` or \`DURATION\`) value to a \`STRING\`.

**Parameters**
- \`input\` - A value to be converted into a string.

**Returns:** \`STRING\``,
      },
    });
  });

  test('marks deprecated procedures as deprecated', () => {
    const query = 'CYPHER 5 CALL db.create.setVectorProperty(n, "prop", [1.0])';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('db.create.setVectorProperty') + 1,
      dbSchema,
    });

    expect(hoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`\`\`cypher
db.create.setVectorProperty(node :: NODE, key :: STRING, vector :: ANY) :: (node :: NODE)
\`\`\`
(_deprecated_) Set a vector property on a given node in a more space efficient representation than Cypher's SET.

**Parameters**
- \`node\` - The node on which the new property will be stored.
- \`key\` - The name of the new property.
- \`vector\` - The object containing the embedding.

**Returns**
- \`node\` - The node on which the vector property was set.`,
      },
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
