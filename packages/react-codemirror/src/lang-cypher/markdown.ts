/**
 * Renders the markdown hovers are written in, in language-support: fenced
 * code blocks, bullet lists, paragraphs, backslash escapes, and inline code,
 * bold and italic.
 * It is not a general markdown renderer, it handles the shapes we emit.
 *
 * Everything is inserted as text nodes, so schema-provided descriptions can
 * never inject HTML into the editor.
 */

/** A fence info string, i.e. ```<language> <extra> */
export type CodeBlockInfo = {
  language: string;
  /** Whatever followed the language, e.g. the kind of fragment the block holds */
  extra: string;
};

/** Fills `target` with (optionally highlighted) content of a fenced code block. */
export type CodeHighlighter = (
  code: string,
  info: CodeBlockInfo,
  target: HTMLElement,
) => void;

const fence = '```';
// We write our bullets with -, the schema writes its descriptions' with *
const bullets = ['- ', '* '];

function bulletContent(line: string): string | undefined {
  const bullet = bullets.find((marker) => line.startsWith(marker));
  return bullet === undefined ? undefined : line.slice(bullet.length);
}

function parseOpeningFence(line: string): CodeBlockInfo | undefined {
  if (!line.startsWith(fence)) {
    return undefined;
  }

  const info = line.slice(fence.length);
  const languageEnd = info.indexOf(' ');

  return languageEnd === -1
    ? { language: info, extra: '' }
    : {
        language: info.slice(0, languageEnd),
        extra: info.slice(languageEnd + 1),
      };
}

function isClosingFence(line: string): boolean {
  return line === fence;
}

export function renderMarkdown(
  markdown: string,
  highlightCode?: CodeHighlighter,
): HTMLElement {
  const dom = document.createElement('div');
  dom.className = 'cm-markdown';

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
    const fenceStart = parseOpeningFence(line);

    if (fenceStart) {
      flushParagraph();
      const code: string[] = [];
      i++;
      while (i < lines.length && !isClosingFence(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      // Skip the closing fence
      i++;
      dom.appendChild(
        createCodeBlock(code.join('\n'), fenceStart, highlightCode),
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
  info: CodeBlockInfo,
  highlightCode?: CodeHighlighter,
): HTMLElement {
  const pre = document.createElement('pre');
  const codeElement = document.createElement('code');

  if (highlightCode) {
    highlightCode(code, info, codeElement);
  } else {
    codeElement.textContent = code;
  }

  pre.appendChild(codeElement);
  return pre;
}

/* A backslash escape comes first: language-support escapes the markdown
   characters of the descriptions it interpolates (see its
   hoverInformation/schemaDescription.ts), and the escaped character has to be
   consumed here so that it cannot open markup of its own. The set is
   CommonMark's, every ASCII punctuation character, so the two stay in step if
   language-support ever escapes more than it does today.
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
