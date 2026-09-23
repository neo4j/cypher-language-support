import {
  descriptionBullet,
  escapeDescription,
} from '../../hoverInformation/descriptionToMarkdown.js';

/* The descriptions quoted here are the real ones, from the procedures and
   functions named in the test titles */
describe('escapeDescription', () => {
  test('escapes the wildcards a description writes as prose', () => {
    // dbms.queryJmx's query parameter
    expect(
      escapeDescription(
        "A query for MBeans on this MBeanServer (e.g. '*:*,name=*neo4j*' for all metrics in neo4j database).",
      ),
    ).toBe(
      "A query for MBeans on this MBeanServer (e.g. '\\*:\\*,name=\\*neo4j\\*' for all metrics in neo4j database).",
    );

    // apoc.math.sigmoidPrime
    expect(
      escapeDescription(
        'Returns the sigmoid prime [ sigmoid(val) * (1 - sigmoid(val)) ] of the given value.',
      ),
    ).toBe(
      'Returns the sigmoid prime [ sigmoid(val) \\* (1 - sigmoid(val)) ] of the given value.',
    );

    // apoc.algo.aStar
    expect(escapeDescription('Runs the A* search algorithm.')).toBe(
      'Runs the A\\* search algorithm.',
    );
  });

  /* Neither renderer unescapes inside a code span, so a backslash there would
     be shown rather than swallowed */
  test('leaves the wildcards inside a code span alone', () => {
    // dbms.queryJmx itself
    const description =
      'Query JMX management data by domain and name. For instance, use `*:*` to find all JMX beans.';

    expect(escapeDescription(description)).toBe(description);

    // gds.graph.nodeProperties.stream's nodeLabels parameter
    const listed =
      "The node labels to aggregate over. Use `['*']` to indicate all.";

    expect(escapeDescription(listed)).toBe(listed);
  });

  test('keeps the bullet markers of a description that writes a list', () => {
    // dbms.cluster.switchDiscoveryServiceVersion
    const description = [
      'Possible values are:',
      '',
      '* `V1_ONLY` -- it runs only discovery service v1.',
      '* `V2_ONLY` -- it runs only discovery service v2.',
    ].join('\n');

    expect(escapeDescription(description)).toBe(description);
  });

  test('escapes an asterisk that only looks like a bullet marker', () => {
    // An indented bullet is not one in react-codemirror's renderer
    expect(escapeDescription('  * indented')).toBe('  \\* indented');
    // And neither is a bare asterisk without the space
    expect(escapeDescription('*emphasised*')).toBe('\\*emphasised\\*');
    // The marker is kept, the wildcard on the same line is not
    expect(escapeDescription("* 'skip' -- skips *:*")).toBe(
      "* 'skip' -- skips \\*:\\*",
    );
  });

  test('escapes the backslashes, so that the escaping can be undone', () => {
    expect(escapeDescription('a \\ b')).toBe('a \\\\ b');
    expect(escapeDescription('already \\* escaped')).toBe(
      'already \\\\\\* escaped',
    );
  });

  test('leaves the underscores of a description alone', () => {
    // apoc.json.path's pathOptions parameter, and db.index.fulltext.queryNodes
    const values =
      "JSON path options: ('ALWAYS_RETURN_LIST', 'DEFAULT_PATH_LEAF_TO_NULL').";
    const italics = 'Valid _key: value_ pairs for the `options` map are:';

    expect(escapeDescription(values)).toBe(values);
    expect(escapeDescription(italics)).toBe(italics);
  });

  /* apoc.node.relationships.exist's relTypes parameter, and a few more, have an
     opening backtick and no closing one. Both renderers show it as a backtick,
     and the prose after it stays prose, so it still gets escaped. */
  test('leaves a backtick that is never closed alone', () => {
    expect(escapeDescription('syntax; `[<]TYPE[>]|.... with a * in it')).toBe(
      'syntax; `[<]TYPE[>]|.... with a \\* in it',
    );

    /* apoc.path.expandConfig's startNode parameter closes four code spans and
       then leaves a fifth open, so the pairing has to be left to right */
    const description =
      'The node to start the algorithm from. `startNode` can be of type `STRING` (elementId()), `INTEGER` (id()), `NODE`, or `LIST<STRING | INTEGER | NODE>.';

    expect(escapeDescription(description)).toBe(description);
  });

  test('pairs the backticks within a line, not across the description', () => {
    expect(escapeDescription('a ` b\nc * d')).toBe('a ` b\nc \\* d');
  });

  test('keeps the newlines a description brings, including a trailing one', () => {
    expect(escapeDescription('first\n\nsecond\n')).toBe('first\n\nsecond\n');
  });

  test('hands back a description that is missing', () => {
    expect(escapeDescription('')).toBe('');
    expect(escapeDescription(undefined)).toBeUndefined();
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
