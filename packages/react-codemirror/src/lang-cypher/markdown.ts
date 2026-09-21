/**
 * Minimal markdown renderer for the markdown we produce ourselves in
 * language-support (hovers, documentation strings): fenced code blocks,
 * inline code, bold/italic, bullet lists, headings and paragraphs.
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
const listItem = /^\s*[-*+] +/;
const heading = /^(#{1,6}) +(.*)$/;

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

    if (listItem.test(line)) {
      flushParagraph();
      const list = document.createElement('ul');
      while (i < lines.length && listItem.test(lines[i])) {
        const item = document.createElement('li');
        renderInline(item, lines[i].replace(listItem, ''));
        list.appendChild(item);
        i++;
      }
      dom.appendChild(list);
      continue;
    }

    const headingMatch = heading.exec(line);
    if (headingMatch) {
      flushParagraph();
      const level = Math.min(headingMatch[1].length, 6);
      const header = document.createElement(`h${level}`);
      renderInline(header, headingMatch[2]);
      dom.appendChild(header);
      i++;
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

// Inline code wins over emphasis, exactly like in markdown. Inline code is
// allowed to span lines, since that is how we emit it in the variable hovers
const inlineMarkup =
  /`([\s\S]+?)`|\*\*([\s\S]+?)\*\*|\*([^*\n]+)\*|_([^_\n]+)_/g;

function renderInline(target: HTMLElement, text: string) {
  let lastEnd = 0;

  for (const match of text.matchAll(inlineMarkup)) {
    const [matched, code, bold, starItalic, underscoreItalic] = match;

    if (match.index > lastEnd) {
      target.appendChild(
        document.createTextNode(text.slice(lastEnd, match.index)),
      );
    }

    if (code !== undefined) {
      const element = document.createElement('code');
      element.textContent = code.trim();
      target.appendChild(element);
    } else if (bold !== undefined) {
      const element = document.createElement('strong');
      element.textContent = bold;
      target.appendChild(element);
    } else {
      const element = document.createElement('em');
      element.textContent = starItalic ?? underscoreItalic;
      target.appendChild(element);
    }

    lastEnd = match.index + matched.length;
  }

  if (lastEnd < text.length) {
    target.appendChild(document.createTextNode(text.slice(lastEnd)));
  }
}
