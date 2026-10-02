import type { HoverTooltipSource } from '@codemirror/view';
import type { CypherConfig } from '../langCypher';
import { renderHoverInfo } from './hoverRender';
import { tooltipCypherHighlighter } from '../tooltipHighlighting.js';

export function getHoverSource(cfg: CypherConfig): HoverTooltipSource {
  const hoverSource: HoverTooltipSource = (view, pos) => {
    const doc = view.state.doc.toString();
    const hoverInfo = cfg.languageService.hoverInfo(doc, {
      caretPosition: pos,
      dbSchema: cfg.schema ?? {},
    });

    if (!hoverInfo) {
      return null;
    }

    return {
      pos: pos,
      above: true,
      create() {
        const dom = document.createElement('div');
        dom.className = 'cm-hover-tooltip';
        dom.appendChild(
          renderHoverInfo(hoverInfo, tooltipCypherHighlighter(view.state, cfg)),
        );
        return { dom };
      },
    };
  };
  return hoverSource;
}
