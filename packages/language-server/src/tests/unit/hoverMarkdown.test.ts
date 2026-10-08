import {
  CypherLanguageService,
  testData,
} from '@neo4j-cypher/language-support';
import { describe, expect, test } from 'vitest';
import { hoverInfoToMarkdown } from '../../hoverMarkdown.js';

const dbSchema = testData.mockSchema;
const languageService = new CypherLanguageService();

function hoverMarkdown(query: string, hovered: string): string {
  const hoverInfo = languageService.hoverInfo(query, {
    caretPosition: query.indexOf(hovered) + 1,
    dbSchema,
  });
  return hoverInfoToMarkdown(hoverInfo);
}

function variableHoverMarkdown(query: string, caretPosition: number): string {
  const { symbolTables } = languageService.lint(query, dbSchema);
  languageService.setSymbolsInfo({ query, symbolTables });
  return hoverInfoToMarkdown(
    languageService.hoverInfo(query, { caretPosition, dbSchema }),
  );
}

describe('Function hover markdown', () => {
  test('writes the signature, description, parameters and return type', () => {
    expect(hoverMarkdown('CYPHER 25 RETURN abs(1,2)', 'abs')).toBe(
      `\`\`\`cypher
abs(input :: INTEGER | FLOAT) :: INTEGER | FLOAT
\`\`\`
Returns the absolute value of an \`INTEGER\` or \`FLOAT\`.

**Parameters**
- \`input\` - A numeric value from which the absolute number will be returned.

**Returns:** \`INTEGER | FLOAT\``,
    );
  });

  test('marks deprecated functions as deprecated', () => {
    expect(
      hoverMarkdown('CYPHER 5 RETURN apoc.create.uuid()', 'apoc.create.uuid'),
    ).toBe(
      `\`\`\`cypher
apoc.create.uuid() :: STRING
\`\`\`
(_deprecated_) Returns a UUID.


**Returns:** \`STRING\``,
    );
  });

  test('escapes the asterisk a description writes as prose, so its not interpreted as emphasis in markdown', () => {
    expect(
      hoverMarkdown(
        'RETURN apoc.math.sigmoidPrime(1.0)',
        'apoc.math.sigmoidPrime',
      ),
    ).toBe(
      `\`\`\`cypher
apoc.math.sigmoidPrime(value :: FLOAT) :: FLOAT
\`\`\`
Returns the sigmoid prime [ sigmoid(val) \\* (1 - sigmoid(val)) ] of the given value.

**Parameters**
- \`value\` - An angle in radians.

**Returns:** \`FLOAT\``,
    );
  });
});

describe('Procedure hover markdown', () => {
  test('writes the return values of a procedure without parameters', () => {
    expect(hoverMarkdown('CALL db.labels()', 'db.labels')).toBe(
      `\`\`\`cypher
db.labels() :: (label :: STRING)
\`\`\`
List all labels attached to nodes within a database according to the user's access rights. The procedure returns empty results if the user is not authorized to view those labels.


**Returns**
- \`label\` - A label within the database.`,
    );
  });

  test('writes the parameters of a procedure without return values', () => {
    expect(
      hoverMarkdown('CALL db.awaitIndex("MyIndex", 300)', 'db.awaitIndex'),
    ).toBe(
      `\`\`\`cypher
db.awaitIndex(indexName :: STRING, timeOutSeconds = 300 :: INTEGER)
\`\`\`
Wait for an index to come online (for example: CALL db.awaitIndex("MyIndex", 300)).

**Parameters**
- \`indexName\` - The name of the awaited index.
- \`timeOutSeconds\` - The maximum time to wait in seconds.
`,
    );
  });

  test('marks deprecated procedures as deprecated', () => {
    expect(
      hoverMarkdown(
        'CYPHER 5 CALL db.create.setVectorProperty(n, "prop", [1.0])',
        'db.create.setVectorProperty',
      ),
    ).toBe(
      `\`\`\`cypher
db.create.setVectorProperty(node :: NODE, key :: STRING, vector :: ANY) :: (node :: NODE)
\`\`\`
(_deprecated_) Set a vector property on a given node in a more space efficient representation than Cypher's SET.

**Parameters**
- \`node\` - The node on which the new property will be stored.
- \`key\` - The name of the new property.
- \`vector\` - The object containing the embedding.

**Returns**
- \`node\` - The node on which the vector property was set.`,
    );
  });

  test('escapes the wildcards a description writes, but not the ones in its code spans', () => {
    expect(hoverMarkdown('CALL dbms.queryJmx("*:*")', 'dbms.queryJmx')).toBe(
      `\`\`\`cypher
dbms.queryJmx(query :: STRING) :: (name :: STRING, description :: STRING, attributes :: MAP)
\`\`\`
Query JMX management data by domain and name. For instance, use \`*:*\` to find all JMX beans.

**Parameters**
- \`query\` - A query for MBeans on this MBeanServer (e.g. '\\*:\\*,name=\\*neo4j\\*' for all metrics in neo4j database).

**Returns**
- \`name\` - The name of the metric.
- \`description\` - The description of the metric.
- \`attributes\` - A collection with the attributes (values) of that metric.`,
    );
  });

  test('keeps the bullet list and the italics of a description', () => {
    expect(
      hoverMarkdown(
        'CALL db.index.fulltext.queryNodes("index", "query")',
        'db.index.fulltext.queryNodes',
      ),
    ).toBe(
      `\`\`\`cypher
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
    );
  });

  /* Some parameters are described with a map type rather than with prose.
     Markdown would collapse the layout of those into one run-on line. */
  test('writes a parameter that carries its own layout as a code block', () => {
    expect(
      hoverMarkdown(
        'CALL apoc.export.csv.all("file.csv", {})',
        'apoc.export.csv.all',
      ),
    ).toContain(
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
});

describe('Variable hover markdown', () => {
  test('writes the type of a variable without labels', () => {
    expect(variableHoverMarkdown('MATCH (n) RETURN n', 'MATCH ('.length)).toBe(
      `\`
n: Node
\``,
    );
  });

  test('writes the label expression of a labeled variable', () => {
    expect(
      variableHoverMarkdown(
        'MATCH (n:Person|Pet) WHERE n:Neighbour RETURN ',
        'MATCH (n:Person|Pet) WHERE '.length,
      ),
    ).toBe(
      `\`
n: Node
\`

\`\`\`cypher
((Person | Pet) & Neighbour)
\`\`\``,
    );
  });
});
