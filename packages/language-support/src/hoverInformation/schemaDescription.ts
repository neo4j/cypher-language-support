/**
 * Turns the descriptions Neo4j ships in its schema into the markdown hovers are
 * written in. Those descriptions are AsciiDoc flavoured prose, not markdown, so
 * the characters a markdown renderer reads as markup have to be escaped on the
 * way in - '*' above all, which descriptions use as a wildcard:
 * "(e.g. '*:*,name=*neo4j*' for all metrics in neo4j database)".
 *
 * Both renderers of this markdown then show the description as it was written:
 * VS Code, which follows CommonMark, and react-codemirror's own small renderer,
 * which undoes the escapes (see its lang-cypher/markdown.ts).
 *
 * The three things descriptions do use markup for are kept working:
 *  - inline code spans, since every type name in every description is one, e.g.
 *    'Returns the absolute value of an `INTEGER` or `FLOAT`.'
 *  - '_italics_' outside a word, e.g. 'Valid _key: value_ pairs'. Inside a word
 *    an underscore is emphasis in neither renderer, so values such as
 *    'ALWAYS_RETURN_LIST' keep their underscores without being escaped.
 *  - a '* ' starting a line, the bullet lists descriptions such as
 *    db.index.fulltext.queryNodes' write.
 */

/* A '* ' with nothing before it, the one bullet marker react-codemirror's
   renderer accepts. An indented one is not a bullet there, so it gets escaped
   and both renderers show the asterisk instead. */
const bulletMarker = '* ';

/* An inline code span, or the prose up to the next backtick. Single backticks
   only, which is what descriptions use and all react-codemirror pairs. The last
   alternative picks up a backtick that never gets closed - one description in
   the wild has one - and leaves it alone, as both renderers do. */
const codeSpanOrProse = /(`[^`]*`)|([^`]+|`)/g;

/** Escapes the markdown characters in the prose the schema gives us. */
export function escapeSchemaMarkdown(description: string): string {
  // The schema comes off the wire, a description can be missing
  if (!description) {
    return description;
  }

  /* Pairing the backticks line by line keeps an unclosed one from swallowing
     the lines below it, and is the same view of a line the bullet rule takes */
  return description.split('\n').map(escapeLine).join('\n');
}

function escapeLine(line: string): string {
  const bullet = line.startsWith(bulletMarker) ? bulletMarker : '';

  return (
    bullet +
    line.slice(bullet.length).replace(
      codeSpanOrProse,
      /* Nothing inside a code span is escaped: neither renderer unescapes
         there, so the backslash itself would show up, and descriptions put
         wildcards in code spans too - 'use `*:*` to find all JMX beans'.
         Escaping the backslashes in the same pass as the asterisks is what
         keeps the ones we add from being escaped again. */
      (_matched, codeSpan: string | undefined, prose: string) =>
        codeSpan ?? prose.replace(/[\\*]/g, '\\$&'),
    )
  );
}

/* A handful of descriptions are not prose at all but a map type laid out over
   several indented lines:
     {
         stream = false :: BOOLEAN,
         batchSize = 20000 :: INTEGER
     }
   Markdown collapses that into one run-on line, so it goes into a code block
   instead. 'text' rather than no language at all, so that react-codemirror
   leaves the block alone rather than highlighting it as Cypher. */
function carriesOwnLayout(description: string): boolean {
  if (!description) {
    return false;
  }

  const lines = description.trimEnd().split('\n');

  return lines.length > 1 && lines.some((line) => line.startsWith(' '));
}

/** The markdown lines describing one parameter or return value of a method. */
export function descriptionBullet(name: string, description: string): string[] {
  const bullet = `- \`${name}\` -`;

  return carriesOwnLayout(description)
    ? [bullet, '```text', description.trimEnd(), '```']
    : [`${bullet} ${escapeSchemaMarkdown(description)}`];
}
