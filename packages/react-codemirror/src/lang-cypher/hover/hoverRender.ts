/**
 * Renders language-support's HoverInfo into the hover tooltip.
 *
 * Everything is inserted as text nodes, so schema-provided descriptions can
 * never inject HTML into the editor.
 */

import type {
  HoverDescription,
  HoverInfo,
} from '@neo4j-cypher/language-support';
import type {
  CypherFragmentKind,
  TooltipCypherHighlighter,
} from '../tooltipHighlighting.js';

// The schema writes the bullet lists of its descriptions with *
const bullet = '* ';

export function renderHoverInfo(
  info: HoverInfo,
  highlightHoverCode?: TooltipCypherHighlighter,
): HTMLElement {
  const dom = document.createElement('div');
  dom.className = 'cm-hover-info';

  if (info.kind === 'variable') {
    const typeLine = document.createElement('p');
    typeLine.appendChild(
      element('code', `${info.variable}: ${info.types.join(', ')}`),
    );
    dom.appendChild(typeLine);

    if (info.labelExpression !== undefined) {
      dom.appendChild(
        codeBlock(info.labelExpression, 'labelExpression', highlightHoverCode),
      );
    }
    return dom;
  }

  dom.appendChild(codeBlock(info.signature, info.kind, highlightHoverCode));

  const deprecatedMarker = info.isDeprecated
    ? [
        document.createTextNode('('),
        element('em', 'deprecated'),
        document.createTextNode(') '),
      ]
    : [];
  renderDescription(dom, info.description, deprecatedMarker);

  appendDescribedList(dom, 'Parameters', info.parameters);

  if (info.kind === 'function') {
    if (info.returnType) {
      const returns = document.createElement('p');
      returns.append(
        element('strong', 'Returns:'),
        ' ',
        element('code', info.returnType),
      );
      dom.appendChild(returns);
    }
  } else {
    appendDescribedList(dom, 'Returns', info.returnValues);
  }

  return dom;
}

function element(tag: string, text: string): HTMLElement {
  const created = document.createElement(tag);
  created.textContent = text;
  return created;
}

function codeBlock(
  code: string,
  kind: CypherFragmentKind | undefined,
  highlightHoverCode?: TooltipCypherHighlighter,
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

function appendDescribedList(
  dom: HTMLElement,
  heading: string,
  descriptions: HoverDescription[],
) {
  if (descriptions.length === 0) {
    return;
  }

  const headingParagraph = document.createElement('p');
  headingParagraph.appendChild(element('strong', heading));
  dom.appendChild(headingParagraph);

  const list = document.createElement('ul');
  descriptions.forEach(({ name, description }) => {
    const item = document.createElement('li');
    item.append(element('code', name), ' -');

    // Map-style descriptions (often configs) are laid out over several lines
    const trimmed = description.trimEnd();
    if (trimmed.includes('\n')) {
      item.appendChild(codeBlock(trimmed, undefined));
    } else {
      item.append(' ');
      renderInline(item, description);
    }
    list.appendChild(item);
  });
  dom.appendChild(list);
}

/* A schema description is prose that can bring paragraphs and * bullet lists.
   `lead` goes in front of its first paragraph. */
function renderDescription(
  dom: HTMLElement,
  description: string,
  lead: Node[],
) {
  const lines = description.split('\n');
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0 && lead.length === 0) return;
    const p = document.createElement('p');
    p.append(...lead.splice(0));
    renderInline(p, paragraph.join('\n'));
    dom.appendChild(p);
    paragraph = [];
  };

  let i = 0;
  while (i < lines.length) {
    if (lines[i].startsWith(bullet)) {
      flushParagraph();
      const list = document.createElement('ul');
      while (i < lines.length && lines[i].startsWith(bullet)) {
        const item = document.createElement('li');
        renderInline(item, lines[i].slice(bullet.length));
        list.appendChild(item);
        i++;
      }
      dom.appendChild(list);
      continue;
    }

    if (lines[i].trim() === '') {
      if (paragraph.length > 0) flushParagraph();
    } else {
      paragraph.push(lines[i]);
    }
    i++;
  }

  flushParagraph();
}

/* Code spans and italics, the markup descriptions write. Underscores only
   count as emphasis outside a word, so that descriptions listing values like
   'DEFAULT_PATH_LEAF_TO_NULL' keep them - the same rule CommonMark
   (https://spec.commonmark.org/0.31.2/#example-374) follows. */
const inlineMarkup = /`([^`]+)`|(?<!\w)_([^_\n]+)_(?!\w)/g;

function renderInline(target: HTMLElement, text: string) {
  let lastEnd = 0;

  for (const match of text.matchAll(inlineMarkup)) {
    const [matched, code, italic] = match;

    if (match.index > lastEnd) {
      target.append(text.slice(lastEnd, match.index));
    }

    target.appendChild(
      code !== undefined ? element('code', code.trim()) : element('em', italic),
    );

    lastEnd = match.index + matched.length;
  }

  if (lastEnd < text.length) {
    target.append(text.slice(lastEnd));
  }
}
