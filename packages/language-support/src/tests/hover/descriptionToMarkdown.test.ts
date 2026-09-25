import {
  formatLineForMarkdown,
  escapeDescriptionForMarkdown,
} from '../../hoverInformation/descriptionToMarkdown.js';

/* Uses descriptions from real procedures and
   functions named in the test titles */

describe('escapes the wildcards a description writes as prose', () => {
  test('dbms.queryJmxs query parameter', () => {
    expect(
      escapeDescriptionForMarkdown(
        "A query for MBeans on this MBeanServer (e.g. '*:*,name=*neo4j*' for all metrics in neo4j database).",
      ),
    ).toBe(
      "A query for MBeans on this MBeanServer (e.g. '\\*:\\*,name=\\*neo4j\\*' for all metrics in neo4j database).",
    );
  });

  test('apoc.math.sigmoidPrime description', () => {
    expect(
      escapeDescriptionForMarkdown(
        'Returns the sigmoid prime [ sigmoid(val) * (1 - sigmoid(val)) ] of the given value.',
      ),
    ).toBe(
      'Returns the sigmoid prime [ sigmoid(val) \\* (1 - sigmoid(val)) ] of the given value.',
    );
  });

  test('apoc.algo.aStar description', () => {
    expect(escapeDescriptionForMarkdown('Runs the A* search algorithm.')).toBe(
      'Runs the A\\* search algorithm.',
    );
  });
});

describe('leaves the wildcards inside a code span alone', () => {
  test('dbms.queryJmx description', () => {
    const description =
      'Query JMX management data by domain and name. For instance, use `*:*` to find all JMX beans.';

    expect(escapeDescriptionForMarkdown(description)).toBe(description);
  });

  test('gds.graph.nodeProperties.streams nodeLabels parameter', () => {
    const listed =
      "The node labels to aggregate over. Use `['*']` to indicate all.";

    expect(escapeDescriptionForMarkdown(listed)).toBe(listed);
  });
});

describe('escaping descriptions', () => {
  test('escapes the backslashes, so that the escaping can be undone', () => {
    expect(escapeDescriptionForMarkdown('a \\ b')).toBe('a \\\\ b');
    expect(escapeDescriptionForMarkdown('already \\* escaped')).toBe(
      'already \\\\\\* escaped',
    );
  });

  test('leaves the underscores of a description alone - apoc.json.path pathOptions parameter', () => {
    const values =
      "JSON path options: ('ALWAYS_RETURN_LIST', 'DEFAULT_PATH_LEAF_TO_NULL').";

    expect(escapeDescriptionForMarkdown(values)).toBe(values);
  });

  test('leaves the underscores of a description alone - db.index.fulltext.queryNodes', () => {
    const italics = 'Valid _key: value_ pairs for the `options` map are:';

    expect(escapeDescriptionForMarkdown(italics)).toBe(italics);
  });

  test('leaves a backtick that is never closed alone - apoc.node.relationships.exist relTypes parameter', () => {
    expect(
      escapeDescriptionForMarkdown('syntax; `[<]TYPE[>]|.... with a * in it'),
    ).toBe('syntax; `[<]TYPE[>]|.... with a \\* in it');
  });

  test('leaves a backtick that is never closed alone - apoc.path.expandConfig startNode parameter', () => {
    const description =
      'The node to start the algorithm from. `startNode` can be of type `STRING` (elementId()), `INTEGER` (id()), `NODE`, or `LIST<STRING | INTEGER | NODE>.';

    expect(escapeDescriptionForMarkdown(description)).toBe(description);
  });

  test('pairs the backticks within a line, not across the description', () => {
    expect(escapeDescriptionForMarkdown('a ` b\nc * d')).toBe('a ` b\nc \\* d');
  });

  test('keeps the newlines a description brings, including a trailing one', () => {
    expect(escapeDescriptionForMarkdown('first\n\nsecond\n')).toBe(
      'first\n\nsecond\n',
    );
  });

  test('hands back a description that is missing', () => {
    expect(escapeDescriptionForMarkdown('')).toBe('');
    expect(escapeDescriptionForMarkdown(undefined)).toBeUndefined();
  });
});

describe('description bullets', () => {
  test('keeps the bullet markers of a description that writes a list - dbms.cluster.switchDiscoveryServiceVersion', () => {
    const description = [
      'Possible values are:',
      '',
      '* `V1_ONLY` -- it runs only discovery service v1.',
      '* `V2_ONLY` -- it runs only discovery service v2.',
    ].join('\n');

    expect(escapeDescriptionForMarkdown(description)).toBe(description);
  });

  test('escapes an asterisk that only looks like a bullet marker', () => {
    // An indented bullet is not one in react-codemirror's renderer
    expect(escapeDescriptionForMarkdown('  * indented')).toBe('  \\* indented');
    // And neither is a bare asterisk without the space
    expect(escapeDescriptionForMarkdown('*emphasised*')).toBe(
      '\\*emphasised\\*',
    );
    // The marker is kept, the wildcard on the same line is not
    expect(escapeDescriptionForMarkdown("* 'skip' -- skips *:*")).toBe(
      "* 'skip' -- skips \\*:\\*",
    );
  });

  test('writes a prose description inline', () => {
    expect(
      formatLineForMarkdown('query', "A query for MBeans (e.g. '*:*')."),
    ).toEqual(["- `query` - A query for MBeans (e.g. '\\*:\\*')."]);
  });

  test('writes a description that is several lines of prose inline', () => {
    // The renderers join these lines into one paragraph, as markdown does
    expect(
      formatLineForMarkdown('sort', 'Sorts the list.\nTo sort ascending.'),
    ).toEqual(['- `sort` - Sorts the list.\nTo sort ascending.']);
  });

  test('writes a description that carries its own layout as a code block - apoc.export.csv.all config parameter', () => {
    const description =
      '{\n    delimiter = "," :: STRING,\n    skipLines = 1 :: INTEGER\n}\n';

    expect(formatLineForMarkdown('config', description)).toEqual([
      '- `config` -',
      '```text',
      '{\n    delimiter = "," :: STRING,\n    skipLines = 1 :: INTEGER\n}',
      '```',
    ]);
  });
});
