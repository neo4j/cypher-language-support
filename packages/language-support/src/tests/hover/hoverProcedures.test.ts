import { Hover, MarkupContent } from 'vscode-languageserver-types';
import { CypherLanguageService } from '../../cypherLanguageService.js';
import { testData } from '../testData.js';

const dbSchema = testData.mockSchema;
const languageService = new CypherLanguageService();

const awaitIndexHoverInfo: Hover = {
  contents: {
    kind: 'markdown',
    value: `\`\`\`cypher procedure
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
    value: `\`\`\`cypher procedure
db.labels() :: (label :: STRING)
\`\`\`
List all labels attached to nodes within a database according to the user's access rights. The procedure returns empty results if the user is not authorized to view those labels.


**Returns**
- \`label\` - A label within the database.`,
  },
};

describe('Procedure hover', () => {
  test('provides hover info for procedures', () => {
    const query = 'CALL db.labels()';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('db.labels') + 1,
      dbSchema,
    });
    expect(hoverInfo).toEqual(labelsHoverInfo);
  });

  test('provides hover info on the first and last character of the procedure name', () => {
    const query = 'CALL db.labels()';
    const name = 'db.labels';

    [query.indexOf(name), query.indexOf(name) + name.length - 1].forEach(
      (caretPosition) => {
        expect(
          languageService.hoverInfo(query, { caretPosition, dbSchema }),
        ).toEqual(labelsHoverInfo);
      },
    );
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
        value: `\`\`\`cypher function
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
        value: `\`\`\`cypher procedure
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

  /* A description writes a wildcard both ways: as prose, where markdown would
     read it as emphasis and eat it, and inside a code span, where an escape
     would be shown rather than undone */
  test('escapes the wildcards a description writes, but not the ones in its code spans', () => {
    const query = 'CALL dbms.queryJmx("*:*")';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('dbms.queryJmx') + 1,
      dbSchema,
    });

    expect(hoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`\`\`cypher procedure
dbms.queryJmx(query :: STRING) :: (name :: STRING, description :: STRING, attributes :: MAP)
\`\`\`
Query JMX management data by domain and name. For instance, use \`*:*\` to find all JMX beans.

**Parameters**
- \`query\` - A query for MBeans on this MBeanServer (e.g. '\\*:\\*,name=\\*neo4j\\*' for all metrics in neo4j database).

**Returns**
- \`name\` - The name of the metric.
- \`description\` - The description of the metric.
- \`attributes\` - A collection with the attributes (values) of that metric.`,
      },
    });
  });

  /* The markup a description does write - a bullet list, italics, code spans -
     is left as it is, so that it still renders as markup */
  test('keeps the bullet list and the italics of a description', () => {
    const query = 'CALL db.index.fulltext.queryNodes("index", "query")';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('db.index.fulltext.queryNodes') + 1,
      dbSchema,
    });

    expect(hoverInfo).toEqual({
      contents: {
        kind: 'markdown',
        value: `\`\`\`cypher procedure
db.index.fulltext.queryNodes(indexName :: STRING, queryString :: STRING, options = {} :: MAP) :: (node :: NODE, score :: FLOAT)
\`\`\`
Query the given full-text index. Returns the matching nodes and their Lucene query score, ordered by score.
Valid _key: value_ pairs for the \`options\` map are:

* 'skip' -- to skip the top N results.
* 'limit' -- to limit the number of results returned.
* 'analyzer' -- to use the specified analyzer as a search analyzer for this query.

The \`options\` map and any of the keys are optional.
An example of the \`options\` map: \`{skip: 30, limit: 10, analyzer: 'whitespace'}\`


**Parameters**
- \`indexName\` - The name of the full-text index.
- \`queryString\` - The string to find approximate matches for.
- \`options\` - {skip :: INTEGER, limit :: INTEGER, analyzer :: STRING}

**Returns**
- \`node\` - A node which contains a property similar to the query string.
- \`score\` - The score measuring how similar the node property is to the query string.`,
      },
    });
  });

  /* Some parameters are described with a map type rather than with prose.
     Markdown would collapse the layout of those into one run-on line. */
  test('writes a parameter that carries its own layout as a code block', () => {
    const query = 'CALL apoc.export.csv.all("file.csv", {})';

    const hoverInfo = languageService.hoverInfo(query, {
      caretPosition: query.indexOf('apoc.export.csv.all') + 1,
      dbSchema,
    });

    expect((hoverInfo.contents as MarkupContent).value).toContain(
      `**Parameters**
- \`file\` - The name of the file to which the data will be exported.
- \`config\` -
\`\`\`text
{
        stream = false :: BOOLEAN,
        batchSize = 20000 :: INTEGER,
        bulkImport = false :: BOOLEAN,
        timeoutSeconds = 100 :: INTEGER,
        compression = 'None' :: STRING,
        charset = 'UTF_8' :: STRING,
        quotes = 'always' :: ['always', 'none', 'ifNeeded'],
        differentiateNulls = false :: BOOLEAN,
        sampling = false :: BOOLEAN,
        samplingConfig :: MAP
}
\`\`\``,
    );
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
