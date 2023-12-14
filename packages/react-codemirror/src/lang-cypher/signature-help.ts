import { EditorState, StateField } from '@codemirror/state';
import { showTooltip, Tooltip } from '@codemirror/view';
import {
  CallClauseContext,
  findParent,
  FunctionInvocationContext,
  parserWrapper,
  signatureHelp,
} from '@neo4j-cypher/language-support';
import { CypherConfig } from './lang-cypher';

function getSignatureHelpTooltip(
  state: EditorState,
  config: CypherConfig,
): Tooltip[] {
  let result: Tooltip[] = [];
  const schema = config.schema;

  if (schema) {
    const pos = state.selection.main.head;
    //const node = syntaxTree(state).resolveInner(pos, -1);
    const tree = parserWrapper.parsingResult;

    if (
      tree &&
      findParent(
        tree.stopNode,
        (parent) =>
          parent instanceof FunctionInvocationContext ||
          parent instanceof CallClauseContext,
      )
    ) {
      const query = state.doc.toString();
      const signatureHelpInfo = signatureHelp(query, schema);
      const activeSignature = signatureHelpInfo.activeSignature;
      const signatures = signatureHelpInfo.signatures;

      if (
        activeSignature !== undefined &&
        signatures[activeSignature].documentation !== undefined
      ) {
        result = [
          {
            pos: pos,
            above: true,
            strictSide: true,
            arrow: true,
            create: () => {
              const dom = document.createElement('div');
              dom.className = 'cm-tooltip-cursor';
              dom.textContent =
                signatures[activeSignature].documentation.toString();
              return { dom };
            },
          },
        ];
      }
    }
  }

  return result;
}

export function signatureHelpTooltip(config: CypherConfig) {
  return StateField.define<readonly Tooltip[]>({
    create: (state) => getSignatureHelpTooltip(state, config),

    update(tooltips, tr) {
      if (!tr.docChanged && !tr.selection) return tooltips;
      return getSignatureHelpTooltip(tr.state, config);
    },

    provide: (f) => showTooltip.computeN([f], (state) => state.field(f)),
  });
}
