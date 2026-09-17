import { highlightingFor } from '@codemirror/language';
import { EditorView, HoverTooltipSource } from '@codemirror/view';
import { CypherTokenType } from '@neo4j-cypher/language-support';
import { Hover, MarkupContent } from 'vscode-languageserver-types';
import { HighlightedCypherTokenTypes, tokenTypeToStyleTag } from './constants';
import { CypherConfig } from './langCypher';
import { CodeHighlighter, renderMarkdown } from './markdown';

export function getHoverSource(cfg: CypherConfig): HoverTooltipSource {
  const hoverSource: HoverTooltipSource = (view, pos) => {
    const doc = view.state.doc.toString();
    const hoverInfo = cfg.languageService.hoverInfo(doc, {
      caretPosition: pos,
      dbSchema: cfg.schema ?? {},
    });
    const markdown = getMarkdown(hoverInfo?.contents);

    if (!markdown) {
      return null;
    }

    return {
      pos: pos,
      above: true,
      create() {
        const dom = document.createElement('div');
        dom.className = 'cm-hover-tooltip';
        dom.appendChild(
          renderMarkdown(markdown, cypherCodeHighlighter(view, cfg)),
        );
        return { dom };
      },
    };
  };
  return hoverSource;
}

function getMarkdown(contents: Hover['contents'] | undefined): string {
  if (!contents) {
    return '';
  }
  if (typeof contents === 'string') {
    return contents;
  }
  if (Array.isArray(contents)) {
    return contents.map((content) => getMarkdown(content)).join('\n\n');
  }
  if (MarkupContent.is(contents)) {
    return contents.value;
  }
  // A MarkedString, i.e. a code block with a language
  return ['```' + contents.language, contents.value, '```'].join('\n');
}

/**
 * Highlights cypher code blocks with the same colours the editor itself uses,
 * by looking up the style class of each token in the active highlight style.
 */
function cypherCodeHighlighter(
  view: EditorView,
  cfg: CypherConfig,
): CodeHighlighter {
  return (code, language, target) => {
    if (language && language !== 'cypher') {
      target.textContent = code;
      return;
    }

    const tokens = cfg.languageService.highlightSyntax(code);
    let offset = 0;

    tokens.forEach((token) => {
      const start = token.position.startOffset;
      const end = start + token.length;
      // The tokens are expected to be ordered and non-overlapping, but we
      // don't want to duplicate or drop code if they ever aren't
      if (start < offset || end > code.length) {
        return;
      }
      if (start > offset) {
        target.appendChild(document.createTextNode(code.slice(offset, start)));
      }
      target.appendChild(
        highlightToken(view, code.slice(start, end), token.tokenType),
      );
      offset = end;
    });

    if (offset < code.length) {
      target.appendChild(document.createTextNode(code.slice(offset)));
    }
  };
}

function highlightToken(
  view: EditorView,
  text: string,
  tokenType: CypherTokenType,
): Node {
  const styleTag =
    tokenType === CypherTokenType.none
      ? undefined
      : tokenTypeToStyleTag[tokenType as HighlightedCypherTokenTypes];
  const className = styleTag ? highlightingFor(view.state, [styleTag]) : null;

  if (!className) {
    return document.createTextNode(text);
  }

  const span = document.createElement('span');
  span.className = className;
  span.textContent = text;
  return span;
}
