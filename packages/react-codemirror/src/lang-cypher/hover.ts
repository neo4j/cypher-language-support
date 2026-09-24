import { highlightingFor } from '@codemirror/language';
import type { EditorView, HoverTooltipSource } from '@codemirror/view';
import type { CypherFragmentKind } from '@neo4j-cypher/language-support';
import { CypherTokenType } from '@neo4j-cypher/language-support';
import type { Hover } from 'vscode-languageserver-types';
import { MarkupContent } from 'vscode-languageserver-types';
import type { HighlightedCypherTokenTypes } from './constants';
import { tokenTypeToStyleTag } from './constants';
import type { CypherConfig } from './langCypher';
import type { HoverCodeHighlighter } from './hoverMarkdown';
import { renderHoverMarkdown } from './hoverMarkdown';

export function getHoverSource(cfg: CypherConfig): HoverTooltipSource {
  const hoverSource: HoverTooltipSource = (view, pos) => {
    const doc = view.state.doc.toString();
    const hoverInfo = cfg.languageService.hoverInfo(doc, {
      caretPosition: pos,
      dbSchema: cfg.schema ?? {},
    });
    const markdown = hoverMarkdown(hoverInfo);

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
          renderHoverMarkdown(markdown, hoverCodeHighlighter(view, cfg)),
        );
        return { dom };
      },
    };
  };
  return hoverSource;
}

// language-support writes its hovers as a single markdown MarkupContent
function hoverMarkdown(hover: Hover | undefined): string {
  return MarkupContent.is(hover?.contents) ? hover.contents.value : '';
}

//Need some prefixing for the cypher fragment to parse correctly (and get the same highlighting as in a valid query)
const fragmentPrefixes: Record<CypherFragmentKind, string> = {
  labelExpression: 'MATCH (x:',
  function: 'RETURN ',
  procedure: 'CALL ',
};

interface HighlightedRange {
  start: number;
  end: number;
  tokenType: CypherTokenType;
}

/** Exported for testing */
export function tokenizeFragment(
  cfg: CypherConfig,
  code: string,
  kind: CypherFragmentKind,
): HighlightedRange[] {
  const prefix = fragmentPrefixes[kind];

  const tokens = cfg.languageService.highlightSyntax(prefix + code);

  return tokens
    .map((token) => ({
      start: token.position.startOffset - prefix.length,
      end: token.position.startOffset + token.length - prefix.length,
      tokenType: token.tokenType,
    }))
    .filter(({ start }) => start >= 0);
}

/**
 * Highlights the cypher code blocks of the hover tooltip with the same colours
 * the editor itself uses, by looking up the style class of each token in the
 * active highlight style.
 */
function hoverCodeHighlighter(
  view: EditorView,
  cfg: CypherConfig,
): HoverCodeHighlighter {
  return (code, kind, target) => {
    const tokens = tokenizeFragment(cfg, code, kind);
    let offset = 0;

    tokens.forEach(({ start, end, tokenType }) => {
      // The tokens are expected to be ordered and non-overlapping, but we
      // don't want to duplicate or drop code if they ever aren't
      if (start < offset) {
        return;
      }
      if (start > offset) {
        target.appendChild(document.createTextNode(code.slice(offset, start)));
      }
      target.appendChild(
        highlightToken(view, code.slice(start, end), tokenType),
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
