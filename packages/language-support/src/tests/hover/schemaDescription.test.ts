import {
  descriptionBullet,
  escapeSchemaMarkdown,
} from '../../hoverInformation/schemaDescription.js';

/* The descriptions quoted here are the real ones, from the procedures and
   functions named in the test titles */
describe('escapeSchemaMarkdown', () => {
  test('escapes the wildcards a description writes as prose', () => {
    // dbms.queryJmx's query parameter
    expect(
      escapeSchemaMarkdown(
        "A query for MBeans on this MBeanServer (e.g. '*:*,name=*neo4j*' for all metrics in neo4j database).",
      ),
    ).toBe(
      "A query for MBeans on this MBeanServer (e.g. '\\*:\\*,name=\\*neo4j\\*' for all metrics in neo4j database).",
    );

    // apoc.math.sigmoidPrime
    expect(
      escapeSchemaMarkdown(
        'Returns the sigmoid prime [ sigmoid(val) * (1 - sigmoid(val)) ] of the given value.',
      ),
    ).toBe(
      'Returns the sigmoid prime [ sigmoid(val) \\* (1 - sigmoid(val)) ] of the given value.',
    );

    // apoc.algo.aStar
    expect(escapeSchemaMarkdown('Runs the A* search algorithm.')).toBe(
      'Runs the A\\* search algorithm.',
    );
  });

  /* Neither renderer unescapes inside a code span, so a backslash there would
     be shown rather than swallowed */
  test('leaves the wildcards inside a code span alone', () => {
    // dbms.queryJmx itself
    const description =
      'Query JMX management data by domain and name. For instance, use `*:*` to find all JMX beans.';

    expect(escapeSchemaMarkdown(description)).toBe(description);

    // gds.graph.nodeProperties.stream's nodeLabels parameter
    const listed =
      "The node labels to aggregate over. Use `['*']` to indicate all.";

    expect(escapeSchemaMarkdown(listed)).toBe(listed);
  });

  test('keeps the bullet markers of a description that writes a list', () => {
    // dbms.cluster.switchDiscoveryServiceVersion
    const description = [
      'Possible values are:',
      '',
      '* `V1_ONLY` -- it runs only discovery service v1.',
      '* `V2_ONLY` -- it runs only discovery service v2.',
    ].join('\n');

    expect(escapeSchemaMarkdown(description)).toBe(description);
  });

  test('escapes an asterisk that only looks like a bullet marker', () => {
    // An indented bullet is not one in react-codemirror's renderer
    expect(escapeSchemaMarkdown('  * indented')).toBe('  \\* indented');
    // And neither is a bare asterisk without the space
    expect(escapeSchemaMarkdown('*emphasised*')).toBe('\\*emphasised\\*');
    // The marker is kept, the wildcard on the same line is not
    expect(escapeSchemaMarkdown("* 'skip' -- skips *:*")).toBe(
      "* 'skip' -- skips \\*:\\*",
    );
  });

  test('escapes the backslashes, so that the escaping can be undone', () => {
    expect(escapeSchemaMarkdown('a \\ b')).toBe('a \\\\ b');
    expect(escapeSchemaMarkdown('already \\* escaped')).toBe(
      'already \\\\\\* escaped',
    );
  });

  test('leaves the underscores of a description alone', () => {
    // apoc.json.path's pathOptions parameter, and db.index.fulltext.queryNodes
    const values =
      "JSON path options: ('ALWAYS_RETURN_LIST', 'DEFAULT_PATH_LEAF_TO_NULL').";
    const italics = 'Valid _key: value_ pairs for the `options` map are:';

    expect(escapeSchemaMarkdown(values)).toBe(values);
    expect(escapeSchemaMarkdown(italics)).toBe(italics);
  });

  /* apoc.node.relationships.exist's relTypes parameter has an opening backtick
     and no closing one. Both renderers show it as a backtick, and the prose
     after it stays prose. */
  test('leaves a backtick that is never closed alone', () => {
    expect(
      escapeSchemaMarkdown('syntax; `[<]TYPE[>]|.... with a * in it'),
    ).toBe('syntax; `[<]TYPE[>]|.... with a \\* in it');
  });

  test('pairs the backticks within a line, not across the description', () => {
    expect(escapeSchemaMarkdown('a ` b\nc * d')).toBe('a ` b\nc \\* d');
  });

  test('keeps the newlines a description brings, including a trailing one', () => {
    expect(escapeSchemaMarkdown('first\n\nsecond\n')).toBe('first\n\nsecond\n');
  });

  test('hands back a description that is missing', () => {
    expect(escapeSchemaMarkdown('')).toBe('');
    expect(escapeSchemaMarkdown(undefined)).toBeUndefined();
  });
});

describe('descriptionBullet', () => {
  test('writes a prose description inline', () => {
    expect(
      descriptionBullet('query', "A query for MBeans (e.g. '*:*')."),
    ).toEqual(["- `query` - A query for MBeans (e.g. '\\*:\\*')."]);
  });

  test('writes a description that is several lines of prose inline', () => {
    // The renderers join these lines into one paragraph, as markdown does
    expect(
      descriptionBullet('sort', 'Sorts the list.\nTo sort ascending.'),
    ).toEqual(['- `sort` - Sorts the list.\nTo sort ascending.']);
  });

  /* apoc.export.csv.all's config parameter, and the ones like it, are a map
     type rather than prose. Markdown would collapse the layout away. */
  test('writes a description that carries its own layout as a code block', () => {
    const description =
      '{\n    delimiter = "," :: STRING,\n    skipLines = 1 :: INTEGER\n}\n';

    expect(descriptionBullet('config', description)).toEqual([
      '- `config` -',
      '```text',
      '{\n    delimiter = "," :: STRING,\n    skipLines = 1 :: INTEGER\n}',
      '```',
    ]);
  });
});
