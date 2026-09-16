import { HoverTooltipSource } from '@codemirror/view';
import { CypherConfig } from './langCypher.js';

export function getHoverSource(cfg: CypherConfig): HoverTooltipSource {
  const hoverSource: HoverTooltipSource = (view, pos) => {
    const doc = view.state.doc.toString();
    const hoverInfo = cfg.languageService.hoverInfo(doc, {
      caretPosition: pos,
      dbSchema: cfg.schema,
    });
    const hoverContent = hoverInfo.contents;
    if (!Array.isArray(hoverContent) && !(typeof hoverContent === 'string')) {
      return {
        pos: pos,
        above: true,
        create() {
          let dom = document.createElement('div');
          dom.textContent = hoverContent.value;
          return { dom };
        },
      };
    }
  };
  return hoverSource;
}
