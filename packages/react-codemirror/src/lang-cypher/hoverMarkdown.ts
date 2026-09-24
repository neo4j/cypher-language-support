/**
 * Renders the markdown of language-support's Hover (hoverInformation/hover.ts
 * and descriptionToMarkdown.ts) into the hover tooltip: fenced code blocks,
 * bullet lists, paragraphs, backslash escapes, and inline code, bold and
 * italic.
 * It is not a general markdown renderer, it handles the shapes hover emits.
 *
 * Everything is inserted as text nodes, so schema-provided descriptions can
 * never inject HTML into the editor.
 */

import {
  CypherFragmentKind,
  cypherFragmentKinds,
} from '@neo4j-cypher/language-support';

/** Fills the `target` element of a hover code block with its highlighted Cypher fragment. */
export type HoverCodeHighlighter = (
  code: string,
  kind: CypherFragmentKind,
  target: HTMLElement,
) => void;

const fence = '```';
// We write our bullets with -, the schema writes its descriptions' with *
const bullets = ['- ', '* '];

function bulletContent(line: string): string | undefined {
  const bullet = bullets.find((marker) => line.startsWith(marker));
  return bullet === undefined ? undefined : line.slice(bullet.length);
}

/* Hover fences its Cypher as ```cypher <kind>, and the descriptions that carry
   their own layout as ```text, which have no kind and render plain */
function fragmentKind(openingFence: string): CypherFragmentKind | undefined {
  const [language, kind] = openingFence.slice(fence.length).split(' ');
  return language === 'cypher'
    ? cypherFragmentKinds.find((fragmentKind) => fragmentKind === kind)
    : undefined;
}

export function renderHoverMarkdown(
  markdown: string,
  highlightHoverCode?: HoverCodeHighlighter,
): HTMLElement {
  const dom = document.createElement('div');
  dom.className = 'cm-hover-markdown';

  const lines = markdown.split('\n');
  let paragraph: string[] = [];
  let i = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const p = document.createElement('p');
    renderInline(p, paragraph.join('\n'));
    dom.appendChild(p);
    paragraph = [];
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith(fence)) {
      flushParagraph();
      const kind = fragmentKind(line);
      const code: string[] = [];
      i++;
      while (i < lines.length && lines[i] !== fence) {
        code.push(lines[i]);
        i++;
      }
      // Skip the closing fence
      i++;
      dom.appendChild(
        createCodeBlock(code.join('\n'), kind, highlightHoverCode),
      );
      continue;
    }

    let itemContent = bulletContent(line);

    if (itemContent !== undefined) {
      flushParagraph();
      const list = document.createElement('ul');
      while (itemContent !== undefined) {
        const item = document.createElement('li');
        renderInline(item, itemContent);
        list.appendChild(item);
        i++;
        itemContent = i < lines.length ? bulletContent(lines[i]) : undefined;
      }
      dom.appendChild(list);
      continue;
    }

    if (line.trim() === '') {
      flushParagraph();
    } else {
      paragraph.push(line);
    }
    i++;
  }

  flushParagraph();

  return dom;
}

function createCodeBlock(
  code: string,
  kind: CypherFragmentKind | undefined,
  highlightHoverCode?: HoverCodeHighlighter,
): HTMLElement {
  const pre = document.createElement('pre');
  const codeElement = document.createElement('code');

  if (kind && highlightHoverCode) {
    highlightHoverCode(code, kind, codeElement);
  } else {
    codeElement.textContent = code;
  }

  pre.appendChild(codeElement);
  return pre;
}

/*  Matches the markdown constructs VS Code would render — code spans, emphasis and the like.
   The first pattern is to render escaped 'special characters' as text instead,
   handling the descriptions escaped in hoverInformation/descriptionToMarkdown.ts
   The escapable character set here is CommonMark's ASCII punctuation, so the two stay in step if it ever escapes more.
   Underscores only count as emphasis outside a word, so that descriptions
   listing values like 'DEFAULT_PATH_LEAF_TO_NULL' keep them — the same rule
   CommonMark (https://spec.commonmark.org/0.31.2/#example-374) follows.
   * is not emphasis here at all, descriptions use it as a wildcard. */
const inlineMarkup =
  /\\([!-/:-@[-`{-~])|`([\s\S]+?)`|\*\*([\s\S]+?)\*\*|(?<!\w)_([^_\n]+)_(?!\w)/g;

function renderInline(target: HTMLElement, text: string) {
  let lastEnd = 0;

  for (const match of text.matchAll(inlineMarkup)) {
    const [matched, escaped, code, bold, italic] = match;

    if (match.index > lastEnd) {
      target.appendChild(
        document.createTextNode(text.slice(lastEnd, match.index)),
      );
    }

    if (escaped !== undefined) {
      target.appendChild(document.createTextNode(escaped));
    } else if (code !== undefined) {
      const element = document.createElement('code');
      element.textContent = code.trim();
      target.appendChild(element);
    } else if (bold !== undefined) {
      const element = document.createElement('strong');
      element.textContent = bold;
      target.appendChild(element);
    } else {
      const element = document.createElement('em');
      element.textContent = italic;
      target.appendChild(element);
    }

    lastEnd = match.index + matched.length;
  }

  if (lastEnd < text.length) {
    target.appendChild(document.createTextNode(text.slice(lastEnd)));
  }
}
