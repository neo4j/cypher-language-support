/**
 * Descriptions in hover info are rendered as markdown in VS Code, which eats
 * the wildcard '*' usages some of them have, as in dbms.queryJmx' "(e.g.
 * '*:*,name=*neo4j*' for all metrics)", so we escape those. Not the asterisks a
 * description means as markup though - in a code span, or as a bullet - where
 * the backslash would show up instead. Backslashes are escaped along with them,
 * so react-codemirror's renderer can undo it all (lang-cypher/markdown.ts).
 *
 * Some descriptions are map-style objects (often configs) rather than prose.
 * Markdown would put those on one line, so we tag them as 'text' code blocks
 * and let their own layout through.
 */

/* The bullet marker react-codemirror's renderer accepts: a '* ' with nothing
   before it */
const bulletMarker = '* ';

/* A code span, or the prose up to the next backtick. Pairing left to right, as
   both renderers do, leaves the stray backtick a few descriptions have
   (apoc.nodes.rels', apoc.path.expandConfig') as prose. */
const codeSpanOrProse = /(`[^`]*`)|([^`]+|`)/g;

export function escapeDescriptionForMarkdown(description: string): string {
  // Line by line, so that an unclosed backtick cannot reach the lines below
  return description.split('\n').map(escapeLine).join('\n');
}

function escapeLine(line: string): string {
  const bullet = line.startsWith(bulletMarker) ? bulletMarker : '';

  return (
    bullet +
    line.slice(bullet.length).replace(
      codeSpanOrProse,
      /* Escaping inside a code span would show the backslash, and descriptions
         put wildcards there too, e.g. 'use `*:*` to find all JMX beans'. */
      (_matched, codeSpan: string | undefined, prose: string | undefined) =>
        (codeSpan ?? prose) ? prose.replace(/[\\*]/g, '\\$&') : _matched,
    )
  );
}

/* A map-style description, laid out over several indented lines:
     {
         stream = false :: BOOLEAN,
         batchSize = 20000 :: INTEGER
     }
   Markdown reads the newlines as spaces, so this would come out on one line. */
function carriesOwnLayout(description: string): boolean {
  const lines = description.trimEnd().split('\n');

  return lines.length > 1 && lines.some((line) => line.startsWith(' '));
}

/** The markdown lines describing one parameter or return value of a method. */
export function descriptionBullet(name: string, description: string): string[] {
  const bullet = `- \`${name}\` -`;

  /* Tagged 'text' so it renders plain. Untagged, VS Code colours the block as
     Cypher, the language of the document the hover sits in. */
  return carriesOwnLayout(description)
    ? [bullet, '```text', description.trimEnd(), '```']
    : [`${bullet} ${escapeDescriptionForMarkdown(description)}`];
}
