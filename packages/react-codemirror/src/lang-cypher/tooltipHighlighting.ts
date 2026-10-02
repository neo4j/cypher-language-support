import { CypherTokenType } from '@neo4j-cypher/language-support';
import type { CypherConfig } from './langCypher.js';
import type { EditorState } from '@codemirror/state';
import {
  type HighlightedCypherTokenTypes,
  tokenTypeToStyleTag,
} from './constants.js';
import { highlightingFor } from '@codemirror/language';

/** Highlights the Cypher fragment based of our code highlighter and inserts it into the `target` element */
export type TooltipCypherHighlighter = (
  code: string,
  kind: CypherFragmentKind,
  target: HTMLElement,
  activeParameter?: number,
) => void;

/** The Cypher fragments a hover or signature help shows, each needing its own context to be highlighted */
export type CypherFragmentKind = 'labelExpression' | 'function' | 'procedure';

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
 * Highlights code blocks of the hover/signature help tooltip with the same colours
 * the editor itself uses for cypher, by looking up the style class of each token in the
 * active highlight style.
 */
export function tooltipCypherHighlighter(
  state: EditorState,
  cfg: CypherConfig,
): TooltipCypherHighlighter {
  return (code, kind, target, activeParameter) => {
    const tokens = tokenizeFragment(cfg, code, kind);
    let offset = 0;

    let currentParam = 0;
    tokens.forEach(({ start, end, tokenType }) => {
      // The tokens are expected to be ordered and non-overlapping, but we
      // don't want to duplicate or drop code if they ever aren't
      if (start < offset) {
        return;
      }
      if (start > offset) {
        target.appendChild(document.createTextNode(code.slice(offset, start)));
      }
      const text = code.slice(start, end);

      if (currentParam === activeParameter) {
        const span = document.createElement('span');
        //Only relevant for signature help panel
        span.className = 'cm-signature-help-panel-current-argument';
        span.textContent = text;
        target.appendChild(span);
      } else {
        const highlighted = highlightToken(state, text, tokenType);
        target.appendChild(highlighted);
      }
      if (text === ',' && tokenType === CypherTokenType.separator) {
        currentParam++;
      }
      offset = end;
    });

    if (offset < code.length) {
      target.appendChild(document.createTextNode(code.slice(offset)));
    }
  };
}

function highlightToken(
  state: EditorState,
  text: string,
  tokenType: CypherTokenType,
): Node {
  const styleTag =
    tokenType === CypherTokenType.none
      ? undefined
      : tokenTypeToStyleTag[tokenType as HighlightedCypherTokenTypes];
  const className = styleTag ? highlightingFor(state, [styleTag]) : null;

  if (!className) {
    return document.createTextNode(text);
  }

  const span = document.createElement('span');
  span.className = className;
  span.textContent = text;
  return span;
}
